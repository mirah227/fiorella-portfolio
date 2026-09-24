import React from 'react';
import { ArrowRight, ArrowUpRight, Search, CheckCircle2, Sparkles, Compass, Code2 } from 'lucide-react';

interface HeroProps {
  onOpenContact: () => void;
  onViewWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact, onViewWork }) => {
  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-white dark:bg-[#0d0d0d]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Messaging & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Small Professional Label */}
            <div
              id="hero-label-badge"
              className="inline-flex items-center gap-2 bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded-full px-3.5 py-1.5 mb-6 text-xs font-bold text-[#1a1a1a] dark:text-[#ededed] tracking-wide"
            >
              <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
              <span className="uppercase tracking-wider">SEO Specialist</span>
              <span className="text-[#666666] dark:text-[#a3a3a3]">•</span>
              <span className="text-[#666666] dark:text-[#a3a3a3] font-medium hidden sm:inline">Keyword Research • On-Page • Technical SEO</span>
              <span className="text-[#666666] dark:text-[#a3a3a3] font-medium sm:hidden">Organic Growth</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-main-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a1a1a] dark:text-white tracking-tight leading-[1.1] mb-5"
            >
              SEO that gets you{' '}
              <span className="relative text-black dark:text-white inline-block underline decoration-black dark:decoration-white decoration-4 underline-offset-8">
                found.
              </span>
            </h1>

            {/* Short Supporting Text */}
            <p
              id="hero-subtext"
              className="text-base sm:text-lg text-[#666666] dark:text-[#a3a3a3] max-w-xl leading-relaxed mb-8 font-normal"
            >
              I help websites improve visibility, reach the right audience, and grow through smarter SEO and content strategy.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-8">
              <button
                onClick={onOpenContact}
                id="hero-primary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 active:bg-neutral-900 text-white dark:text-black font-bold text-sm px-7 py-3.5 rounded-full shadow-xs hover:-translate-y-0.5 transition-all duration-150 group"
              >
                <span>Let's Work Together</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={onViewWork}
                id="hero-secondary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-[#141414] hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f] text-[#1a1a1a] dark:text-white font-bold text-sm px-7 py-3.5 rounded-full border-2 border-black dark:border-white shadow-xs transition-all duration-150"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 text-[#1a1a1a] dark:text-white" />
              </button>
            </div>

            {/* Concise Value Bullets */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-[#666666] dark:text-[#a3a3a3] pt-4 border-t border-[#e5e5e5] dark:border-[#262626] w-full font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white shrink-0" />
                <span>Intent-driven keyword research</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white shrink-0" />
                <span>Clean semantic structure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white shrink-0" />
                <span>Practical, sustainable growth</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Hero Element */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center">
              
              {/* Background Geometric Layer */}
              <div className="absolute inset-0 bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] rounded-3xl transform rotate-2 scale-95 transition-transform" />
              
              {/* Main Card / Frame */}
              <div className="relative bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] rounded-2xl p-6 sm:p-7 shadow-xs w-full">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#e5e5e5] dark:border-[#262626]">
                  <div className="flex items-center gap-3">
                    {/* Portrait Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-[#f8f8f8] dark:bg-[#262626] ring-2 ring-black dark:ring-white overflow-hidden flex items-center justify-center text-black font-black text-xl">
                        <img
                          src="/fiorella.jpg"
                          alt="Fiorella, SEO Specialist"
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#141414] rounded-full" title="Active & Available" />
                    </div>

                    <div>
                      <div className="text-base font-black text-[#1a1a1a] dark:text-white leading-tight">Fiorella</div>
                      <p className="text-xs text-black dark:text-neutral-300 font-bold uppercase tracking-wide">SEO Specialist</p>
                      <p className="text-[11px] text-[#666666] dark:text-[#a3a3a3]">Available for projects</p>
                    </div>
                  </div>

                  <span className="text-[11px] bg-black dark:bg-white text-white dark:text-black font-bold px-2.5 py-1 rounded-md">
                    2026
                  </span>
                </div>

                {/* Core Focus Micro-Cards */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                        <Search className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1a1a1a] dark:text-white">Search Visibility</div>
                        <div className="text-[11px] text-[#666666] dark:text-[#a3a3a3]">Intent-matched indexation</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-black dark:text-white bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] px-2 py-0.5 rounded">High Impact</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                        <Code2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1a1a1a] dark:text-white">Technical Foundation</div>
                        <div className="text-[11px] text-[#666666] dark:text-[#a3a3a3]">Core Web Vitals & Schema</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-black dark:text-white bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] px-2 py-0.5 rounded">Semantic</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                        <Compass className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1a1a1a] dark:text-white">Keyword Strategy</div>
                        <div className="text-[11px] text-[#666666] dark:text-[#a3a3a3]">Low-competition opportunities</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-black dark:text-white bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] px-2 py-0.5 rounded">Intent First</span>
                  </div>
                </div>

                {/* Bottom pill label */}
                <div className="mt-4 pt-3 border-t border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between text-[11px] text-[#666666] dark:text-[#a3a3a3]">
                  <span>Methodology</span>
                  <span className="font-bold text-[#1a1a1a] dark:text-white">Show, don't over-explain</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
