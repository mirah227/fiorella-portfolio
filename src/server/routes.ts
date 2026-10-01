import { Router, Request, Response, NextFunction } from 'express';
import { verifyPassword, createSessionToken, verifySessionToken, SessionPayload } from './auth';
import {
  hasAdminUsers,
  getAdminUserByEmail,
  createAdminUser,
  getArticles,
  getArticleBySlug,
  saveArticle,
  deleteArticle,
  toggleArticleStatus,
  getCategories,
  addCategory,
  deleteCategory,
} from './db';

export interface AuthenticatedRequest extends Request {
  adminUser?: SessionPayload;
}

export function extractAuthToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = extractAuthToken(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }

  const payload = verifySessionToken(token);
  if (!payload || payload.role !== 'admin') {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session token' });
    return;
  }

  req.adminUser = payload;
  next();
}

export const apiRouter = Router();

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Check if initial owner setup is required
apiRouter.get('/auth/setup-status', (_req: Request, res: Response) => {
  const hasAdmin = hasAdminUsers();
  res.json({
    needsSetup: !hasAdmin,
    hasAdmin,
  });
});

// Create initial owner account (only allowed when no admin exists)
apiRouter.post('/auth/setup-owner', (req: Request, res: Response) => {
  if (hasAdminUsers()) {
    res.status(403).json({ error: 'Owner account is already configured. Please log in.' });
    return;
  }

  const { email, password } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  try {
    const newUser = createAdminUser(email, password);
    const token = createSessionToken(newUser);
    res.json({
      message: 'Owner account created successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create owner account.' });
  }
});

// Admin Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = getAdminUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const isValid = verifyPassword(password, user.salt, user.passwordHash);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = createSessionToken(user);
  res.json({
    message: 'Authentication successful.',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

// Verify Current Session
apiRouter.get('/auth/session', (req: Request, res: Response) => {
  const token = extractAuthToken(req);
  if (!token) {
    res.status(401).json({ authenticated: false, error: 'No active token provided.' });
    return;
  }

  const payload = verifySessionToken(token);
  if (!payload || payload.role !== 'admin') {
    res.status(401).json({ authenticated: false, error: 'Session token has expired or is invalid.' });
    return;
  }

  res.json({
    authenticated: true,
    user: {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    },
  });
});

// Admin Logout
apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// ARTICLES ROUTES
// ==========================================

// GET articles (public gets published only; admin gets all)
apiRouter.get('/articles', (req: Request, res: Response) => {
  const token = extractAuthToken(req);
  let isAdmin = false;
  if (token) {
    const payload = verifySessionToken(token);
    if (payload && payload.role === 'admin') {
      isAdmin = true;
    }
  }

  const articles = getArticles(isAdmin);
  res.json(articles);
});

// GET single article by slug
apiRouter.get('/articles/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const token = extractAuthToken(req);
  let isAdmin = false;
  if (token) {
    const payload = verifySessionToken(token);
    if (payload && payload.role === 'admin') {
      isAdmin = true;
    }
  }

  const article = getArticleBySlug(slug, isAdmin);
  if (!article) {
    res.status(404).json({ error: 'Article not found.' });
    return;
  }

  res.json(article);
});

// CREATE article (Protected)
apiRouter.post('/articles', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const body = req.body;
  if (!body || !body.title || typeof body.title !== 'string') {
    res.status(400).json({ error: 'Article title is required.' });
    return;
  }

  try {
    const created = saveArticle(body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save article.' });
  }
});

// UPDATE article (Protected)
apiRouter.put('/articles/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  if (!body || !body.title) {
    res.status(400).json({ error: 'Article title is required.' });
    return;
  }

  try {
    const updated = saveArticle({ ...body, id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update article.' });
  }
});

// DELETE article (Protected)
apiRouter.delete('/articles/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = deleteArticle(id);
  if (!deleted) {
    res.status(404).json({ error: 'Article not found.' });
    return;
  }
  res.json({ success: true, message: 'Article deleted successfully.' });
});

// TOGGLE article publish status (Protected)
apiRouter.post('/articles/:id/toggle', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const toggled = toggleArticleStatus(id);
  if (!toggled) {
    res.status(404).json({ error: 'Article not found.' });
    return;
  }
  res.json(toggled);
});

// ==========================================
// CATEGORIES ROUTES
// ==========================================

// GET all categories (Public)
apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.json(getCategories());
});

// ADD category (Protected)
apiRouter.post('/categories', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, description } = req.body || {};
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }

  const id = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  const cat = addCategory({ id, name: name.trim(), description });
  res.status(201).json(cat);
});

// DELETE category (Protected)
apiRouter.delete('/categories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = deleteCategory(id);
  if (!deleted) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }
  res.json({ success: true, message: 'Category deleted successfully.' });
});
