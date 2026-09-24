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
import { ArticleModal } from './components/ArticleModal';
import { ServiceModal } from './components/ServiceModal';
import { AboutModal } from './components/AboutModal';
import { ServiceItem, ArticleData } from './data/portfolioData';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  // Scroll spy to highlight active section in navbar
  useEffect(() => {
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
  }, []);

  const scrollToSection = (sectionId: string) => {
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
      />

      {/* Main Content Area */}
      <main className="flex-grow">
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

        {/* 7. SEO Insights */}
        <InsightsSection
          onSelectArticle={(article) => setSelectedArticle(article)}
        />

        {/* 8. Final CTA */}
        <FinalCTA
          onOpenContact={() => setIsContactOpen(true)}
        />
      </main>

      {/* Minimal Footer */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
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

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onOpenContact={() => setIsContactOpen(true)}
      />
    </div>
  );
}
