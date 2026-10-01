import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, ArrowUpRight, Settings, Plus, Sparkles } from 'lucide-react';
import { Article } from '../types/blog';
import { getPublishedArticles, ARTICLES_UPDATED_EVENT } from '../services/articleStorage';

interface InsightsSectionProps {
  onSelectArticle: (article: Article) => void;
  onOpenDashboard?: () => void;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  onSelectArticle,
  onOpenDashboard,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const loadArticles = async () => {
    const list = await getPublishedArticles();
    setArticles(list);
  };

  useEffect(() => {
    loadArticles();

    const handleUpdate = () => {
      loadArticles();
    };

    window.addEventListener(ARTICLES_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(ARTICLES_UPDATED_EVENT, handleUpdate);
  }, []);

  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))];

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="insights" className="py-16 md:py-24 bg-white dark:bg-[#0d0d0d] border-b border-[#e5e5e5] dark:border-[#262626]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-[#1a1a1a] dark:text-[#ededed] text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-black dark:text-white" />
              <span>Articles & Research</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
              SEO Insights
            </h2>
            <p className="text-sm sm:text-base text-[#666666] dark:text-[#a3a3a3] mt-2 max-w-xl font-normal">
              Practical thoughts on SEO, search visibility, content structure, and organic growth.
            </p>
          </div>

          {onOpenDashboard && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboard}
                id="insights-manage-articles-button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] hover:border-black dark:hover:border-white text-xs font-bold text-[#1a1a1a] dark:text-[#ededed] transition-colors"
                title="Manage and publish articles"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Manage Articles</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Pills (if multiple categories) */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                    : 'bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Published Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              id={`insight-card-${article.slug}`}
              className="group bg-[#f8f8f8] dark:bg-[#141414] rounded-2xl border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-[#1a1a1a] transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-xs overflow-hidden"
            >
              <div>
                {/* Featured Thumbnail */}
                {article.featuredImage?.url && (
                  <div className="h-44 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-b border-[#e5e5e5] dark:border-[#262626]">
                    <img
                      src={article.featuredImage.url}
                      alt={article.featuredImage.altText || article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Meta Header */}
                  <div className="flex items-center justify-between text-xs text-[#666666] dark:text-[#a3a3a3] mb-3 font-medium">
                    <span className="font-bold text-white dark:text-black bg-black dark:bg-white px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#666666] dark:text-[#a3a3a3]" />
                        <span>{article.readingTime}</span>
                      </div>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-base font-black text-[#1a1a1a] dark:text-white mb-2.5 group-hover:underline transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a3a3a3] leading-relaxed line-clamp-3 font-normal">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 pb-6 pt-2">
                <div className="pt-3 border-t border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between text-xs font-bold text-black dark:text-white">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
