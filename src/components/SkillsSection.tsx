import React from 'react';
import { Wrench, CheckCircle, ShieldCheck, Search, Code2, Globe } from 'lucide-react';
import { skillsData } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="py-16 md:py-24 bg-white dark:bg-[#0d0d0d] border-b border-[#e5e5e5] dark:border-[#262626]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-[#1a1a1a] dark:text-[#ededed] text-xs font-bold uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
            Skills & Working Tools
          </h2>
          <p className="text-sm sm:text-base text-[#666666] dark:text-[#a3a3a3] mt-2 font-normal">
            The core disciplines and industry software I use to analyze and execute search strategies.
          </p>
        </div>

        {/* 2-Column Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {skillsData.map((category, idx) => (
            <div
              key={idx}
              className="bg-[#f8f8f8] dark:bg-[#141414] rounded-2xl p-6 sm:p-8 border border-[#e5e5e5] dark:border-[#262626] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">
                    {idx === 0 ? <Search className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                  </div>
                  <h3 className="text-lg font-black text-[#1a1a1a] dark:text-white">
                    {category.title}
                  </h3>
                </div>
                <p className="text-xs text-[#666666] dark:text-[#a3a3a3] mb-6 font-medium">
                  {category.description}
                </p>

                {/* Compact Visual Tags */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        skill.tag
                          ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
                          : 'bg-white dark:bg-[#1f1f1f] border-[#e5e5e5] dark:border-[#2e2e2e] text-[#1a1a1a] dark:text-[#ededed] hover:border-black dark:hover:border-white'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${skill.tag ? (skill.tag ? 'bg-white dark:bg-black' : 'bg-black dark:bg-white') : 'bg-black dark:bg-white'}`} />
                      <span>{skill.name}</span>
                      {skill.tag && (
                        <span className="text-[10px] bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black px-1.5 py-0.2 rounded font-black ml-0.5 uppercase tracking-wider">
                          {skill.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Note */}
              <div className="mt-6 pt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex items-center gap-2 text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-black dark:text-white" />
                <span>Continually practicing and refining modern search guidelines</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
