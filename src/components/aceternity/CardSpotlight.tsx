import { ReactNode, useState } from 'react';

interface CardSpotlightProps {
  children: ReactNode;
  className?: string;
  radius?: number;
}

/**
 * Aceternity UI CardSpotlight: cursor-reactive golden radial spotlight over card surfaces.
 */
export function CardSpotlight({
  children,
  className = '',
  radius = 340,
}: CardSpotlightProps) {
  const [pos, setPos] = useState({ x: 50, y: 50, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPos((p) => ({ ...p, active: false }))}
      className={`aurora-glass relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, rgba(212, 175, 55, 0.16), rgba(243, 229, 171, 0.05) 45%, transparent 75%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
