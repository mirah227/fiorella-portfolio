import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Calendar, CheckCircle2, Share2, Check, ArrowUpRight, BookOpen } from 'lucide-react';
import { Article } from '../../types/blog';
import { getArticleBySlug, getPublishedArticles } from '../../services/articleStorage';
import { updateArticleSEO, restoreDefaultSEO } from '../../utils/seo';
import { RichContentRenderer } from './RichContentRenderer';

interface ArticlePageProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateToArticle: (slug: string) => void;
  onOpenContact: () => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  slug,
  onNavigateHome,
  onNavigateToArticle,
  onOpenContact,
}) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadData() {
      const found = await getArticleBySlug(slug);
      if (!isMounted) return;

      if (found) {
        setArticle(found);
        updateArticleSEO(found);

        // Fetch related articles
        const allPublished = await getPublishedArticles();
        const related = allPublished
          .filter((a) => a.id !== found.id)
          .slice(0, 2);
        setRelatedArticles(related);
      } else {
        setArticle(null);
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadData();

    return () => {
      isMounted = false;
      restoreDefaultSEO();
    };
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#666666] dark:text-[#a3a3a3]">
            Loading SEO Article...
          </span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-36 pb-24 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-xs font-bold uppercase tracking-wider mb-6">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Article Not Found</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] dark:text-white mb-4">
          Looking for an SEO Insight?
        </h1>
        <p className="text-sm text-[#666666] dark:text-[#a3a3a3] mb-8 max-w-md mx-auto">
          The article you are trying to read may have been updated, unpublished, or the URL might be incorrect.
        </p>
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-bold text-xs px-6 py-3 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>
      </div>
    );
  }

  return (
    <article className="pt-28 pb-20 md:pt-36 md:pb-28 bg-white dark:bg-[#0d0d0d] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[#e5e5e5] dark:border-[#262626] text-xs font-bold">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] hover:border-black dark:hover:border-white text-[#1a1a1a] dark:text-[#ededed] transition-colors"
              title="Copy clean article URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Article Meta Header */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">
            <span className="font-bold text-white dark:text-black bg-black dark:bg-white px-3 py-0.5 rounded text-[11px] uppercase tracking-wider">
              {article.category}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readingTime}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight leading-[1.15]">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[#666666] dark:text-[#a3a3a3] leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Author Byline */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#e5e5e5] dark:border-[#262626]">
            <img
              src={article.author.avatar || '/fiorella.jpg'}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-black dark:ring-white"
            />
            <div>
              <div className="text-sm font-black text-[#1a1a1a] dark:text-white leading-tight">
                {article.author.name}
              </div>
              <div className="text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">
                {article.author.role}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && article.featuredImage.url && (
          <figure className="mb-10 rounded-2xl overflow-hidden border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#141414] shadow-sm">
            <img
              src={article.featuredImage.url}
              alt={article.featuredImage.altText || article.title}
              loading="eager"
              decoding="async"
              className="w-full h-auto max-h-[500px] object-cover"
            />
            {article.featuredImage.caption && (
              <figcaption className="text-center text-xs text-[#666666] dark:text-[#a3a3a3] py-2 px-4 italic border-t border-[#e5e5e5] dark:border-[#262626]">
                {article.featuredImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Formatted Content Body */}
        <div className="mb-12">
          <RichContentRenderer content={article.content} />
        </div>

        {/* Actionable Takeaways */}
        {article.takeaways && article.takeaways.length > 0 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] mb-12">
            <h3 className="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
              <span>Core Actionable Takeaways</span>
            </h3>
            <div className="space-y-3">
              {article.takeaways.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-[#1a1a1a] dark:text-[#ededed] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white shrink-0 mt-2" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Together CTA Callout */}
        <div className="p-6 sm:p-8 rounded-2xl bg-black dark:bg-[#171717] text-white border border-neutral-800 dark:border-[#262626] mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight">Need help implementing these SEO strategies?</h3>
            <p className="text-xs text-neutral-400 font-normal">
              From intent research to technical audits, I help websites grow visibility sustainably.
            </p>
          </div>
          <button
            onClick={onOpenContact}
            className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 font-bold text-xs px-6 py-3 rounded-full transition-all shrink-0"
          >
            <span>Let's Work Together</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-8 border-t border-[#e5e5e5] dark:border-[#262626]">
            <h3 className="text-xl font-black text-[#1a1a1a] dark:text-white tracking-tight mb-6">
              More SEO Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigateToArticle(rel.slug)}
                  className="group bg-[#f8f8f8] dark:bg-[#141414] rounded-2xl p-5 border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#666666] dark:text-[#a3a3a3] font-bold mb-2">
                      <span className="uppercase text-black dark:text-white">{rel.category}</span>
                      <span>•</span>
                      <span>{rel.readingTime}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#1a1a1a] dark:text-white group-hover:underline mb-2 line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-[#666666] dark:text-[#a3a3a3] line-clamp-2 font-normal">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between text-xs font-bold text-black dark:text-white">
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
