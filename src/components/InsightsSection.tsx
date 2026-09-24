import React from 'react';
import { BookOpen, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import { articlesData, ArticleData } from '../data/portfolioData';

interface InsightsSectionProps {
  onSelectArticle: (article: ArticleData) => void;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ onSelectArticle }) => {
  return (
    <section id="insights" className="py-16 md:py-24 bg-white dark:bg-[#0d0d0d] border-b border-[#e5e5e5] dark:border-[#262626]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-[#1a1a1a] dark:text-[#ededed] text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-black dark:text-white" />
              <span>Articles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
              SEO Insights
            </h2>
            <p className="text-sm sm:text-base text-[#666666] dark:text-[#a3a3a3] mt-2 max-w-xl font-normal">
              Practical thoughts on SEO, content, search visibility, and digital growth.
            </p>
          </div>
        </div>

        {/* 3 Visual Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articlesData.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              id={`insight-card-${article.id}`}
              className="group bg-[#f8f8f8] dark:bg-[#141414] rounded-2xl p-6 border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-[#1a1a1a] transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-xs"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between text-xs text-[#666666] dark:text-[#a3a3a3] mb-3 font-medium">
                  <span className="font-bold text-white dark:text-black bg-black dark:bg-white px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#666666] dark:text-[#a3a3a3]" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="text-base font-black text-[#1a1a1a] dark:text-white mb-2.5 group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a3a3a3] leading-relaxed line-clamp-3 mb-4 font-normal">
                  {article.summary}
                </p>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between text-xs font-bold text-black dark:text-white">
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
