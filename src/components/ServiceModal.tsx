import React, { useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '../data/portfolioData';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onOpenContact }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (service) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#141414] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e5e5e5] dark:border-[#262626] relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label={service.title}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close service details"
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f] transition-colors focus-visible:outline-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {service.tags.map((tag, idx) => (
              <span key={idx} className="text-[11px] font-bold bg-[#f8f8f8] dark:bg-[#1f1f1f] border border-[#e5e5e5] dark:border-[#2e2e2e] text-[#1a1a1a] dark:text-[#ededed] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
            {service.title}
          </h2>
          <p className="text-sm text-[#666666] dark:text-[#a3a3a3] mt-2 leading-relaxed font-normal">
            {service.description}
          </p>
        </div>

        {/* Deliverables Breakdown */}
        <div className="my-6 pt-4 border-t border-[#e5e5e5] dark:border-[#262626]">
          <h3 className="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-wider mb-3">
            What You Receive
          </h3>
          <div className="space-y-2.5">
            {service.deliverables.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1a1a1a] dark:text-[#ededed] font-medium">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#262626] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#666666] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            className="bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold px-5 py-2.5 rounded-full transition-colors inline-flex items-center gap-1.5"
          >
            <span>Inquire About This Service</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
