import { Article, BlogCategory } from '../types/blog';
import { PRESET_IMAGES } from './imageStorage';
import { getAuthHeaders } from './authClient';
import { INITIAL_ARTICLES, INITIAL_CATEGORIES } from '../data/initialBlogData';

const STORAGE_KEY = 'fiorella_blog_articles_v1';
export const ARTICLES_UPDATED_EVENT = 'fiorella_articles_updated';

export { INITIAL_ARTICLES, INITIAL_CATEGORIES };

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}

function broadcastChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ARTICLES_UPDATED_EVENT));
  }
}

export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return INITIAL_ARTICLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
    return INITIAL_ARTICLES;
  } catch (err) {
    console.error('Error reading articles from storage:', err);
    return INITIAL_ARTICLES;
  }
}

export function saveArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    broadcastChange();
  } catch (err) {
    console.error('Error saving articles to storage:', err);
  }
}

export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const res = await fetch('/api/articles');
    if (res.ok) {
      const data: Article[] = await res.json();
      saveArticles(data);
      return data;
    }
  } catch (err) {
    console.warn('Backend unavailable, using cached published articles:', err);
  }

  const all = getStoredArticles();
  return all
    .filter((a) => a.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const res = await fetch('/api/articles', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data: Article[] = await res.json();
      saveArticles(data);
      return data;
    }
  } catch (err) {
    console.warn('Backend unavailable, using cached articles:', err);
  }

  const all = getStoredArticles();
  return all.sort((a, b) => new Date(b.updatedAt || b.publishedAt).getTime() - new Date(a.updatedAt || a.publishedAt).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`/api/articles/${slug}`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unavailable, using cached slug search:', err);
  }

  const all = getStoredArticles();
  return all.find((a) => a.slug === slug) || null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const all = getStoredArticles();
  return all.find((a) => a.id === id) || null;
}

export async function saveArticle(article: Partial<Article> & { title: string }): Promise<Article> {
  const isUpdate = Boolean(article.id);
  const endpoint = isUpdate ? `/api/articles/${article.id}` : '/api/articles';
  const method = isUpdate ? 'PUT' : 'POST';

  try {
    const res = await fetch(endpoint, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(article),
    });

    if (res.ok) {
      const saved: Article = await res.json();
      const all = getStoredArticles();
      const idx = all.findIndex((a) => a.id === saved.id);
      if (idx >= 0) all[idx] = saved;
      else all.unshift(saved);
      saveArticles(all);
      return saved;
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save article on server');
    }
  } catch (err) {
    console.warn('Server save failed, saving to local cache:', err);
  }

  // Local fallback
  const all = getStoredArticles();
  const now = new Date().toISOString();
  const id = article.id || `article-${Date.now()}`;
  const slug = article.slug || generateSlug(article.title);
  const content = article.content || '';
  const readingTime = article.readingTime || calculateReadingTime(content);

  const existingIndex = all.findIndex((a) => a.id === id || a.slug === slug);

  const fullArticle: Article = {
    id,
    title: article.title,
    slug,
    excerpt: article.excerpt || article.title,
    content,
    featuredImage: article.featuredImage || {
      url: PRESET_IMAGES[0].url,
      altText: article.title,
    },
    category: article.category || 'SEO Strategy',
    author: article.author || {
      name: 'Fiorella',
      role: 'SEO Specialist',
      avatar: '/fiorella.jpg',
    },
    publishedAt: article.status === 'published' ? (article.publishedAt || now) : (article.publishedAt || now),
    updatedAt: now,
    status: article.status || 'draft',
    readingTime,
    seoTitle: article.seoTitle || article.title,
    seoDescription: article.seoDescription || article.excerpt || article.title,
    takeaways: article.takeaways || []
  };

  if (existingIndex >= 0) {
    all[existingIndex] = {
      ...all[existingIndex],
      ...fullArticle,
      updatedAt: now,
    };
  } else {
    all.unshift(fullArticle);
  }

  saveArticles(all);
  return fullArticle;
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to delete article on server');
    }
  } catch (err) {
    console.warn('Server delete failed, updating local cache:', err);
  }

  const all = getStoredArticles();
  const filtered = all.filter((a) => a.id !== id);
  saveArticles(filtered);
}

export async function toggleArticleStatus(id: string): Promise<Article | null> {
  try {
    const res = await fetch(`/api/articles/${id}/toggle`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const updated: Article = await res.json();
      const all = getStoredArticles();
      const idx = all.findIndex((a) => a.id === updated.id);
      if (idx >= 0) all[idx] = updated;
      saveArticles(all);
      return updated;
    }
  } catch (err) {
    console.warn('Server toggle failed, updating local cache:', err);
  }

  const all = getStoredArticles();
  const target = all.find((a) => a.id === id);
  if (!target) return null;

  target.status = target.status === 'published' ? 'draft' : 'published';
  target.updatedAt = new Date().toISOString();
  if (target.status === 'published' && !target.publishedAt) {
    target.publishedAt = target.updatedAt;
  }
  saveArticles(all);
  return target;
}

export async function fetchCategories(): Promise<BlogCategory[]> {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not fetch categories from server, using defaults:', err);
  }
  return INITIAL_CATEGORIES;
}

export async function createCategory(name: string, description?: string): Promise<BlogCategory> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to create category');
  }
  broadcastChange();
  return await res.json();
}

export async function removeCategory(id: string): Promise<void> {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to delete category');
  }
  broadcastChange();
}
