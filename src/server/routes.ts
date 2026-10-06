import { Router, Request, Response, NextFunction } from 'express';
import { createSessionToken, verifySessionToken, SessionPayload } from './auth';
import {
  hasAdminUsers,
  authenticateAdmin,
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
  res.setHeader('Content-Type', 'application/json');
  try {
    const token = extractAuthToken(req);
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Admin authentication token required',
      });
      return;
    }

    const payload = verifySessionToken(token);
    if (!payload || payload.role !== 'admin') {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired admin session token',
      });
      return;
    }

    req.adminUser = payload;
    next();
  } catch (err) {
    console.error('requireAdmin error:', err);
    res.status(500).json({
      success: false,
      message: 'Authentication service is temporarily unavailable',
    });
  }
}

export const apiRouter = Router();

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Check if initial owner setup is required
apiRouter.get('/auth/setup-status', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const hasAdmin = hasAdminUsers();
    res.status(200).json({
      success: true,
      needsSetup: !hasAdmin,
      hasAdmin,
    });
  } catch (err) {
    console.error('Setup status error:', err);
    res.status(500).json({
      success: false,
      needsSetup: false,
      hasAdmin: true,
      message: 'Authentication service is temporarily unavailable',
    });
  }
});

// Create initial owner account (only allowed when no admin exists)
apiRouter.post('/auth/setup-owner', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    if (hasAdminUsers()) {
      res.status(403).json({
        success: false,
        message: 'Owner account is already configured. Please log in.',
      });
      return;
    }

    const { email, password } = req.body || {};
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
      return;
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }

    const newUser = createAdminUser(email, password);
    const token = createSessionToken(newUser);
    res.status(201).json({
      success: true,
      message: 'Owner account created successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err: any) {
    console.error('Setup owner error:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Authentication service is temporarily unavailable',
    });
  }
});

// Admin Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    const authResult = authenticateAdmin(email, password);
    if (!authResult.success || !authResult.user) {
      res.status(401).json({
        success: false,
        message: authResult.message || 'Invalid email or password',
      });
      return;
    }

    const token = createSessionToken(authResult.user);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        role: authResult.user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Authentication service is temporarily unavailable',
    });
  }
});

// Verify Current Session
apiRouter.get('/auth/session', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const token = extractAuthToken(req);
    if (!token) {
      res.status(401).json({
        success: false,
        authenticated: false,
        message: 'No active session token provided',
      });
      return;
    }

    const payload = verifySessionToken(token);
    if (!payload || payload.role !== 'admin') {
      res.status(401).json({
        success: false,
        authenticated: false,
        message: 'Session token has expired or is invalid',
      });
      return;
    }

    res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (err) {
    console.error('Session verify error:', err);
    res.status(500).json({
      success: false,
      authenticated: false,
      message: 'Authentication service is temporarily unavailable',
    });
  }
});

// Admin Logout
apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// ==========================================
// ARTICLES ROUTES
// ==========================================

// GET articles (public gets published only; admin gets all)
apiRouter.get('/articles', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const token = extractAuthToken(req);
    let isAdmin = false;
    if (token) {
      const payload = verifySessionToken(token);
      if (payload && payload.role === 'admin') {
        isAdmin = true;
      }
    }

    const articles = getArticles(isAdmin);
    res.status(200).json(articles);
  } catch (err) {
    console.error('Get articles error:', err);
    res.status(500).json({
      success: false,
      message: 'Authentication service is temporarily unavailable',
    });
  }
});

// GET single article by slug
apiRouter.get('/articles/:slug', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
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
      res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
      return;
    }

    res.status(200).json(article);
  } catch (err) {
    console.error('Get single article error:', err);
    res.status(500).json({
      success: false,
      message: 'Authentication service is temporarily unavailable',
    });
  }
});

// CREATE article (Protected)
apiRouter.post('/articles', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const body = req.body;
    if (!body || !body.title || typeof body.title !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Article title is required.',
      });
      return;
    }

    const created = saveArticle(body);
    res.status(201).json(created);
  } catch (err: any) {
    console.error('Create article error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to save article.',
    });
  }
});

// UPDATE article (Protected)
apiRouter.put('/articles/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { id } = req.params;
    const body = req.body;
    if (!body || !body.title) {
      res.status(400).json({
        success: false,
        message: 'Article title is required.',
      });
      return;
    }

    const updated = saveArticle({ ...body, id });
    res.status(200).json(updated);
  } catch (err: any) {
    console.error('Update article error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update article.',
    });
  }
});

// DELETE article (Protected)
apiRouter.delete('/articles/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { id } = req.params;
    const deleted = deleteArticle(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Article deleted successfully.',
    });
  } catch (err) {
    console.error('Delete article error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete article.',
    });
  }
});

// TOGGLE article publish status (Protected)
apiRouter.post('/articles/:id/toggle', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { id } = req.params;
    const toggled = toggleArticleStatus(id);
    if (!toggled) {
      res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
      return;
    }
    res.status(200).json(toggled);
  } catch (err) {
    console.error('Toggle article error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle article status.',
    });
  }
});

// ==========================================
// CATEGORIES ROUTES
// ==========================================

// GET all categories (Public)
apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    res.status(200).json(getCategories());
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories.',
    });
  }
});

// ADD category (Protected)
apiRouter.post('/categories', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { name, description } = req.body || {};
    if (!name || typeof name !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
      return;
    }

    const id = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const cat = addCategory({ id, name: name.trim(), description });
    res.status(201).json(cat);
  } catch (err) {
    console.error('Add category error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add category.',
    });
  }
});

// DELETE category (Protected)
apiRouter.delete('/categories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { id } = req.params;
    const deleted = deleteCategory(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category.',
    });
  }
});
