import React, { useEffect } from 'react';
import { X, Clock, Calendar, CheckCircle2, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ArticleData } from '../data/portfolioData';

interface ArticleModalProps {
  article: ArticleData | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, onOpenContact }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (article) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#141414] rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-[#e5e5e5] dark:border-[#262626] relative my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={article.title}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close article modal"
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f] transition-colors focus-visible:outline-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Article Meta */}
        <div className="flex items-center gap-3 text-xs text-[#666666] dark:text-[#a3a3a3] mb-4 font-medium">
          <span className="font-bold text-white dark:text-black bg-black dark:bg-white px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider">
            {article.category}
          </span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#666666] dark:text-[#a3a3a3]" />
            <span>{article.readTime}</span>
          </div>
          <span>•</span>
          <span>{article.date}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] dark:text-white tracking-tight mb-6">
          {article.title}
        </h2>

        {/* Summary Callout */}
        <div className="p-4 rounded-xl bg-[#f8f8f8] dark:bg-[#1c1c1c] border-l-4 border-black dark:border-white mb-6 text-sm text-[#1a1a1a] dark:text-white font-bold leading-relaxed">
          {article.summary}
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-4 text-sm sm:text-base text-[#1a1a1a] dark:text-[#ededed] leading-relaxed mb-8 font-normal">
          {article.content.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="p-5 rounded-2xl bg-[#f8f8f8] dark:bg-[#1c1c1c] border border-[#e5e5e5] dark:border-[#2b2b2b] mb-8">
          <h3 className="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-wider mb-3">
            Core Actionable Takeaways
          </h3>
          <div className="space-y-2">
            {article.takeaways.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1a1a1a] dark:text-[#ededed] font-medium">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Insights</span>
          </button>
          
          <button
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            className="bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold px-5 py-2 rounded-full transition-colors inline-flex items-center gap-1"
          >
            <span>Discuss This Topic</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
