import { ReactNode, useState } from 'react';

interface CardSpotlightProps {
  children: ReactNode;
  className?: string;
  radius?: number;
}

/**
 * Aceternity UI CardSpotlight: cursor & touch reactive golden radial surface spotlight
 * paired with a thick luminous golden border spotlight glow.
 */
export function CardSpotlight({
  children,
  className = '',
  radius = 360,
}: CardSpotlightProps) {
  const [pos, setPos] = useState({ x: 120, y: 120, active: false });

  const updatePosition = (clientX: number, clientY: number, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    setPos({
      x: clientX - rect.left,
      y: clientY - rect.top,
      active: true,
    });
  };

  return (
    <div
      onPointerMove={(e) => updatePosition(e.clientX, e.clientY, e.currentTarget)}
      onPointerEnter={(e) => updatePosition(e.clientX, e.clientY, e.currentTarget)}
      onPointerLeave={() => setPos((p) => ({ ...p, active: false }))}
      onTouchMove={(e) => {
        if (e.touches[0]) {
          updatePosition(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
        }
      }}
      onTouchEnd={() => setPos((p) => ({ ...p, active: false }))}
      className={`aurora-glass relative overflow-hidden ${className}`}
    >
      {/* Thick Dynamic Golden Border Spotlight Glow following cursor/finger */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] p-[2px] transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background: `radial-gradient(${Math.round(radius * 0.75)}px circle at ${pos.x}px ${pos.y}px, rgba(255, 244, 198, 0.98), rgba(212, 175, 55, 0.85) 45%, transparent 78%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      />

      {/* Rich Golden Radial Surface Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, rgba(212, 175, 55, 0.24), rgba(243, 229, 171, 0.08) 45%, transparent 75%)`,
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
