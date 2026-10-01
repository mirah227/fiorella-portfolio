import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { CaseStudySection } from './components/CaseStudySection';
import { SkillsSection } from './components/SkillsSection';
import { InsightsSection } from './components/InsightsSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ServiceModal } from './components/ServiceModal';
import { AboutModal } from './components/AboutModal';
import { ArticlePage } from './components/blog/ArticlePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ServiceItem } from './data/portfolioData';
import { Article } from './types/blog';
import { restoreDefaultSEO } from './utils/seo';

type AppView = 'home' | 'article' | 'admin';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [articleSlug, setArticleSlug] = useState<string>('');

  // Modals state
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Initialize view from current URL and listen to popstate
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setCurrentView('admin');
      } else if (path.startsWith('/blog/')) {
        const slug = path.replace(/^\/blog\//, '').replace(/\/$/, '');
        if (slug) {
          setArticleSlug(slug);
          setCurrentView('article');
        } else {
          setCurrentView('home');
        }
      } else {
        setCurrentView('home');
        restoreDefaultSEO();
      }
    };

    parseUrl();

    const handlePopState = () => {
      parseUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll spy to highlight active section in navbar (when on home)
  useEffect(() => {
    if (currentView !== 'home') return;

    const sections = ['hero', 'about', 'services', 'case-study', 'skills', 'insights'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Navigation helpers
  const navigateToHome = (sectionId?: string) => {
    setCurrentView('home');
    restoreDefaultSEO();
    window.history.pushState(null, '', sectionId ? `#${sectionId}` : '/');
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToArticle = (slug: string) => {
    setArticleSlug(slug);
    setCurrentView('article');
    window.history.pushState(null, '', `/blog/${slug}`);
  };

  const navigateToAdmin = () => {
    setCurrentView('admin');
    window.history.pushState(null, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      navigateToHome(sectionId);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d0d0d] text-[#1a1a1a] dark:text-[#ededed] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black antialiased transition-colors duration-200">
      {/* Navigation */}
      <Navbar
        activeSection={activeSection}
        onOpenContact={() => setIsContactOpen(true)}
        onNavigateHome={() => navigateToHome()}
        onNavigateSection={(sectionId) => scrollToSection(sectionId)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            {/* 1. Hero Section */}
            <Hero
              onOpenContact={() => setIsContactOpen(true)}
              onViewWork={() => scrollToSection('case-study')}
            />

            {/* 2. Trust / Expertise Strip */}
            <TrustStrip />

            {/* 3. About / Introduction */}
            <AboutSection
              onLearnMore={() => setIsAboutOpen(true)}
            />

            {/* 4. Services */}
            <ServicesSection
              onSelectService={(service) => setSelectedService(service)}
              onOpenContact={() => setIsContactOpen(true)}
            />

            {/* 5. Featured Case Study */}
            <CaseStudySection
              onOpenCaseStudy={() => setIsCaseStudyOpen(true)}
            />

            {/* 6. Skills & Tools */}
            <SkillsSection />

            {/* 7. Dynamic SEO Insights */}
            <InsightsSection
              onSelectArticle={(article: Article) => navigateToArticle(article.slug)}
              onOpenDashboard={() => navigateToAdmin()}
            />

            {/* 8. Final CTA */}
            <FinalCTA
              onOpenContact={() => setIsContactOpen(true)}
            />
          </>
        )}

        {currentView === 'article' && (
          <ArticlePage
            slug={articleSlug}
            onNavigateHome={() => navigateToHome('insights')}
            onNavigateToArticle={(newSlug) => navigateToArticle(newSlug)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onNavigateHome={() => navigateToHome()}
            onNavigateToArticle={(slug) => navigateToArticle(slug)}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onOpenDashboard={() => navigateToAdmin()}
      />

      {/* Interactive Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialService={selectedService ? selectedService.title : undefined}
      />

      <CaseStudyModal
        isOpen={isCaseStudyOpen}
        onClose={() => setIsCaseStudyOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onOpenContact={() => setIsContactOpen(true)}
      />
    </div>
  );
}
