interface Marquee3DProps {
  text?: string;
}

/**
 * Smooth 3D perspective Marquee band for the footer/showcase.
 */
export function Marquee3D({
  text = 'AURORA SUMMIT 1.0 • A CONSTELLATION OF VOICES',
}: Marquee3DProps) {
  const items = Array.from({ length: 6 }, (_, idx) => idx);

  return (
    <div
      aria-label={text}
      className="relative w-full overflow-hidden border-y border-[#D4AF37]/20 bg-[#120A06]/85 py-6 sm:py-8"
    >
      {/* Edge fade masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#1A100A] to-transparent sm:w-28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#1A100A] to-transparent sm:w-28"
      />

      <div style={{ perspective: '900px' }}>
        <div
          style={{
            transform: 'rotateX(16deg) rotateZ(-1.2deg)',
            transformStyle: 'preserve-3d',
          }}
          className="space-y-3"
        >
          {/* Row 1 */}
          <div className="animate-marquee-3d flex items-center">
            {items.map((i) => (
              <span
                key={`m1-${i}`}
                className="mx-6 font-serif text-2xl font-semibold tracking-[0.14em] text-[#F3E5AB] whitespace-nowrap sm:text-4xl"
              >
                {text}
                <span aria-hidden="true" className="ml-10 text-[#D4AF37]">
                  ✦
                </span>
              </span>
            ))}
          </div>

          {/* Row 2 (subtle reverse depth track) */}
          <div className="animate-marquee-3d-reverse flex items-center opacity-45">
            {items.map((i) => (
              <span
                key={`m2-${i}`}
                className="mx-6 font-serif text-lg font-medium tracking-[0.18em] text-[#D4AF37] whitespace-nowrap sm:text-2xl"
              >
                {text}
                <span aria-hidden="true" className="ml-10 text-[#FAF6EE]/60">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
