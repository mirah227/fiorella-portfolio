export type ArticleStatus = 'draft' | 'published';

export interface ArticleImage {
  url: string;
  altText: string;
  caption?: string;
}

export interface ArticleAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: ArticleImage;
  category: string;
  author: ArticleAuthor;
  publishedAt: string;
  updatedAt: string;
  status: ArticleStatus;
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  takeaways?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  description?: string;
}
