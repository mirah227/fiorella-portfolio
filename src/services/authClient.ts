export interface AuthUser {
  userId?: string;
  id?: string;
  email: string;
  role: 'admin';
}

export interface SetupStatusResponse {
  needsSetup: boolean;
  hasAdmin: boolean;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  token: string;
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

export async function checkSetupStatus(): Promise<SetupStatusResponse> {
  try {
    const res = await fetch('/api/auth/setup-status');
    if (!res.ok) {
      return { needsSetup: false, hasAdmin: true };
    }
    return await res.json();
  } catch (err) {
    console.warn('Could not reach setup status endpoint:', err);
    return { needsSetup: false, hasAdmin: true };
  }
}

export async function checkSession(): Promise<{ authenticated: boolean; user?: AuthUser }> {
  const token = getStoredToken();
  if (!token) {
    return { authenticated: false };
  }

  try {
    const res = await fetch('/api/auth/session', {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      clearStoredToken();
      return { authenticated: false };
    }

    const data = await res.json();
    return {
      authenticated: Boolean(data.authenticated),
      user: data.user,
    };
  } catch {
    return { authenticated: false };
  }
}

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed. Please verify credentials.');
  }

  setStoredToken(data.token);
  return data;
}

export async function setupOwnerAccount(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch('/api/auth/setup-owner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create owner account.');
  }

  setStoredToken(data.token);
  return data;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore network error on logout
  } finally {
    clearStoredToken();
  }
}
