import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenContact: () => void;
  activeSection: string;
  onNavigateHome?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContact,
  activeSection,
  onNavigateHome,
  onNavigateSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Case Studies', href: '#case-study', id: 'case-study' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Blog', href: '#insights', id: 'insights' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === '#contact') {
      onOpenContact();
      return;
    }
    if (onNavigateSection) {
      onNavigateSection(id);
      return;
    }
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#e5e5e5] dark:border-[#262626] shadow-xs py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero', 'hero')}
          className="flex items-center gap-2.5 text-[#1a1a1a] dark:text-[#ededed] font-extrabold text-lg tracking-tight group"
          id="navbar-brand"
        >
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-sm transition-transform group-hover:scale-105">
            F
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-black uppercase tracking-tight text-sm">Fiorella</span>
            <span className="text-[10px] font-bold text-[#666666] dark:text-[#a3a3a3] tracking-wider uppercase">SEO Specialist</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f8f8f8] dark:bg-[#171717] p-1 rounded-full border border-[#e5e5e5] dark:border-[#262626]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                    : 'text-[#666666] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white hover:bg-white/70 dark:hover:bg-neutral-800/70'
                }`}
                id={`nav-link-${link.id}`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Controls (Theme Toggle + CTA) */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            id="theme-toggle-desktop"
            className="p-2 rounded-full border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] text-[#1a1a1a] dark:text-[#ededed] hover:border-black dark:hover:border-white transition-colors focus-visible:outline-2 focus-visible:outline-black dark:focus-visible:outline-white"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          <button
            onClick={onOpenContact}
            id="navbar-cta-button"
            className="inline-flex items-center gap-1.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold px-4 py-2 rounded-full transition-all duration-150 shadow-xs hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Let's Work Together</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            id="theme-toggle-mobile"
            className="p-2 rounded-lg border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#171717] text-[#1a1a1a] dark:text-[#ededed]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>
          
          <button
            onClick={onOpenContact}
            className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-3 py-1.5 rounded-full"
          >
            Contact
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
            className="p-2 rounded-lg text-[#1a1a1a] dark:text-[#ededed] hover:bg-[#f8f8f8] dark:hover:bg-[#171717] border border-[#e5e5e5] dark:border-[#262626]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#141414] border-b border-[#e5e5e5] dark:border-[#262626] px-4 pt-3 pb-5 shadow-lg mt-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className="px-3 py-2 text-sm font-bold text-[#1a1a1a] dark:text-[#ededed] hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f] rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#e5e5e5] dark:border-[#262626] mt-1 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-neutral-800 dark:hover:bg-neutral-200"
              >
                <span>Let's Work Together</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

