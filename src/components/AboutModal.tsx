import React, { useEffect } from 'react';
import { X, Target, Compass, Sparkles, CheckCircle2, ArrowRight, ArrowUpRight, FileDown } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenContact }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
        aria-label="About Fiorella"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close about modal"
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f] transition-colors focus-visible:outline-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#e5e5e5] dark:border-[#262626]">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black shrink-0 border border-[#e5e5e5] dark:border-[#262626]">
            <img
              src="/fiorella.jpg"
              alt="Fiorella, SEO Specialist"
              className="w-full h-full object-cover grayscale"
              loading="lazy"
            />
          </div>
          <div>
            <div className="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-wider">SEO Specialist</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] dark:text-white">About Fiorella</h2>
            <p className="text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">Helping brands gain sustainable search discoverability</p>
          </div>
        </div>

        {/* Bio Body */}
        <div className="space-y-4 text-sm text-[#1a1a1a] dark:text-[#ededed] leading-relaxed mb-6 font-normal">
          <p>
            I am an SEO specialist dedicated to bridging the gap between technical search engine standards and genuine user satisfaction.
          </p>
          <p className="text-[#666666] dark:text-[#a3a3a3]">
            Search optimization is not about tricking algorithms or stuffing repetitive keywords into blog posts. It’s about building clear information architecture, ensuring swift crawlability, and answering user queries better than anyone else on the search results page.
          </p>
        </div>

        {/* Philosophy Points */}
        <div className="space-y-3 mb-8">
          <div className="p-4 rounded-xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#262626]">
            <h3 className="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-black dark:text-white" />
              <span>Search Intent Over Vanity Traffic</span>
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">
              Ranking for 100 relevant buyers is far more valuable than 10,000 visitors who bounce in 2 seconds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#262626]">
            <h3 className="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-black dark:text-white" />
              <span>Transparent & Realistic</span>
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">
              No fake promises of overnight rankings. Sustainable organic growth requires methodical execution and consistency.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href="/cv.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#1a1a1a] dark:text-white hover:underline inline-flex items-center gap-1.5"
          >
            <FileDown className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>View / Print CV</span>
          </a>
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="text-xs font-bold text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white px-3 py-2"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold px-6 py-2.5 rounded-full transition-colors inline-flex items-center gap-1.5"
            >
              <span>Let's Work Together</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
