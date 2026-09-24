import React from 'react';
import { Search, Compass, Code2, Sparkles, BarChart2, Globe, Layers, CheckCircle2 } from 'lucide-react';
import { trustHighlights } from '../data/portfolioData';

export const TrustStrip: React.FC = () => {
  return (
    <section className="py-8 bg-black dark:bg-[#070707] text-white overflow-hidden border-y border-neutral-800 dark:border-[#202020]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Strip Header / Label */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-300">
              Core Disciplines & Working Platforms
            </span>
          </div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
            Real skills • Zero vanity metrics
          </span>
        </div>

        {/* Expertise / Tools List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {trustHighlights.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-2.5 rounded-lg bg-neutral-900 dark:bg-[#141414] border border-neutral-800 dark:border-[#262626] text-neutral-200 text-xs font-bold text-center hover:bg-neutral-800 dark:hover:bg-[#1f1f1f] hover:border-neutral-700 dark:hover:border-neutral-600 hover:text-white transition-colors"
            >
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
