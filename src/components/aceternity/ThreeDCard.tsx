import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

const MouseEnterContext = createContext<[boolean, (v: boolean) => void]>([false, () => {}]);

/**
 * Aceternity UI 3D Card Container & WobbleCard perspective tilt.
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

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 24, mass: 0.45 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 24, mass: 0.45 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 22;
    const y = (e.clientY - top - height / 2) / 22;
    rawRotateY.set(x);
    rawRotateX.set(-y);
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

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
          className={`relative flex w-full items-stretch justify-center ${className}`}
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
  return (
    <div
      className={`h-full w-full [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] ${className}`}
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

  return (
    <div
      style={{
        transform:
          !prefersReducedMotion && isMouseEntered
            ? `translate3d(0px, 0px, ${translateZ}px)`
            : 'translate3d(0px, 0px, 0px)',
      }}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
