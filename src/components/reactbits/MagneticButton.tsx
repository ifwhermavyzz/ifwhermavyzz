import { ButtonHTMLAttributes, ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  strength?: number;
}

/**
 * ReactBits-inspired MagneticButton that subtly attracts toward the pointer on hover.
 */
export function MagneticButton({
  children,
  variant = 'primary',
  strength = 0.28,
  className = '',
  type = 'button',
  onClick,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 260, damping: 20, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 260, damping: 20, mass: 0.4 });

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    rawX.set(offsetX * strength);
    rawY.set(offsetY * strength);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const baseStyles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-[#D4AF37] via-[#E5C667] to-[#C69C2B] text-[#050505] font-semibold shadow-[0_12px_32px_-8px_rgba(212,175,55,0.45)] hover:shadow-[0_16px_40px_-6px_rgba(212,175,55,0.6)] border border-[#F3E5AB]/50'
      : 'luxury-glass text-[#F8FAFC] font-medium hover:border-[#D4AF37]/50 hover:text-[#F3E5AB]';

  return (
    <motion.div style={{ x, y }} className="inline-block">
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`group relative inline-flex min-h-[46px] items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-sm tracking-wide whitespace-nowrap shrink-0 transition-[box-shadow,border-color,color,transform] duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${baseStyles} ${className}`}
        {...rest}
      >
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        {variant === 'primary' && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
        )}
      </button>
    </motion.div>
  );
}
