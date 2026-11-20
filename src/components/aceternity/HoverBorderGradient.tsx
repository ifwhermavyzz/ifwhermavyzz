import { ReactNode, useState } from 'react';

interface HoverBorderGradientProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  roundedClassName?: string;
}

/**
 * Aceternity UI HoverBorderGradient: thick luminous golden glowing border aura.
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
      className={`relative p-[2px] transition-all duration-300 ${roundedClassName} ${containerClassName}`}
      style={{
        background: hovered
          ? 'linear-gradient(135deg, rgba(255, 244, 198, 0.98) 0%, rgba(212, 175, 55, 0.95) 45%, rgba(145, 92, 24, 0.65) 75%, rgba(243, 229, 171, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(212, 175, 55, 0.55) 0%, rgba(212, 175, 55, 0.22) 50%, rgba(243, 229, 171, 0.48) 100%)',
        boxShadow: hovered
          ? '0 0 42px -4px rgba(212, 175, 55, 0.55)'
          : '0 0 22px -8px rgba(212, 175, 55, 0.24)',
      }}
    >
      <div className={`relative h-full w-full ${roundedClassName} ${className}`}>{children}</div>
    </div>
  );
}
