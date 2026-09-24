export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tags: string[];
  deliverables: string[];
}

export interface CaseStudyData {
  id: string;
  badge: string;
  title: string;
  description: string;
  overview: string;
  objectives: string[];
  implementationSteps: {
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'planned';
  }[];
  technicalHighlights: {
    metric: string;
    label: string;
    detail: string;
  }[];
  keyLearnings: string[];
}

export interface ArticleData {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  date: string;
  content: string[];
  takeaways: string[];
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: { name: string; tag?: string }[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'seo-audit',
    title: 'SEO Audit',
    description: 'Find technical and on-page opportunities holding a website back.',
    iconName: 'SearchCheck',
    tags: ['Technical', 'Architecture', 'Indexability'],
    deliverables: [
      'Comprehensive crawl health & indexation report',
      'Identification of broken links, redirects, and canonical issues',
      'Prioritized action items sorted by impact and effort'
    ]
  },
  {
    id: 'keyword-research',
    title: 'Keyword Research',
    description: 'Identify relevant search opportunities based on intent and competition.',
    iconName: 'Compass',
    tags: ['Search Intent', 'SERP Analysis', 'Topic Clusters'],
    deliverables: [
      'Search intent mapping (Informational vs. Commercial)',
      'Keyword difficulty vs. opportunity evaluation',
      'Structured topic clusters for targeted content creation'
    ]
  },
  {
    id: 'on-page-seo',
    title: 'On-Page SEO',
    description: 'Improve page structure, content, metadata, and internal linking.',
    iconName: 'FileText',
    tags: ['Meta Tags', 'Heading Hierarchy', 'Internal Links'],
    deliverables: [
      'Optimized meta titles and descriptive meta descriptions',
      'Semantic header hierarchy (H1, H2, H3)',
      'Strategic internal link architecture to distribute page authority'
    ]
  },
  {
    id: 'technical-seo',
    title: 'Technical SEO',
    description: 'Improve crawlability, indexability, performance, and technical foundations.',
    iconName: 'Code2',
    tags: ['Core Web Vitals', 'Sitemap', 'Robots.txt'],
    deliverables: [
      'Fast loading speed and Core Web Vitals optimization',
      'Clean XML sitemaps and properly configured robots.txt',
      'Structured data (Schema.org JSON-LD) implementation'
    ]
  },
  {
    id: 'content-optimization',
    title: 'Content Optimization',
    description: 'Make existing and new content more useful and search-friendly.',
    iconName: 'Sparkles',
    tags: ['Readability', 'Search Intent', 'Content Refresh'],
    deliverables: [
      'Content audits to identify thin, outdated, or decaying pages',
      'Actionable recommendations to answer search intent deeply',
      'Clear, scannable formatting with relevant rich elements'
    ]
  },
  {
    id: 'seo-strategy',
    title: 'SEO Strategy',
    description: 'Build a practical roadmap for sustainable organic growth.',
    iconName: 'TrendingUp',
    tags: ['Organic Roadmap', 'Competitor Insights', 'Growth'],
    deliverables: [
      'Step-by-step 3-to-6 month execution timeline',
      'Competitor gap analysis and missed search opportunities',
      'Clear tracking framework focused on qualified organic traffic'
    ]
  }
];

export const featuredCaseStudy: CaseStudyData = {
  id: 'building-seo-portfolio',
  badge: 'ONGOING CASE STUDY',
  title: 'Building My SEO Portfolio',
  description: 'Building, optimizing, and measuring this website as a real-world SEO project.',
  overview: 'Rather than using hypothetical numbers or synthetic screenshots, this portfolio itself serves as a live, transparent case study. Every line of code, content element, and technical configuration is deployed following modern search quality standards.',
  objectives: [
    'Achieve 100/100 Google Lighthouse benchmarks across Performance, Accessibility, Best Practices, and SEO.',
    'Build a rock-solid semantic structure with clean Schema.org structured data.',
    'Demonstrate practical keyword research and clear topical authority without keyword stuffing.',
    'Document real indexation, search console setup, and organic discoveries openly.'
  ],
  implementationSteps: [
    {
      title: 'Semantic HTML & Schema Architecture',
      description: 'Structured using clean HTML5 semantics (<main>, <article>, <section>, <header>, <footer>) and implemented Person & WebSite JSON-LD structured data for unambiguous entity recognition.',
      status: 'completed'
    },
    {
      title: 'Core Web Vitals & Mobile-First Build',
      description: 'Zero render-blocking bloat, optimized web typography with preconnect hints, instant loading state, and fully responsive layout designed for mobile search indexing.',
      status: 'completed'
    },
    {
      title: 'Search Intent & Content Relevance',
      description: 'Authored concise, fluff-free descriptions answering direct user queries about SEO services, technical capabilities, and workflow.',
      status: 'completed'
    },
    {
      title: 'GSC Verification & Crawl Monitoring',
      description: 'Setting up clean sitemap submission, monitoring URL inspections, and tracking initial crawl requests.',
      status: 'in-progress'
    },
    {
      title: 'Long-Tail Content & Insights Hub',
      description: 'Publishing targeted informational articles answering real technical and on-page questions.',
      status: 'planned'
    }
  ],
  technicalHighlights: [
    {
      metric: '100 / 100',
      label: 'Lighthouse Target',
      detail: 'Clean markup, fast LCP, zero layout shifts (CLS), and high contrast.'
    },
    {
      metric: '0.0s',
      label: 'Zero Bloat',
      detail: 'No heavy third-party tracking scripts slowing down user experience.'
    },
    {
      metric: 'JSON-LD',
      label: 'Structured Data',
      detail: 'Clean entity markup for personal brand and service offerings.'
    }
  ],
  keyLearnings: [
    'Clarity always outperforms volume: users and search engines value immediate answers over padded word counts.',
    'Technical hygiene (clean code, fast TTFB, accessible layout) creates the foundation for all content to succeed.',
    'Transparency builds genuine credibility in an industry full of unverified claims.'
  ]
};

export const skillsData: SkillCategory[] = [
  {
    title: 'SEO Capabilities',
    description: 'Core disciplines across the organic search lifecycle',
    skills: [
      { name: 'SEO Strategy', tag: 'Core' },
      { name: 'Keyword Research', tag: 'Core' },
      { name: 'On-Page SEO', tag: 'Core' },
      { name: 'Technical SEO', tag: 'Core' },
      { name: 'Content Optimization', tag: 'Core' },
      { name: 'Competitor Research' },
      { name: 'Search Intent Mapping' },
      { name: 'Internal Link Architecture' },
      { name: 'SERP & Snippet Optimization' }
    ]
  },
  {
    title: 'Tools & Platforms',
    description: 'Practical toolset for auditing, analysis, and execution',
    skills: [
      { name: 'Google Search Console', tag: 'Daily Tool' },
      { name: 'Google Analytics 4', tag: 'Analytics' },
      { name: 'WordPress', tag: 'CMS' },
      { name: 'Screaming Frog', tag: 'Crawl Audits' },
      { name: 'SEO & Keyword Research Tools' },
      { name: 'Google PageSpeed / Lighthouse' },
      { name: 'Schema.org JSON-LD' }
    ]
  }
];

export const articlesData: ArticleData[] = [
  {
    id: 'search-intent-over-keyword-density',
    title: 'Search Intent Over Keyword Density: Why Modern SEO Rewards Clarity',
    category: 'SEO Strategy',
    readTime: '3 min read',
    date: 'August 2026',
    summary: 'Why repeating keywords is dead, and how solving the searcher’s explicit goal leads to higher rankings and genuine conversions.',
    content: [
      'In early SEO, keyword density was a primary metric: people stuffed exact phrases into every heading and paragraph. Modern search engines are semantic engines. They parse entities, contextual relationships, and user satisfaction signals.',
      'Search intent boils down to answering one question: What does the person actually need when they type this query? If someone searches "how to fix 404 errors", they don’t want a 2,000-word history of HTTP status codes—they want a straightforward troubleshooting checklist.',
      'When crafting web pages, focus on clarity, logical hierarchy, and immediate utility. Remove filler paragraphs, answer the primary question in the first 100 words, and organize sub-points with clean headings.'
    ],
    takeaways: [
      'Identify whether the user wants to learn, find a specific page, compare solutions, or take action.',
      'Prioritize direct answers before elaborating on context.',
      'High dwell time and low bounce rates naturally follow when you eliminate fluff.'
    ]
  },
  {
    id: 'core-web-vitals-what-moves-the-needle',
    title: 'Core Web Vitals & Technical Foundations: What Actually Moves the Needle',
    category: 'Technical SEO',
    readTime: '4 min read',
    date: 'August 2026',
    summary: 'A practical breakdown of Largest Contentful Paint, Cumulative Layout Shift, and crawl efficiency for modern websites.',
    content: [
      'Technical SEO is often treated like a mystery, but at its core it is about making a website frictionless for both search crawlers and real human visitors.',
      'Core Web Vitals represent Google’s quantifiable standards for user experience. Largest Contentful Paint (LCP) measures how fast the main visual content renders. Cumulative Layout Shift (CLS) measures visual stability so elements do not jump around while loading.',
      'Simple steps yield dramatic technical gains: compress images, avoid render-blocking scripts, ensure server response times are low, and provide explicit width/height dimensions on media.'
    ],
    takeaways: [
      'A technically clean website gives your quality content the best chance to be indexed and ranked.',
      'Keep your DOM light and avoid excessive uncompressed JavaScript bundles.',
      'Audit your mobile experience first, as Google uses mobile-first indexing.'
    ]
  },
  {
    id: 'on-page-seo-checklist-for-service-pages',
    title: 'On-Page SEO Checklist for High-Converting Service Pages',
    category: 'On-Page SEO',
    readTime: '3 min read',
    date: 'August 2026',
    summary: 'The essential on-page elements every service page needs to rank for local and commercial search queries without feeling spammy.',
    content: [
      'A great service page must balance two priorities: clearly demonstrating value to potential clients, while signaling topical relevance to search engines.',
      'Start with a descriptive H1 that states exactly what you do. Follow up with concise paragraphs highlighting who the service is for and specific deliverables. Use descriptive subheadings (H2s) for each core benefit or feature.',
      'Ensure your title tag and meta description are written for humans first—crafting an enticing reason to click through from the search results page.'
    ],
    takeaways: [
      'Unique, descriptive meta tags for every primary page.',
      'Single H1 tag clearly describing the core service.',
      'Internal links connecting related case studies or complementary services.'
    ]
  }
];

export const trustHighlights = [
  'SEO Strategy',
  'Keyword Research',
  'Technical SEO',
  'On-Page Optimization',
  'Google Search Console',
  'Google Analytics 4',
  'Content Strategy',
  'WordPress & CMS'
];
