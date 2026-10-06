import fs from 'node:fs';
import path from 'node:path';
import { Article, BlogCategory } from '../types/blog';
import { AdminUser, hashPassword, verifyPassword } from './auth';
import { INITIAL_ARTICLES, INITIAL_CATEGORIES } from '../data/initialBlogData';

interface DatabaseSchema {
  users: AdminUser[];
  articles: Article[];
  categories: BlogCategory[];
}

function resolveDbPath(): string {
  // If running on Vercel or Serverless, always use /tmp to avoid touching read-only /var/task
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'fiorella_blog_data.json');
  }

  // Local development: check if data dir exists or is writable
  try {
    const localDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'blog_data.json');
  } catch {
    return path.join('/tmp', 'fiorella_blog_data.json');
  }
}

const DB_PATH = resolveDbPath();

function getInitialDb(): DatabaseSchema {
  const initialUsers: AdminUser[] = [];

  // Check if admin is pre-configured via environment variables
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;

  if (envEmail && envPassword) {
    const { salt, hash } = hashPassword(envPassword);
    initialUsers.push({
      id: 'admin_env_owner',
      email: envEmail,
      passwordHash: hash,
      salt,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return {
    users: initialUsers,
    articles: INITIAL_ARTICLES,
    categories: INITIAL_CATEGORIES,
  };
}

let inMemoryDb: DatabaseSchema | null = null;

function syncEnvUser(db: DatabaseSchema): void {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envEmail && envPassword) {
    const existingIdx = db.users.findIndex((u) => u.email.toLowerCase() === envEmail);
    const { salt, hash } = hashPassword(envPassword);
    const envUser: AdminUser = {
      id: 'admin_env_owner',
      email: envEmail,
      passwordHash: hash,
      salt,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (existingIdx >= 0) {
      db.users[existingIdx] = envUser;
    } else {
      db.users.push(envUser);
    }
  }
}

function loadDb(): DatabaseSchema {
  if (inMemoryDb) {
    syncEnvUser(inMemoryDb);
    return inMemoryDb;
  }

  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      const parsed = JSON.parse(data);
      inMemoryDb = {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        articles: Array.isArray(parsed.articles) ? parsed.articles : INITIAL_ARTICLES,
        categories: Array.isArray(parsed.categories) ? parsed.categories : INITIAL_CATEGORIES,
      };
      syncEnvUser(inMemoryDb);
      return inMemoryDb;
    }
  } catch (err) {
    console.warn('Could not read from DB_PATH, creating fresh db:', err);
  }

  const initial = getInitialDb();
  saveDb(initial);
  inMemoryDb = initial;
  return inMemoryDb;
}

function saveDb(data: DatabaseSchema): void {
  inMemoryDb = data;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not write to disk, keeping in memory:', err);
  }
}

// User Operations
export function hasAdminUsers(): boolean {
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    return true;
  }
  const db = loadDb();
  return db.users.length > 0;
}

export function getAdminUserByEmail(email: string): AdminUser | null {
  const db = loadDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function authenticateAdmin(
  email: string,
  password: string
): { success: boolean; user?: AdminUser; message?: string } {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required' };
  }

  const normalized = email.trim().toLowerCase();

  // 1. Direct environment variable verification (zero latency, resilient to cold starts on Vercel)
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;

  if (envEmail && envPassword && normalized === envEmail) {
    if (password === envPassword) {
      const { salt, hash } = hashPassword(envPassword);
      return {
        success: true,
        user: {
          id: 'admin_env_owner',
          email: normalized,
          passwordHash: hash,
          salt,
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  }

  // 2. Database verification
  const user = getAdminUserByEmail(normalized);
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }

  const isValid = verifyPassword(password, user.salt, user.passwordHash);
  if (!isValid) {
    return { success: false, message: 'Invalid email or password' };
  }

  return { success: true, user };
}

export function createAdminUser(email: string, password: string): AdminUser {
  const db = loadDb();
  const normalized = email.trim().toLowerCase();

  const existing = db.users.find((u) => u.email.toLowerCase() === normalized);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const { salt, hash } = hashPassword(password);
  const user: AdminUser = {
    id: `admin_${Date.now()}`,
    email: normalized,
    passwordHash: hash,
    salt,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(user);
  saveDb(db);
  return user;
}

// Article Operations
export function getArticles(includeDrafts = false): Article[] {
  const db = loadDb();
  let list = db.articles;
  if (!includeDrafts) {
    list = list.filter((a) => a.status === 'published');
  }
  return list.sort(
    (a, b) => new Date(b.publishedAt || b.updatedAt).getTime() - new Date(a.publishedAt || a.updatedAt).getTime()
  );
}

export function getArticleBySlug(slug: string, includeDrafts = false): Article | null {
  const db = loadDb();
  const found = db.articles.find((a) => a.slug === slug);
  if (!found) return null;
  if (!includeDrafts && found.status !== 'published') return null;
  return found;
}

export function saveArticle(article: Partial<Article> & { title: string }): Article {
  const db = loadDb();
  const now = new Date().toISOString();
  const id = article.id || `article-${Date.now()}`;
  const slug =
    article.slug ||
    article.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

  const existingIdx = db.articles.findIndex((a) => a.id === id || a.slug === slug);

  const full: Article = {
    id,
    title: article.title,
    slug,
    excerpt: article.excerpt || article.title,
    content: article.content || '',
    featuredImage: article.featuredImage || {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      altText: article.title,
    },
    category: article.category || 'SEO Strategy',
    author: article.author || {
      name: 'Fiorella',
      role: 'SEO Specialist',
      avatar: '/fiorella.jpg',
    },
    publishedAt: article.publishedAt || (article.status === 'published' ? now : ''),
    updatedAt: now,
    status: article.status || 'draft',
    readingTime: article.readingTime || '3 min read',
    seoTitle: article.seoTitle || article.title,
    seoDescription: article.seoDescription || article.excerpt || article.title,
    takeaways: article.takeaways || [],
  };

  if (existingIdx >= 0) {
    db.articles[existingIdx] = {
      ...db.articles[existingIdx],
      ...full,
      updatedAt: now,
    };
  } else {
    db.articles.unshift(full);
  }

  saveDb(db);
  return full;
}

export function deleteArticle(id: string): boolean {
  const db = loadDb();
  const initialLen = db.articles.length;
  db.articles = db.articles.filter((a) => a.id !== id);
  if (db.articles.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function toggleArticleStatus(id: string): Article | null {
  const db = loadDb();
  const target = db.articles.find((a) => a.id === id);
  if (!target) return null;

  target.status = target.status === 'published' ? 'draft' : 'published';
  target.updatedAt = new Date().toISOString();
  if (target.status === 'published' && !target.publishedAt) {
    target.publishedAt = target.updatedAt;
  }

  saveDb(db);
  return target;
}

// Category Operations
export function getCategories(): BlogCategory[] {
  const db = loadDb();
  return db.categories;
}

export function addCategory(category: BlogCategory): BlogCategory {
  const db = loadDb();
  const existing = db.categories.find((c) => c.name.toLowerCase() === category.name.toLowerCase());
  if (existing) return existing;
  db.categories.push(category);
  saveDb(db);
  return category;
}

export function deleteCategory(id: string): boolean {
  const db = loadDb();
  const initialLen = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id && c.name.toLowerCase() !== id.toLowerCase());
  if (db.categories.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}
