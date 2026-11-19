import React, { Suspense, lazy } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { BRAND_ASSETS } from '../data/committees';

const GoldenSpaceParticles = lazy(() => import('./three/GoldenSpaceParticles'));

/**
 * Global Space Background with Framer Motion parallax scroll
 * and lazy-loaded R3F floating golden particles.
 */
export const SpaceParallaxBackground = React.memo(function SpaceParallaxBackground() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const yShift = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const scaleShift = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#1A100A]"
      >
        <motion.div
          style={prefersReducedMotion ? undefined : { y: yShift, scale: scaleShift }}
          className="absolute -inset-x-0 -top-[4%] h-[126%] w-full will-change-transform"
        >
          <img
            src={BRAND_ASSETS.spaceBg}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-80"
          />
        </motion.div>

        {/* Deep Dark Brown (#1A100A) atmospheric vignette preserving starry clarity */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 25%, rgba(26, 16, 10, 0.28) 0%, rgba(26, 16, 10, 0.68) 68%, rgba(17, 10, 6, 0.9) 100%)',
          }}
        />
      </div>

      {/* Lazy-loaded R3F Golden Particles */}
      <Suspense fallback={null}>
        <GoldenSpaceParticles />
      </Suspense>
    </>
  );
});
