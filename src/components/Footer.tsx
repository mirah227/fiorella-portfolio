import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';

interface FooterProps {
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-white dark:bg-[#0d0d0d] border-t border-[#e5e5e5] dark:border-[#262626] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#e5e5e5] dark:border-[#262626]">
          
          {/* Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-xs">
                F
              </div>
              <span className="text-base font-black text-[#1a1a1a] dark:text-white uppercase tracking-tight">Fiorella</span>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#a3a3a3] font-medium">
              SEO Specialist • Search visibility & content strategy
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-[#666666] dark:text-[#a3a3a3]">
            <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="hover:text-black dark:hover:text-white transition-colors">
              Home
            </a>
            <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="hover:text-black dark:hover:text-white transition-colors">
              About
            </a>
            <a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="hover:text-black dark:hover:text-white transition-colors">
              Services
            </a>
            <a href="#case-study" onClick={(e) => handleNavClick(e, '#case-study')} className="hover:text-black dark:hover:text-white transition-colors">
              Case Studies
            </a>
            <a href="#skills" onClick={(e) => handleNavClick(e, '#skills')} className="hover:text-black dark:hover:text-white transition-colors">
              Skills
            </a>
            <a href="#insights" onClick={(e) => handleNavClick(e, '#insights')} className="hover:text-black dark:hover:text-white transition-colors">
              Blog
            </a>
            <button onClick={onOpenContact} className="hover:text-black dark:hover:text-white transition-colors font-bold text-black dark:text-white underline">
              Contact
            </button>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-xs font-bold text-[#666666] dark:text-[#a3a3a3]">
            <a
              href="https://www.linkedin.com/in/fiorella-a-6194b43b5"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3 text-[#666666] dark:text-[#a3a3a3]" />
            </a>
            <a
              href="https://x.com/Ophelia_Sweet01"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>X</span>
              <ArrowUpRight className="w-3 h-3 text-[#666666] dark:text-[#a3a3a3]" />
            </a>
            <a
              href="https://medium.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>Medium</span>
              <ArrowUpRight className="w-3 h-3 text-[#666666] dark:text-[#a3a3a3]" />
            </a>
            <a
              href="mailto:fiorellacorazon1@gmail.com"
              className="hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>Email</span>
              <Mail className="w-3 h-3 text-[#666666] dark:text-[#a3a3a3]" />
            </a>
          </div>

        </div>

        {/* Copyright & Technical Subtext */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#666666] dark:text-[#a3a3a3] gap-3 font-medium">
          <p>© {currentYear} Fiorella. All rights reserved.</p>
          <p className="text-[11px] text-[#666666] dark:text-[#a3a3a3]">
            Designed mobile-first with clean semantic HTML & Core Web Vitals optimization.
          </p>
        </div>

      </div>
    </footer>
  );
};
