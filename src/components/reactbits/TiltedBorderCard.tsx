import { ReactNode, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

interface TiltedBorderCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * Combines ReactBits TiltedCard (perspective(1000px) 3D tilt)
 * and BorderGlow (cursor-tracking radial gold border illumination)
 * over a Luxury Glassmorphism container.
 */
export function TiltedBorderCard({
  children,
  className = '',
  maxTilt = 6,
}: TiltedBorderCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, active: false });

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 22, mass: 0.5 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 22, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    setGlowPos({
      x: relX * 100,
      y: relY * 100,
      active: true,
    });

    if (!prefersReducedMotion) {
      rawRotateY.set((relX - 0.5) * maxTilt * 2);
      rawRotateX.set((0.5 - relY) * maxTilt * 2);
    }
  };

  const handlePointerLeave = () => {
    setGlowPos((prev) => ({ ...prev, active: false }));
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <div style={{ perspective: '1000px' }} className={`h-full ${className}`}>
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="luxury-glass relative h-full overflow-hidden rounded-3xl transition-colors duration-200"
      >
        {/* BorderGlow: cursor-tracking radial gold border luminescence */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: glowPos.active ? 1 : 0,
            padding: '1px',
            background: `radial-gradient(360px circle at ${glowPos.x}% ${glowPos.y}%, rgba(212, 175, 55, 0.72), rgba(255, 255, 255, 0.14) 45%, transparent 72%)`,
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Subtle Inner Spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: glowPos.active ? 1 : 0,
            background: `radial-gradient(420px circle at ${glowPos.x}% ${glowPos.y}%, rgba(212, 175, 55, 0.08), transparent 65%)`,
          }}
        />

        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </div>
  );
}
