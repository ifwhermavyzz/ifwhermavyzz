import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { useIsMobileViewport } from '../../hooks/useIsMobileViewport';

const MouseEnterContext = createContext<[boolean, (v: boolean) => void]>([false, () => {}]);

/**
 * Aceternity UI 3D Card Container:
 * - Desktop (>= 768px): full mouse 3D tilt & Z-depth pop.
 * - Mobile (< 768px): 3D tilt & preserve-3d disabled for smooth 60FPS touch scrolling.
 */
export function CardContainer({
  children,
  className = '',
  containerClassName = '',
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 24, mass: 0.45 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 24, mass: 0.45 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || prefersReducedMotion || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 22;
    const y = (e.clientY - top - height / 2) / 22;
    rawRotateY.set(x);
    rawRotateX.set(-y);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  if (isMobile) {
    return (
      <div className={`flex items-stretch justify-center ${containerClassName}`}>
        <div className={`relative flex w-full items-stretch justify-center ${className}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={`flex items-stretch justify-center ${containerClassName}`}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className={`relative flex w-full items-stretch justify-center will-change-transform ${className}`}
        >
          {children}
        </motion.div>
      </div>
    </MouseEnterContext.Provider>
  );
}

export function CardBody({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobileViewport();

  return (
    <div
      className={`h-full w-full ${
        isMobile ? '' : '[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardItem({
  children,
  className = '',
  translateZ = 0,
}: {
  children: ReactNode;
  className?: string;
  translateZ?: number;
}) {
  const [isMouseEntered] = useContext(MouseEnterContext);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport();

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      style={{
        transform:
          !prefersReducedMotion && isMouseEntered
            ? `translate3d(0px, 0px, ${translateZ}px)`
            : 'translate3d(0px, 0px, 0px)',
      }}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
