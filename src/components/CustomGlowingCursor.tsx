import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '[role="radio"]',
  '[role="tab"]',
  '[data-cursor="interactive"]',
].join(',');

export const CustomGlowingCursor = React.memo(function CustomGlowingCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappy golden dot
  const dotX = useSpring(mouseX, { stiffness: 750, damping: 42, mass: 0.2 });
  const dotY = useSpring(mouseY, { stiffness: 750, damping: 42, mass: 0.2 });

  // Slightly trailed ring for fluid luxury feel
  const ringX = useSpring(mouseX, { stiffness: 320, damping: 28, mass: 0.45 });
  const ringY = useSpring(mouseY, { stiffness: 320, damping: 28, mass: 0.45 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncCapability = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches);
    };

    syncCapability();
    finePointer.addEventListener('change', syncCapability);
    reducedMotion.addEventListener('change', syncCapability);

    return () => {
      finePointer.removeEventListener('change', syncCapability);
      reducedMotion.removeEventListener('change', syncCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      const target = e.target as Element | null;
      const hoveringInteractive = Boolean(target?.closest(INTERACTIVE_SELECTOR));
      setIsInteractive(hoveringInteractive);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Expanding Outer Ring on Interactive Hover */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: visible ? (isInteractive ? 1 : 0.28) : 0,
          scale: isPressed ? 0.84 : isInteractive ? 1 : 0.42,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={`h-10 w-10 rounded-full transition-colors duration-150 ${
          isInteractive
            ? 'border-[1.5px] border-[#F3E5AB] bg-[#D4AF37]/12 shadow-[0_0_24px_rgba(212,175,55,0.55)]'
            : 'border border-[#D4AF37]/55 bg-transparent shadow-[0_0_12px_rgba(212,175,55,0.28)]'
        }`}
      />

      {/* Core Smooth Golden Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: visible ? (isInteractive ? 0.5 : 1) : 0,
          scale: isPressed ? 0.75 : isInteractive ? 0.6 : 1,
        }}
        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
        className="h-2.5 w-2.5 rounded-full bg-[#F3E5AB] shadow-[0_0_14px_rgba(243,229,171,0.95),0_0_26px_rgba(212,175,55,0.75)]"
      />
    </div>
  );
});
