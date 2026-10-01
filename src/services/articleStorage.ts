import { Article, BlogCategory } from '../types/blog';
import { PRESET_IMAGES } from './imageStorage';
import { getAuthHeaders } from './authClient';

const STORAGE_KEY = 'fiorella_blog_articles_v1';
export const ARTICLES_UPDATED_EVENT = 'fiorella_articles_updated';

export const INITIAL_CATEGORIES: BlogCategory[] = [
  { id: 'seo-strategy', name: 'SEO Strategy', description: 'Holistic organic search roadmap and algorithm dynamics' },
  { id: 'technical-seo', name: 'Technical SEO', description: 'Crawlability, Core Web Vitals, Schema markup & site health' },
  { id: 'keyword-research', name: 'Keyword Research', description: 'Intent mapping, competitive gaps, and search volume analysis' },
  { id: 'on-page-seo', name: 'On-Page SEO', description: 'Semantic structure, metadata, heading hierarchy & UX' },
  { id: 'content-strategy', name: 'Content Strategy', description: 'High-utility copywriting, topical authority & search intent' },
  { id: 'case-studies', name: 'Case Studies', description: 'Transparent experiments, methodologies, and documented results' }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'search-intent-over-keyword-density',
    title: 'Search Intent Over Keyword Density: Why Modern SEO Rewards Clarity',
    slug: 'search-intent-over-keyword-density',
    excerpt: 'Why repeating keywords is dead, and how solving the searcher’s explicit goal leads to higher rankings and genuine conversions.',
    content: `## The Death of Keyword Density

In early SEO, keyword density was treated as a mathematical formula: people stuffed exact phrases into every heading, paragraph, and image alt attribute. Today, search engines operate as sophisticated semantic comprehension engines. They evaluate topical entities, contextual relationships, and satisfaction signals.

If a page satisfies the user's implicit and explicit question immediately, it earns topical authority. If it forces the visitor to scroll through 1,500 words of superficial filler before reaching the answer, high bounce rates and low dwell time will degrade its rankings.

### What Actually Constitutes Search Intent?

Search intent boils down to answering one question: **What does the searcher genuinely need when typing this query?**

1. **Informational:** The searcher needs a straightforward explanation or step-by-step resolution.
2. **Navigational:** The searcher is looking for a specific platform, brand, or portal.
3. **Commercial Investigation:** The user is comparing tools, audits, or methodologies before spending capital.
4. **Transactional:** The visitor is ready to book, subscribe, or request a proposal.

> "Clarity always outperforms volume: users and search engines value immediate answers over padded word counts."

### Practical Steps to Align Content with Intent

- **Lead with the solution:** Answer the primary query in the very first paragraph. Avoid burying the lead behind introductory preamble.
- **Use scannable heading hierarchies:** Implement semantic \`<h2>\` and \`<h3>\` elements so both crawlers and mobile readers can locate subsections instantly.
- **Support claims with actionable checklists:** Provide bulleted breakdowns and concise summary callouts.
- **Eliminate fluff:** If a sentence doesn't advance the reader's understanding or solve their issue, delete it.`,
    featuredImage: {
      url: PRESET_IMAGES[0].url,
      altText: 'Search intent analytics and organic keyword ranking metrics display',
      caption: 'Analyzing search intent over synthetic keyword metrics.'
    },
    category: 'SEO Strategy',
    author: {
      name: 'Fiorella',
      role: 'SEO Specialist',
      avatar: '/fiorella.jpg'
    },
    publishedAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-15T09:00:00Z',
    status: 'published',
    readingTime: '3 min read',
    seoTitle: 'Search Intent Over Keyword Density: Why Modern SEO Rewards Clarity',
    seoDescription: 'Discover why repeating keywords hurts rankings and how aligning with search intent drives sustainable organic search traffic and conversions.',
    takeaways: [
      'Identify whether the user wants to learn, find a specific page, compare solutions, or take action.',
      'Prioritize direct answers in the first 100 words before expanding on secondary context.',
      'High dwell time and natural organic engagement follow when you eliminate fluffy filler.'
    ]
  },
  {
    id: 'core-web-vitals-what-moves-the-needle',
    title: 'Core Web Vitals & Technical Foundations: What Actually Moves the Needle',
    slug: 'core-web-vitals-what-moves-the-needle',
    excerpt: 'A practical breakdown of Largest Contentful Paint, Cumulative Layout Shift, and crawl efficiency for modern websites.',
    content: `## De-mystifying Technical SEO Hygiene

Technical SEO is frequently mystified as an arcane discipline, but at its foundation it represents a simple commitment: **making a web property completely frictionless for search engine bots to crawl, render, and index while delivering an instant experience for real human visitors.**

Google's Core Web Vitals establish quantifiable metrics for real-world user experience (UX) signals that directly influence ranking stability.

### The Three Critical Pillars

- **Largest Contentful Paint (LCP):** Measures perceived loading speed. Marks the point in page loading when the main content block has likely rendered. Aim for under 2.5 seconds.
- **Interaction to Next Paint (INP):** Assesses user responsiveness during clicks and taps.
- **Cumulative Layout Shift (CLS):** Gauges visual stability. Prevents sudden layout jumps that cause accidental clicks. Aim for a score under 0.1.

> "A technically clean website gives your quality content the best possible launchpad to be crawled, indexed, and ranked."

### High-Impact Actions That Move The Needle

1. **Preconnect to Critical Origins:** Establish early handshakes for critical assets like web fonts and CDN resources.
2. **Explicit Media Dimensions:** Always specify aspect ratios or explicit width and height on images and embedded frames to eliminate CLS completely.
3. **Minimize Render-Blocking CSS & Scripts:** Use modern bundlers like Vite, keep initial payload sizes minimal, and avoid heavy third-party tracking scripts.
4. **Structured JSON-LD Data:** Feed structured entity information directly into HTML to remove ambiguity for Google Knowledge Graph.`,
    featuredImage: {
      url: PRESET_IMAGES[1].url,
      altText: 'Lighthouse Core Web Vitals performance graph and code inspection',
      caption: 'Lighthouse 100/100 performance benchmarks on modern web apps.'
    },
    category: 'Technical SEO',
    author: {
      name: 'Fiorella',
      role: 'SEO Specialist',
      avatar: '/fiorella.jpg'
    },
    publishedAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
    status: 'published',
    readingTime: '4 min read',
    seoTitle: 'Core Web Vitals & Technical Foundations: What Moves the Needle',
    seoDescription: 'A practical breakdown of Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and crawl efficiency for modern fast websites.',
    takeaways: [
      'A technically clean website gives your quality content the best chance to be indexed and ranked.',
      'Keep your DOM light and avoid excessive uncompressed JavaScript bundles.',
      'Audit your mobile experience first, as Google evaluates sites through mobile-first indexing.'
    ]
  },
  {
    id: 'on-page-seo-checklist-for-service-pages',
    title: 'On-Page SEO Checklist for High-Converting Service Pages',
    slug: 'on-page-seo-checklist-for-service-pages',
    excerpt: 'The essential on-page elements every service page needs to rank for local and commercial search queries without feeling spammy.',
    content: `## Balancing Commercial Intent and Organic Relevancy

A high-performing service landing page must execute two objectives in harmony:
1. Clearly demonstrate domain authority and value to prospective clients.
2. Signal clear topical relevance to search algorithms without descending into clumsy keyword stuffing.

### The Service Page Anatomy Checklist

### 1. Distinctive, Single H1 Tag
Every landing page needs a single \`<h1>\` that unambiguously declares what service is offered, who it serves, and what geographic or commercial scope applies.

### 2. Proof and Real Deliverables
Instead of generic buzzwords like "award-winning solutions", specify the exact deliverables:
- Comprehensive crawl reports
- Keyword difficulty prioritization matrix
- Actionable on-page roadmap

### 3. Human-First Meta Titles and Descriptions
Your \`<title>\` tag is your primary billboard on Google SERPs. Keep it between 50-60 characters, with your primary service keyword placed naturally upfront. Craft your meta description (130-155 characters) with an active call to action.

> "A great service page communicates intent instantly. If a visitor cannot tell what you do within 3 seconds, neither can an automated crawler."

### 4. Semantic Internal Linking
Link complementary services, case studies, and audit guides within body text to pass topical page authority and guide warm visitors deeper into your funnel.`,
    featuredImage: {
      url: PRESET_IMAGES[2].url,
      altText: 'Wireframe and semantic structure of a high-converting service landing page',
      caption: 'Structured anatomy of a high-converting service page.'
    },
    category: 'On-Page SEO',
    author: {
      name: 'Fiorella',
      role: 'SEO Specialist',
      avatar: '/fiorella.jpg'
    },
    publishedAt: '2026-08-28T14:30:00Z',
    updatedAt: '2026-08-28T14:30:00Z',
    status: 'published',
    readingTime: '3 min read',
    seoTitle: 'On-Page SEO Checklist for High-Converting Service Pages',
    seoDescription: 'Discover the essential on-page SEO checklist for service landing pages to rank for high-intent search queries and convert visitors into clients.',
    takeaways: [
      'Create unique, descriptive meta tags for every primary service offering.',
      'Maintain a single, descriptive H1 tag clearly naming the core deliverable.',
      'Strategically link relevant case studies to establish proven credibility.'
    ]
  }
];

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
