import { Article, BlogCategory } from '../types/blog';

export interface PresetImage {
  id: string;
  url: string;
  altText: string;
  caption: string;
}

export const PRESET_IMAGES: PresetImage[] = [
  {
    id: 'analytics-dashboard',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    altText: 'Search intent analytics and organic keyword ranking metrics display',
    caption: 'Analyzing search intent over synthetic keyword metrics.'
  },
  {
    id: 'technical-audit',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    altText: 'Lighthouse Core Web Vitals performance graph and code inspection',
    caption: 'Lighthouse 100/100 performance benchmarks on modern web apps.'
  },
  {
    id: 'strategy-notes',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    altText: 'Wireframe and semantic structure of a high-converting service landing page',
    caption: 'Structured anatomy of a high-converting service page.'
  },
  {
    id: 'keyword-matrix',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    altText: 'Data charts representing search volume and click-through rates',
    caption: 'Keyword intent prioritization and competitive gap analysis.'
  }
];

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
