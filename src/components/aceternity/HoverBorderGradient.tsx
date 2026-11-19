import { ReactNode, useState } from 'react';

interface HoverBorderGradientProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  roundedClassName?: string;
}

/**
 * Aceternity UI HoverBorderGradient: golden glowing border aura on hover.
 */
export function HoverBorderGradient({
  children,
  className = '',
  containerClassName = '',
  roundedClassName = 'rounded-3xl',
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative p-[1.5px] transition-all duration-300 ${roundedClassName} ${containerClassName}`}
      style={{
        background: hovered
          ? 'linear-gradient(135deg, rgba(243, 229, 171, 0.9) 0%, rgba(212, 175, 55, 0.85) 45%, rgba(120, 72, 24, 0.45) 75%, rgba(243, 229, 171, 0.85) 100%)'
          : 'linear-gradient(135deg, rgba(212, 175, 55, 0.28) 0%, rgba(212, 175, 55, 0.08) 50%, rgba(212, 175, 55, 0.22) 100%)',
        boxShadow: hovered ? '0 0 36px -6px rgba(212, 175, 55, 0.42)' : 'none',
      }}
    >
      <div className={`relative h-full w-full ${roundedClassName} ${className}`}>{children}</div>
    </div>
  );
}
