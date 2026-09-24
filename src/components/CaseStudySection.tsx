import React from 'react';
import { ArrowRight, CheckCircle2, Clock, Sparkles, Layers, ShieldCheck, Code } from 'lucide-react';
import { featuredCaseStudy } from '../data/portfolioData';

interface CaseStudySectionProps {
  onOpenCaseStudy: () => void;
}

export const CaseStudySection: React.FC<CaseStudySectionProps> = ({ onOpenCaseStudy }) => {
  return (
    <section id="case-study" className="py-16 md:py-24 bg-white dark:bg-[#0d0d0d] border-b border-[#e5e5e5] dark:border-[#262626]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-[#1a1a1a] dark:text-[#ededed] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Portfolio Project</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
            Featured Case Study
          </h2>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#a3a3a3] mt-2 font-normal">
            Real methodology and live technical execution over hypothetical claims.
          </p>
        </div>

        {/* Featured Case Study Card */}
        <div className="bg-black dark:bg-[#141414] text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-neutral-800 dark:border-[#262626] shadow-xl">
          
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Case Study Details */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 dark:bg-neutral-800 border border-neutral-700 dark:border-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>{featuredCaseStudy.badge}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {featuredCaseStudy.title}
              </h3>

              {/* Short Description */}
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
                {featuredCaseStudy.description}
              </p>

              {/* Objectives List */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>Semantic HTML5 architecture with Person & WebSite Schema markup.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>Core Web Vitals tuning: zero layout shifts and instant mobile rendering.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 font-medium">
                  <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <span>Live Search Console indexing, sitemap verification, and crawl monitoring.</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  onClick={onOpenCaseStudy}
                  id="view-case-study-cta"
                  className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black text-sm font-bold px-7 py-3.5 rounded-full transition-all duration-150 shadow-xs hover:-translate-y-0.5 group"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </div>

            {/* Right: Technical Focus Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              
              <div className="p-4 rounded-xl bg-neutral-900 dark:bg-[#1c1c1c] border border-neutral-800 dark:border-neutral-700">
                <div className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-1">Architecture</div>
                <div className="text-sm font-black text-white mb-1">Semantic & Accessible</div>
                <div className="text-xs text-neutral-400">Strict hierarchy with H1–H3 structure and JSON-LD schema.</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 dark:bg-[#1c1c1c] border border-neutral-800 dark:border-neutral-700">
                <div className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-1">Performance</div>
                <div className="text-sm font-black text-white mb-1">100/100 Core Web Vitals</div>
                <div className="text-xs text-neutral-400">No render-blocking scripts, lightweight assets, fast TTFB.</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 dark:bg-[#1c1c1c] border border-neutral-800 dark:border-neutral-700">
                <div className="text-xs font-black text-neutral-400 uppercase tracking-wider mb-1">Strategy</div>
                <div className="text-sm font-black text-white mb-1">Authentic Intent Mapping</div>
                <div className="text-xs text-neutral-400">Zero artificial padding; content built for real user needs.</div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
