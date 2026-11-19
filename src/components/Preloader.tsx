import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BRAND_ASSETS } from '../data/committees';

/**
 * jjettas.com-inspired minimal cinematic preloader (0% -> 100%)
 * featuring the Aurora Summit 1.0 crest before wiping into the Hero.
 */
export function Preloader() {
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(prefersReducedMotion ? 100 : 0);
  const [done, setDone] = useState(Boolean(prefersReducedMotion));

  useEffect(() => {
    if (prefersReducedMotion) {
      setDone(true);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Ease-out cubic progression
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), 220);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="aurora-preloader"
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0.9 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#120A06]"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-full opacity-55 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(212, 175, 55, 0.45), rgba(26, 16, 10, 0) 70%)',
              }}
            />
            <img
              src={BRAND_ASSETS.logo}
              alt="Aurora Summit Crest"
              className="relative h-24 w-24 rounded-full border border-[#D4AF37]/50 object-cover sm:h-28 sm:w-28"
            />
            <div className="mt-6 font-serif text-sm tracking-[0.26em] text-[#F3E5AB]">
              AURORA SUMMIT 1.0
            </div>
            <div className="mt-2.5 font-sans text-xs font-semibold tracking-[0.22em] text-[#D4AF37] tabular-nums">
              {progress}%
            </div>
            <div className="mt-3 h-px w-40 overflow-hidden bg-[#D4AF37]/20">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
