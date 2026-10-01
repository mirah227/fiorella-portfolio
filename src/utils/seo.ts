import { Article } from '../types/blog';

const DEFAULT_TITLE = 'Fiorella - SEO Specialist Portfolio | Search Visibility & Technical SEO';
const DEFAULT_DESCRIPTION = 'Personal portfolio of Fiorella, an SEO specialist focused on search visibility, intent-driven keyword research, on-page optimization, and technical SEO hygiene.';
const DEFAULT_CANONICAL = 'https://fiorella-seo.com/';
const DEFAULT_OG_IMAGE = 'https://fiorella-seo.com/fiorella.jpg';
const DEFAULT_OG_TYPE = 'website';

function setMetaTag(selector: string, attribute: string, value: string, createIfMissing = true): void {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(selector);
  if (!element && createIfMissing) {
    element = document.createElement('meta');
    const [attrName, attrVal] = selector.replace(/[\[\]'"]/g, '').split('=');
    if (attrName && attrVal) {
      element.setAttribute(attrName, attrVal);
      document.head.appendChild(element);
    }
  }
  if (element) {
    element.setAttribute(attribute, value);
  }
}

function setLinkTag(rel: string, href: string): void {
  if (typeof document === 'undefined') return;
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

const ARTICLE_JSON_LD_ID = 'article-structured-data';

export function updateArticleSEO(article: Article): void {
  if (typeof document === 'undefined') return;

  const pageTitle = `${article.seoTitle || article.title} | Fiorella SEO`;
  const metaDesc = article.seoDescription || article.excerpt;
  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/blog/${article.slug}`
    : `https://fiorella-seo.com/blog/${article.slug}`;
  const imageUrl = article.featuredImage?.url || DEFAULT_OG_IMAGE;

  // 1. Title
  document.title = pageTitle;

  // 2. Standard Meta
  setMetaTag('meta[name="description"]', 'content', metaDesc);
  setLinkTag('canonical', pageUrl);

  // 3. Open Graph
  setMetaTag('meta[property="og:type"]', 'content', 'article');
  setMetaTag('meta[property="og:url"]', 'content', pageUrl);
  setMetaTag('meta[property="og:title"]', 'content', pageTitle);
  setMetaTag('meta[property="og:description"]', 'content', metaDesc);
  setMetaTag('meta[property="og:image"]', 'content', imageUrl);

  // 4. Twitter
  setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'content', pageTitle);
  setMetaTag('meta[name="twitter:description"]', 'content', metaDesc);
  setMetaTag('meta[name="twitter:image"]', 'content', imageUrl);

  // 5. Schema.org Article Structured Data (JSON-LD)
  let script = document.getElementById(ARTICLE_JSON_LD_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = ARTICLE_JSON_LD_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${pageUrl}#article`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': pageUrl
    },
    'headline': article.seoTitle || article.title,
    'description': metaDesc,
    'image': [imageUrl],
    'datePublished': article.publishedAt,
    'dateModified': article.updatedAt || article.publishedAt,
    'author': {
      '@type': 'Person',
      'name': article.author.name,
      'jobTitle': article.author.role,
      'url': 'https://fiorella-seo.com'
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Fiorella',
      'url': 'https://fiorella-seo.com',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://fiorella-seo.com/fiorella.jpg'
      }
    },
    'articleSection': article.category,
    'wordCount': article.content.split(/\s+/).length,
    'inLanguage': 'en-US'
  };

  script.textContent = JSON.stringify(structuredData);
}

export function restoreDefaultSEO(): void {
  if (typeof document === 'undefined') return;

  document.title = DEFAULT_TITLE;
  setMetaTag('meta[name="description"]', 'content', DEFAULT_DESCRIPTION);
  setLinkTag('canonical', DEFAULT_CANONICAL);

  setMetaTag('meta[property="og:type"]', 'content', DEFAULT_OG_TYPE);
  setMetaTag('meta[property="og:url"]', 'content', DEFAULT_CANONICAL);
  setMetaTag('meta[property="og:title"]', 'content', DEFAULT_TITLE);
  setMetaTag('meta[property="og:description"]', 'content', DEFAULT_DESCRIPTION);
  setMetaTag('meta[property="og:image"]', 'content', DEFAULT_OG_IMAGE);

  setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'content', DEFAULT_TITLE);
  setMetaTag('meta[name="twitter:description"]', 'content', DEFAULT_DESCRIPTION);
  setMetaTag('meta[name="twitter:image"]', 'content', DEFAULT_OG_IMAGE);

  const script = document.getElementById(ARTICLE_JSON_LD_ID);
  if (script) {
    script.remove();
  }
}
