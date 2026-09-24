import React from 'react';
import { ArrowRight, Check, Compass, Cpu, Target, UserCheck } from 'lucide-react';

interface AboutSectionProps {
  onLearnMore: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore }) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white dark:bg-[#0d0d0d] border-b border-[#e5e5e5] dark:border-[#262626]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Statement */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-[#1a1a1a] dark:text-[#ededed] text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-black dark:text-white" />
              <span>About Me</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
              Hi, I'm Fiorella.
            </h2>

            <p className="text-lg sm:text-xl text-[#1a1a1a] dark:text-neutral-200 font-bold leading-relaxed">
              I'm an aspiring SEO specialist focused on helping websites become more visible, useful, and discoverable through search.
            </p>

            <p className="text-sm sm:text-base text-[#666666] dark:text-[#a3a3a3] leading-relaxed">
              I believe sustainable search rankings come from answering human search intent clearly, maintaining clean technical crawlability, and avoiding keyword gimmicks.
            </p>

            <div className="pt-2">
              <button
                onClick={onLearnMore}
                id="about-learn-more-button"
                className="inline-flex items-center gap-2 text-sm font-bold text-black dark:text-white hover:underline transition-all group"
              >
                <span>Learn More About My Approach</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Key Principles Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            
            <div className="p-4 rounded-xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Target className="w-4 h-4 text-black dark:text-white shrink-0" />
                <h3 className="text-sm font-black text-[#1a1a1a] dark:text-white uppercase tracking-wide">Intent-First SEO</h3>
              </div>
              <p className="text-xs text-[#666666] dark:text-[#a3a3a3] leading-relaxed font-medium">
                Prioritizing what searchers actually need instead of stuffing artificial keywords into empty copy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Cpu className="w-4 h-4 text-black dark:text-white shrink-0" />
                <h3 className="text-sm font-black text-[#1a1a1a] dark:text-white uppercase tracking-wide">Clean Technical Hygiene</h3>
              </div>
              <p className="text-xs text-[#666666] dark:text-[#a3a3a3] leading-relaxed font-medium">
                Ensuring search engines can seamlessly crawl, index, and understand site hierarchy and structured data.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f8f8] dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Compass className="w-4 h-4 text-black dark:text-white shrink-0" />
                <h3 className="text-sm font-black text-[#1a1a1a] dark:text-white uppercase tracking-wide">Practical & Measurable</h3>
              </div>
              <p className="text-xs text-[#666666] dark:text-[#a3a3a3] leading-relaxed font-medium">
                Focusing on actionable fixes that deliver real search discovery rather than vanity metrics.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
