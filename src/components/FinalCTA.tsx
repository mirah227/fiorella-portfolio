import React from 'react';
import { ArrowUpRight, Mail, MessageSquare } from 'lucide-react';

interface FinalCTAProps {
  onOpenContact: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenContact }) => {
  return (
    <section id="contact-cta" className="py-20 md:py-28 bg-white dark:bg-[#0d0d0d] text-center relative overflow-hidden border-b border-[#e5e5e5] dark:border-[#262626]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="bg-[#f8f8f8] dark:bg-[#141414] rounded-3xl p-8 sm:p-12 md:p-16 border border-[#e5e5e5] dark:border-[#262626] shadow-xs relative">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider mb-5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open for Projects & Collaborations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight mb-4">
            Ready to improve your search visibility?
          </h2>

          <p className="text-base sm:text-lg text-[#666666] dark:text-[#a3a3a3] max-w-xl mx-auto mb-8 font-normal">
            Let's talk about your website, your audience goals, and where search can drive real growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onOpenContact}
              id="final-cta-button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 active:bg-neutral-900 text-white dark:text-black font-bold text-sm px-8 py-3.5 rounded-full shadow-xs hover:-translate-y-0.5 transition-all duration-150 group"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <a
              href="mailto:fiorellacorazon1@gmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1f1f1f] hover:bg-[#f8f8f8] dark:hover:bg-[#282828] text-[#1a1a1a] dark:text-white font-bold text-sm px-6 py-3.5 rounded-full border-2 border-black dark:border-white transition-colors"
            >
              <Mail className="w-4 h-4 text-black dark:text-white" />
              <span>fiorellacorazon1@gmail.com</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-[#e5e5e5] dark:border-[#262626] text-xs text-[#666666] dark:text-[#a3a3a3] flex items-center justify-center gap-4 font-medium">
            <span>Fast response within 24–48 hours</span>
            <span>•</span>
            <span>No obligations</span>
          </div>

        </div>

      </div>
    </section>
  );
};
