import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { MotionConfig } from 'motion/react';
import { Preloader } from './components/Preloader';
import { SpaceParallaxBackground } from './components/SpaceParallaxBackground';
import { Navbar, NavSectionId } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CommitteesSection } from './components/CommitteesSection';
import { ExperienceSection } from './components/ExperienceSection';
import { AuroraDriftGame } from './components/AuroraDriftGame';
import { RegistrationSection } from './components/RegistrationSection';
import { Footer } from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToSection = useCallback((id: NavSectionId) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -20 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const sectionIds: NavSectionId[] = [
      'home',
      'about',
      'committees',
      'experience',
      'game',
      'contact',
    ];
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
          rootMargin: '-36% 0px -46% 0px',
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

  const handleSecretariatClick = () => {
    scrollToSection('contact');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#1A100A] text-[#FAF6EE]">
        {/* jjettas.com-inspired 0% -> 100% Preloader Curtain */}
        <Preloader />

        {/* Global Space Background with Parallax Scroll + Lazy R3F Golden Particles */}
        <SpaceParallaxBackground />

        {/* Floating Pill Navbar */}
        <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

        {/* Main Content */}
        <main className="relative z-10">
          <HeroSection
            onSecretariatClick={handleSecretariatClick}
            onPlayGameClick={() => scrollToSection('game')}
            onExploreAbout={() => scrollToSection('about')}
          />

          <AboutSection />

          <CommitteesSection onRegisterCommittee={handleSecretariatClick} />

          <ExperienceSection />

          <AuroraDriftGame />

          <RegistrationSection />
        </main>

        <Footer onNavigate={scrollToSection} />
      </div>
    </MotionConfig>
  );
}
