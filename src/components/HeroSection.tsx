import { useRef } from 'react';
import { ArrowDown, ArrowUpRight, Gamepad2 } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { BRAND_ASSETS } from '../data/committees';
import { Spotlight, CursorSpotlightRegion } from './aceternity/Spotlight';
import { TextGenerateEffect } from './aceternity/TextGenerateEffect';

interface HeroSectionProps {
  onSecretariatClick: () => void;
  onPlayGameClick: () => void;
  onExploreAbout: () => void;
}

export function HeroSection({
  onSecretariatClick,
  onPlayGameClick,
  onExploreAbout,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const crestY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8"
    >
      {/* Aceternity Overhead Spotlight */}
      <Spotlight className="-top-40 left-0 md:-top-24 md:left-44" fill="#D4AF37" />

      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: heroOpacity }}
        className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      >
        {/* Official Circular Aurora Summit 1.0 Logo with continuous levitation & scroll parallax */}
        <motion.div
          style={prefersReducedMotion ? undefined : { y: crestY }}
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-5 rounded-full opacity-65 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(212, 175, 55, 0.45) 0%, rgba(26, 16, 10, 0) 70%)',
              }}
            />
            <img
              src={BRAND_ASSETS.logo}
              alt="Aurora Summit 1.0 Official Crest"
              referrerPolicy="no-referrer"
              className="relative h-28 w-28 rounded-full border-2 border-[#D4AF37]/65 object-cover shadow-[0_0_55px_-8px_rgba(212,175,55,0.55)] sm:h-36 sm:w-36"
            />
          </motion.div>
        </motion.div>

        <motion.div
          style={prefersReducedMotion ? undefined : { y: textY }}
          className="flex flex-col items-center"
        >
          {/* Clean Unboxed Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-4 flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium tracking-[0.2em] text-[#D4AF37] sm:text-sm"
          >
            <span>Aurora Summit 1.0</span>
            <span aria-hidden="true">·</span>
            <span>Model United Nations</span>
            <span aria-hidden="true">·</span>
            <span>6 Chambers &amp; 1 Surprise</span>
          </motion.div>

          {/* Mouse-Following Spotlight Highlighting Aceternity TextGenerateEffect */}
          <CursorSpotlightRegion className="w-full max-w-4xl px-2 py-3">
            <TextGenerateEffect
              words="The Aurora Summit - A Constellation of Voices"
              startDelay={0.4}
              className="font-serif text-[clamp(2.25rem,5.8vw,4.75rem)] leading-[1.08] font-semibold tracking-tight [text-wrap:balance]"
            />
          </CursorSpotlightRegion>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-[#D6C7B2] sm:text-lg"
          >
            Convene beneath celestial gold across UNEP, UNCSW, IPL, CBI, IPC, and AIPPM—where
            diplomacy, crisis strategy, and editorial storytelling meet.
          </motion.p>

          {/* Primary & Secondary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
          >
            <button
              type="button"
              onClick={onSecretariatClick}
              className="group relative inline-flex min-h-[46px] items-center gap-2 overflow-hidden rounded-full border border-[#F3E5AB]/50 bg-gradient-to-r from-[#D4AF37] via-[#E5C667] to-[#C69C2B] px-7 py-3 text-sm font-semibold text-[#1A100A] shadow-[0_14px_36px_-10px_rgba(212,175,55,0.55)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Secretariat Application</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={onPlayGameClick}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#1A100A]/80 px-5 py-3 text-sm font-medium text-[#F3E5AB] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/15"
            >
              <Gamepad2 className="h-4 w-4 text-[#D4AF37]" />
              <span>Play Aurora Ascent</span>
            </button>
          </motion.div>

          <motion.button
            type="button"
            onClick={onExploreAbout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.05 }}
            aria-label="Scroll to About section"
            className="mt-12 inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-[0.16em] text-[#C5B49A] transition-colors hover:text-[#F3E5AB]"
          >
            <span>Explore the Summit</span>
            <ArrowDown className="h-3.5 w-3.5 text-[#D4AF37]" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
