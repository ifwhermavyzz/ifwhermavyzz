import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

interface FluidGlassProps {
  children: ReactNode;
  className?: string;
}

/**
 * ReactBits-inspired FluidGlass Optical Refraction Lens.
 * Tracks the user's cursor across the hero typography with a 3D glass prism
 * that optically magnifies, refracts (via SVG displacement + backdrop blur),
 * and reflects gold/pearl Fresnel highlights over the text beneath.
 */
export function FluidGlass({ children, className = '' }: FluidGlassProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const filterId = useId().replace(/:/g, '');
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const lensSize = 188;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const lensX = useSpring(rawX, { stiffness: 190, damping: 24, mass: 0.6 });
  const lensY = useSpring(rawY, { stiffness: 190, damping: 24, mass: 0.6 });

  const innerOffsetX = useMotionValue(0);
  const innerOffsetY = useMotionValue(0);
  const smoothInnerX = useSpring(innerOffsetX, { stiffness: 190, damping: 24, mass: 0.6 });
  const smoothInnerY = useSpring(innerOffsetY, { stiffness: 190, damping: 24, mass: 0.6 });

  // Center lens initially and gently drift when idle
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateCenter = () => {
      const rect = el.getBoundingClientRect();
      const cx = rect.width * 0.5 - lensSize / 2;
      const cy = rect.height * 0.52 - lensSize / 2;
      rawX.set(cx);
      rawY.set(cy);
      innerOffsetX.set(-cx);
      innerOffsetY.set(-cy);
    };

    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, [rawX, rawY, innerOffsetX, innerOffsetY]);

  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const t = (now - start) * 0.00085;
        const cx = rect.width * 0.5 + Math.sin(t) * Math.min(rect.width * 0.24, 180) - lensSize / 2;
        const cy = rect.height * 0.5 + Math.sin(t * 1.6) * 26 - lensSize / 2;
        rawX.set(cx);
        rawY.set(cy);
        innerOffsetX.set(-cx);
        innerOffsetY.set(-cy);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHovered, prefersReducedMotion, rawX, rawY, innerOffsetX, innerOffsetY]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - lensSize / 2;
    const y = e.clientY - rect.top - lensSize / 2;
    rawX.set(x);
    rawY.set(y);
    innerOffsetX.set(-x);
    innerOffsetY.set(-y);
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onPointerMove={handlePointerMove}
      className={`relative select-none ${className}`}
    >
      {/* Hidden SVG Optical Refraction Filter */}
      <svg className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id={`fluid-glass-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.024"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Base Typography Layer */}
      <div className="relative z-10">{children}</div>

      {/* 3D Cursor-Following Refracting Glass Object */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{
            x: lensX,
            y: lensY,
            width: lensSize,
            height: lensSize,
          }}
          animate={{
            scale: isHovered ? 1.08 : 1,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute top-0 left-0 z-20 hidden overflow-hidden rounded-full sm:block"
        >
          {/* Refracted & magnified optical duplicate of the text behind the lens */}
          <motion.div
            style={{
              x: smoothInnerX,
              y: smoothInnerY,
              filter: `url(#fluid-glass-${filterId}) brightness(1.18) contrast(1.08)`,
            }}
            className="pointer-events-none absolute top-0 left-0 w-max origin-center scale-[1.06]"
          >
            <div className="w-[min(92vw,56rem)]">{children}</div>
          </motion.div>

          {/* 3D Curved Glass Dome Surface, Specular Highlights & Fresnel Rim */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 26%, rgba(255, 255, 255, 0.26) 0%, rgba(212, 175, 55, 0.09) 34%, rgba(12, 18, 38, 0.22) 72%, rgba(255, 255, 255, 0.16) 100%)',
              backdropFilter: 'blur(1.5px)',
              WebkitBackdropFilter: 'blur(1.5px)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              boxShadow:
                'inset 0 12px 24px rgba(255, 255, 255, 0.28), inset 0 -16px 28px rgba(212, 175, 55, 0.2), inset 0 0 18px rgba(255, 255, 255, 0.12), 0 24px 48px rgba(0, 0, 0, 0.55)',
            }}
          />

          {/* Top-Left Specular Glass Crescent */}
          <div
            className="absolute top-3 left-5 h-10 w-20 -rotate-24 rounded-full opacity-65"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 100%)',
            }}
          />

          {/* Bottom-Right Gold Caustic Rim */}
          <div
            className="absolute right-4 bottom-3 h-8 w-16 -rotate-20 rounded-full opacity-55"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.55) 0%, rgba(212, 175, 55, 0) 75%)',
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
