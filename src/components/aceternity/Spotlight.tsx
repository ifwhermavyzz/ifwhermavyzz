import { useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

/**
 * Aceternity UI SVG overhead Spotlight beam.
 */
export function Spotlight({ className = '', fill = '#D4AF37' }: SpotlightProps) {
  return (
    <svg
      aria-hidden="true"
      className={`animate-spotlight pointer-events-none absolute z-0 h-[145%] w-[135%] opacity-0 lg:w-[88%] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#aurora-spotlight-blur)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.18"
        />
      </g>
      <defs>
        <filter
          id="aurora-spotlight-blur"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Interactive mouse-following Spotlight container highlighting hero text.
 */
export function CursorSpotlightRegion({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [cursor, setCursor] = useState({ x: 50, y: 40, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCursor({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setCursor((prev) => ({ ...prev, active: false }))}
      className={`relative ${className}`}
    >
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -inset-y-4 z-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: cursor.active ? 1 : 0.45,
            background: `radial-gradient(420px circle at ${cursor.x}% ${cursor.y}%, rgba(212, 175, 55, 0.2), rgba(243, 229, 171, 0.06) 38%, transparent 72%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
