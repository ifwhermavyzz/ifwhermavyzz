import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionConfig } from 'motion/react';
import { Preloader } from './components/Preloader';
import { SpaceParallaxBackground } from './components/SpaceParallaxBackground';
import { Navbar, NavSectionId } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CommitteesSection } from './components/CommitteesSection';
import { ExperienceSection } from './components/ExperienceSection';
import { RegistrationSection } from './components/RegistrationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MiniAiAssistant } from './components/MiniAiAssistant';
import { CustomGlowingCursor } from './components/CustomGlowingCursor';
import { useIsMobileViewport } from './hooks/useIsMobileViewport';

const AuroraDriftGame = lazy(() =>
  import('./components/AuroraDriftGame').then((m) => ({ default: m.AuroraDriftGame }))
);

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const isMobile = useIsMobileViewport();
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 35, active: false });
  const [shouldLoadGame, setShouldLoadGame] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const gameSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.35,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Subtle GSAP ScrollTrigger reveals across page sections on desktop & mobile
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('main > section:not(#home)');
      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0.72, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: sec,
              start: 'top 88%',
              end: 'top 45%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
      ScrollTrigger.refresh();
    }, mainRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const x = (e.clientX / Math.max(1, window.innerWidth)) * 100;
      const y = (e.clientY / Math.max(1, window.innerHeight)) * 100;
      setSpotlightPos({ x, y, active: true });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [isMobile]);

  useEffect(() => {
    const el = gameSentinelRef.current;
    if (!el || shouldLoadGame) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadGame(true);
          observer.disconnect();
        }
      },
      { rootMargin: '380px 0px', threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoadGame]);

  const scrollToSection = useCallback((id: NavSectionId) => {
    setActiveSection(id);
    if (id === 'game') setShouldLoadGame(true);
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
        {/* Preloader Curtain */}
        <Preloader />

        {/* Global Space Background with Parallax Scroll + R3F Golden Stars & Bubbles */}
        <SpaceParallaxBackground />

        {/* Global Cursor-Following Golden Background Spotlight (Desktop only) */}
        {!isMobile && (
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[3] transition-opacity duration-300"
            style={{
              opacity: spotlightPos.active ? 1 : 0.45,
              background: `radial-gradient(560px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(212, 175, 55, 0.14), rgba(243, 229, 171, 0.04) 42%, transparent 72%)`,
            }}
          />
        )}

        {/* Floating Pill Navbar with 1px Scroll Progress Indicator */}
        <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

        {/* Main Content */}
        <main ref={mainRef} className="relative z-10">
          <HeroSection
            onSecretariatClick={handleSecretariatClick}
            onPlayGameClick={() => scrollToSection('game')}
            onExploreAbout={() => scrollToSection('about')}
          />

          <AboutSection />

          <CommitteesSection onRegisterCommittee={handleSecretariatClick} />

          <ExperienceSection />

          <div ref={gameSentinelRef}>
            {shouldLoadGame ? (
              <Suspense
                fallback={
                  <section
                    id="game"
                    className="relative z-10 mx-auto flex min-h-[540px] w-full max-w-6xl items-center justify-center px-4 py-16 text-xs tracking-[0.2em] text-[#D4AF37]/80 sm:px-6 lg:px-8 lg:py-24"
                  >
                    LOADING AURORA ASCENT...
                  </section>
                }
              >
                <AuroraDriftGame />
              </Suspense>
            ) : (
              <section
                id="game"
                className="relative z-10 mx-auto flex min-h-[540px] w-full max-w-6xl items-center justify-center px-4 py-16 text-xs tracking-[0.2em] text-[#D4AF37]/60 sm:px-6 lg:px-8 lg:py-24"
              >
                AURORA ASCENT · SCROLL TO LAUNCH
              </section>
            )}
          </div>

          <RegistrationSection />

          <ContactSection />
        </main>

        <Footer onNavigate={scrollToSection} />

        {/* Floating Mini AI Assistant FAB & Chat UI */}
        <MiniAiAssistant />

        {/* Desktop Custom Glowing Cursor */}
        <CustomGlowingCursor />
      </div>
    </MotionConfig>
  );
}
