import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AuroraParticles } from './components/reactbits/AuroraParticles';
import { Navbar, NavSectionId } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CommitteesSection } from './components/CommitteesSection';
import { RegistrationMode, RegistrationSection } from './components/RegistrationSection';
import { Footer } from './components/Footer';
import { Committee } from './data/committees';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [regMode, setRegMode] = useState<RegistrationMode>('delegate');

  const scrollToSection = useCallback((id: NavSectionId) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const sectionIds: NavSectionId[] = ['home', 'about', 'committees', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-38% 0px -45% 0px',
          threshold: 0.01,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleRegisterClick = () => {
    setRegMode('delegate');
    scrollToSection('contact');
  };

  const handleSecretariatClick = () => {
    setRegMode('secretariat');
    scrollToSection('contact');
  };

  const handleSelectCommitteeForReg = (_committeeId: Committee['id']) => {
    setRegMode('delegate');
    scrollToSection('contact');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#050505] text-[#F8FAFC]">
        {/* Animated Aurora & Interactive Constellation Starfield */}
        <AuroraParticles />

        {/* Subtle Top-to-Bottom Midnight Gradient Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(12,20,44,0.42),transparent_60%)]"
        />

        {/* Floating Glass Pill Navbar */}
        <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

        {/* Main Content */}
        <main className="relative z-10">
          <HeroSection
            onRegisterClick={handleRegisterClick}
            onSecretariatClick={handleSecretariatClick}
            onExploreAbout={() => scrollToSection('about')}
          />

          <AboutSection />

          <CommitteesSection onSelectCommitteeForReg={handleSelectCommitteeForReg} />

          <RegistrationSection mode={regMode} onModeChange={setRegMode} />
        </main>

        <Footer onNavigate={scrollToSection} />
      </div>
    </MotionConfig>
  );
}
