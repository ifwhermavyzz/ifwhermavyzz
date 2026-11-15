import { ArrowDown, ArrowUpRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { FluidGlass } from './reactbits/FluidGlass';
import { BlurText } from './reactbits/TextAnimations';
import { MagneticButton } from './reactbits/MagneticButton';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onSecretariatClick: () => void;
  onExploreAbout: () => void;
}

export function HeroSection({
  onRegisterClick,
  onSecretariatClick,
  onExploreAbout,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-6 lg:px-8"
    >
      {/* Atmospheric CSS Gradient Nebula Halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 blur-3xl sm:h-[760px] sm:w-[760px]"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(212, 175, 55, 0.14) 0%, rgba(30, 41, 82, 0.25) 45%, rgba(5, 5, 5, 0) 75%)',
        }}
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Clean unboxed editorial metadata line */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium tracking-[0.18em] text-[#CBD5E1]/80 sm:text-sm"
        >
          <span>Model United Nations</span>
          <span aria-hidden="true" className="text-[#D4AF37]">
            ·
          </span>
          <span>November 2026</span>
          <span aria-hidden="true" className="text-[#D4AF37]">
            ·
          </span>
          <span>International Conclave</span>
        </motion.div>

        {/* FluidGlass 3D Optical Refraction Headline Experience */}
        <FluidGlass className="w-full max-w-4xl py-4 sm:py-6">
          <div className="flex flex-col items-center">
            <BlurText
              as="h1"
              text="The Aurora Summit"
              className="font-serif text-[clamp(2.65rem,6.5vw,5.25rem)] leading-[1.06] font-semibold tracking-tight text-[#F8FAFC] [text-wrap:balance]"
            />

            <BlurText
              as="p"
              text="A Constellation of Voices"
              delay={0.22}
              className="mt-4 font-serif text-[clamp(1.35rem,3vw,2.35rem)] leading-snug font-medium italic tracking-wide text-[#E5C667] [text-wrap:balance]"
            />
          </div>
        </FluidGlass>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-[#CBD5E1] sm:text-lg"
        >
          Where emerging diplomats, policy architects, and global thinkers convene across four
          specialized councils to draft resilient treaties for an interconnected world.
        </motion.p>

        {/* Magnetic CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
        >
          <MagneticButton variant="primary" onClick={onRegisterClick}>
            <span>Register Now</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MagneticButton>

          <MagneticButton variant="secondary" onClick={onSecretariatClick}>
            <Compass className="h-4 w-4 text-[#D4AF37]" />
            <span>Secretariat Application</span>
          </MagneticButton>
        </motion.div>

        {/* Subtle Scroll Cue */}
        <motion.button
          type="button"
          onClick={onExploreAbout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          aria-label="Scroll to About section"
          className="mt-14 inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-[0.14em] text-[#94A3B8] transition-colors hover:text-[#F3E5AB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          <span>Explore the Summit</span>
          <ArrowDown className="h-3.5 w-3.5 text-[#D4AF37]" />
        </motion.button>
      </div>
    </section>
  );
}
