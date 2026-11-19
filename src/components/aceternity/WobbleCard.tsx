import { ReactNode, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

interface WobbleCardProps {
  children: ReactNode;
  containerClassName?: string;
  className?: string;
}

/**
 * Aceternity UI WobbleCard adapted for both desktop mouse AND mobile touch/tap
 * with smooth spring translation, 3D tilt, and subtle counter-parallax on inner content.
 */
export function WobbleCard({
  children,
  containerClassName = '',
  className = '',
}: WobbleCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 220, damping: 20 });
  const y = useSpring(rawY, { stiffness: 220, damping: 20 });
  const rotateX = useSpring(rawTiltX, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(rawTiltY, { stiffness: 220, damping: 22 });

  const innerX = useSpring(useMotionValue(0), { stiffness: 200, damping: 22 });
  const innerY = useSpring(useMotionValue(0), { stiffness: 200, damping: 22 });

  const updateFromClient = (clientX: number, clientY: number) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    const clampedX = Math.max(-1, Math.min(1, nx));
    const clampedY = Math.max(-1, Math.min(1, ny));

    rawX.set(clampedX * 7);
    rawY.set(clampedY * 7);
    rawTiltY.set(clampedX * 6.5);
    rawTiltX.set(-clampedY * 6.5);
    innerX.set(-clampedX * 5);
    innerY.set(-clampedY * 5);
  };

  const reset = () => {
    setIsActive(false);
    rawX.set(0);
    rawY.set(0);
    rawTiltX.set(0);
    rawTiltY.set(0);
    innerX.set(0);
    innerY.set(0);
  };

  return (
    <div style={{ perspective: '1000px' }} className={`h-full ${containerClassName}`}>
      <motion.div
        ref={ref}
        onPointerEnter={() => setIsActive(true)}
        onPointerMove={(e) => {
          setIsActive(true);
          updateFromClient(e.clientX, e.clientY);
        }}
        onPointerLeave={reset}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            setIsActive(true);
            updateFromClient(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={reset}
        style={{
          x,
          y,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isActive && !prefersReducedMotion ? 1.018 : 1,
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`relative h-full overflow-hidden rounded-3xl ${className}`}
      >
        <motion.div
          style={{ x: innerX, y: innerY }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
