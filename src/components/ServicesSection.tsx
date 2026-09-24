import React, { useState } from 'react';
import { 
  SearchCheck, 
  Compass, 
  FileText, 
  Code2, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight,
  Layers,
  ChevronRight
} from 'lucide-react';
import { servicesData, ServiceItem } from '../data/portfolioData';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenContact: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService, onOpenContact }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'SearchCheck':
        return <SearchCheck className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Code2':
        return <Code2 className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-white dark:bg-[#0d0d0d] border-b border-[#e5e5e5] dark:border-[#262626]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f8f8f8] dark:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626] text-[#1a1a1a] dark:text-[#ededed] text-xs font-bold uppercase tracking-wider mb-3">
              <span>Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
              Services tailored for organic clarity.
            </h2>
            <p className="text-sm sm:text-base text-[#666666] dark:text-[#a3a3a3] mt-2 max-w-xl font-normal">
              Practical, high-impact SEO solutions focused on sustainable visibility and searcher relevance.
            </p>
          </div>

          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-black dark:text-white hover:underline self-start md:self-end"
          >
            <span>Need a custom scope? Let's discuss</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Clean Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicesData.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              id={`service-card-${service.id}`}
              className="group bg-[#f8f8f8] dark:bg-[#141414] rounded-2xl p-6 border border-[#e5e5e5] dark:border-[#262626] hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-[#1a1a1a] shadow-xs transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Card Icon & Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center group-hover:bg-neutral-800 dark:group-hover:bg-neutral-200 transition-colors duration-200">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-[#666666] dark:text-[#a3a3a3] group-hover:text-black dark:group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-black text-[#1a1a1a] dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {service.title}
                </h3>

                {/* 1-2 sentence description */}
                <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a3a3a3] leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              {/* Tags & Action Footer */}
              <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold bg-white dark:bg-[#202020] border border-[#e5e5e5] dark:border-[#262626] text-[#1a1a1a] dark:text-[#ededed] px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-black dark:text-white group-hover:underline">
                  Deliverables →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
