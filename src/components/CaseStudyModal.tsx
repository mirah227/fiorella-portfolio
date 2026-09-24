import React, { useEffect } from 'react';
import { X, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck, Cpu, Code2, Target } from 'lucide-react';
import { featuredCaseStudy } from '../data/portfolioData';

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ isOpen, onClose, onOpenContact }) => {
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
        className="bg-white dark:bg-[#141414] rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-[#e5e5e5] dark:border-[#262626] relative my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Case Study Details"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close case study modal"
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f] transition-colors focus-visible:outline-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pb-6 border-b border-[#e5e5e5] dark:border-[#262626]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-white dark:bg-black animate-pulse" />
            <span>{featuredCaseStudy.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] dark:text-white tracking-tight mb-2">
            {featuredCaseStudy.title}
          </h2>

          <p className="text-sm sm:text-base text-[#666666] dark:text-[#a3a3a3] leading-relaxed">
            {featuredCaseStudy.overview}
          </p>
        </div>

        {/* Technical Target Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
          {featuredCaseStudy.technicalHighlights.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-[#1c1c1c] border border-[#e5e5e5] dark:border-[#2b2b2b]">
              <div className="text-lg font-black text-black dark:text-white">{stat.metric}</div>
              <div className="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-wide">{stat.label}</div>
              <div className="text-[11px] text-[#666666] dark:text-[#a3a3a3] mt-0.5 font-medium">{stat.detail}</div>
            </div>
          ))}
        </div>

        {/* Objectives */}
        <div className="mb-8">
          <h3 className="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-wider mb-3">
            Core Project Objectives
          </h3>
          <div className="space-y-2">
            {featuredCaseStudy.objectives.map((obj, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1a1a1a] dark:text-[#ededed] font-medium">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Roadmap */}
        <div className="mb-8">
          <h3 className="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-wider mb-4">
            Execution Steps & Live Status
          </h3>
          <div className="space-y-3">
            {featuredCaseStudy.implementationSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#1a1a1a] flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-sm font-black text-[#1a1a1a] dark:text-white flex items-center gap-2">
                    <span>{step.title}</span>
                  </div>
                  <p className="text-xs text-[#666666] dark:text-[#a3a3a3] leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                <div className="shrink-0">
                  {step.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white dark:text-black bg-black dark:bg-white px-2.5 py-1 rounded-md uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-white dark:text-black" />
                      <span>Completed</span>
                    </span>
                  )}
                  {step.status === 'in-progress' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-black dark:text-white bg-white dark:bg-[#262626] border border-black dark:border-[#404040] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      <span>In Progress</span>
                    </span>
                  )}
                  {step.status === 'planned' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#666666] dark:text-[#a3a3a3] bg-white dark:bg-[#262626] border border-[#e5e5e5] dark:border-[#333333] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      <Calendar className="w-3 h-3" />
                      <span>Planned</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Practical Learnings */}
        <div className="mb-8 p-5 rounded-2xl bg-black dark:bg-[#1a1a1a] text-white border border-neutral-800 dark:border-[#2b2b2b]">
          <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2">
            Key Working Principle
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-300 dark:text-neutral-300">
            {featuredCaseStudy.keyLearnings.map((learning, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-white font-black">•</span>
                <span>{learning}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer CTA in Modal */}
        <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#666666] dark:text-[#a3a3a3] text-center sm:left font-medium">
            Interested in applying these clean standards to your website?
          </p>
          <button
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            className="w-full sm:w-auto bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold px-6 py-2.5 rounded-full transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <span>Let's Work Together</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
