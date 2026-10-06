export interface AuthUser {
  userId?: string;
  id?: string;
  email: string;
  role: 'admin';
}

export interface SetupStatusResponse {
  success?: boolean;
  needsSetup: boolean;
  hasAdmin: boolean;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  token: string;
}

interface ApiResponseEnvelope<T> {
  success?: boolean;
  message?: string;
  error?: string;
  token?: string;
  user?: AuthUser;
  needsSetup?: boolean;
  hasAdmin?: boolean;
  authenticated?: boolean;
  data?: T;
}

interface SafeFetchResult<T> {
  ok: boolean;
  status: number;
  data: ApiResponseEnvelope<T> | null;
  errorMessage: string | null;
}

const TOKEN_KEY = 'fiorella_admin_token';
export const AUTH_CHANGE_EVENT = 'fiorella_auth_changed';

function broadcastAuthChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  broadcastAuthChange();
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  broadcastAuthChange();
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Resilient JSON fetcher that safely inspects Content-Type and body
 * to prevent JSON parse exceptions when an endpoint or proxy returns HTML/plain-text.
 */
async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type') || '';
    let parsed: ApiResponseEnvelope<T> | null = null;
    let errorMessage: string | null = null;

    if (contentType.includes('application/json')) {
      try {
        parsed = (await res.json()) as ApiResponseEnvelope<T>;
      } catch {
        parsed = null;
      }
    } else {
      // Server returned non-JSON content (e.g. Vercel proxy error, HTML error page, 502/503/500)
      const rawText = await res.text().catch(() => '');
      if (rawText.toLowerCase().includes('server error') || res.status >= 500) {
        errorMessage = 'Authentication service is temporarily unavailable';
      } else if (res.status === 404) {
        errorMessage = 'Authentication endpoint not found';
      } else if (res.status === 401 || res.status === 403) {
        errorMessage = 'Invalid email or password';
      } else {
        errorMessage = 'Authentication service returned an unexpected response format';
      }
    }

    if (!parsed && !errorMessage) {
      if (!res.ok) {
        errorMessage =
          res.status >= 500
            ? 'Authentication service is temporarily unavailable'
            : `Authentication failed (status ${res.status})`;
      }
    }

    return {
      ok: res.ok,
      status: res.status,
      data: parsed,
      errorMessage,
    };
  } catch (networkErr: any) {
    console.warn('Network error during authentication fetch:', networkErr);
    return {
      ok: false,
      status: 0,
      data: null,
      errorMessage: 'Unable to reach authentication service. Please check your internet connection.',
    };
  }
}

export async function checkSetupStatus(): Promise<SetupStatusResponse> {
  const result = await safeFetchJson<SetupStatusResponse>('/api/auth/setup-status');
  if (result.ok && result.data) {
    return {
      needsSetup: Boolean(result.data.needsSetup),
      hasAdmin: Boolean(result.data.hasAdmin),
      success: true,
    };
  }
  // Graceful fallback if endpoint is unreachable or error occurs
  return { needsSetup: false, hasAdmin: true };
}

export async function checkSession(): Promise<{ authenticated: boolean; user?: AuthUser }> {
  const token = getStoredToken();
  if (!token) {
    return { authenticated: false };
  }

  const result = await safeFetchJson<{ authenticated: boolean; user?: AuthUser }>('/api/auth/session', {
    headers: getAuthHeaders(),
  });

  if (!result.ok || !result.data?.authenticated) {
    clearStoredToken();
    return { authenticated: false };
  }

  return {
    authenticated: true,
    user: result.data.user,
  };
}

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const result = await safeFetchJson<LoginResponse>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (!result.ok || !result.data || result.data.success === false) {
    const message =
      result.data?.message ||
      result.data?.error ||
      result.errorMessage ||
      'Invalid email or password';
    throw new Error(message);
  }

  const token = result.data.token;
  if (!token) {
    throw new Error(result.data.message || 'Authentication failed: Missing session token');
  }

  setStoredToken(token);
  return {
    success: true,
    message: result.data.message || 'Login successful',
    token,
    user: result.data.user || { email: email.trim(), role: 'admin' },
  };
}

export async function setupOwnerAccount(email: string, password: string): Promise<LoginResponse> {
  const result = await safeFetchJson<LoginResponse>('/api/auth/setup-owner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (!result.ok || !result.data || result.data.success === false) {
    const message =
      result.data?.message ||
      result.data?.error ||
      result.errorMessage ||
      'Failed to create owner account.';
    throw new Error(message);
  }

  const token = result.data.token;
  if (!token) {
    throw new Error(result.data.message || 'Account created but token was not received');
  }

  setStoredToken(token);
  return {
    success: true,
    message: result.data.message || 'Owner account created successfully',
    token,
    user: result.data.user || { email: email.trim(), role: 'admin' },
  };
}

export async function logoutAdmin(): Promise<void> {
  try {
    await safeFetchJson('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore network error on logout
  } finally {
    clearStoredToken();
  }
}
