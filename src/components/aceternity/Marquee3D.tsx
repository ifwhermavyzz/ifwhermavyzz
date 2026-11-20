interface Marquee3DProps {
  text?: string;
}

function MarqueeTrack({
  text,
  primary = true,
  prefix,
}: {
  text: string;
  primary?: boolean;
  prefix: string;
}) {
  const copies = [0, 1, 2, 3];

  return (
    <div className="flex shrink-0 items-center">
      {copies.map((idx) => (
        <span
          key={`${prefix}-${idx}`}
          className={
            primary
              ? 'mx-6 inline-flex items-center font-serif text-2xl font-semibold tracking-[0.14em] text-[#F3E5AB] whitespace-nowrap sm:text-4xl'
              : 'mx-6 inline-flex items-center font-serif text-lg font-medium tracking-[0.18em] text-[#D4AF37] whitespace-nowrap sm:text-2xl'
          }
        >
          <span>{text}</span>
          <span
            aria-hidden="true"
            className={primary ? 'ml-10 text-[#D4AF37]' : 'ml-10 text-[#FAF6EE]/60'}
          >
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Buttery-smooth continuous infinite marquee band with seamless duplicated halves
 * and automatic pause-on-hover.
 */
export function Marquee3D({
  text = 'AURORA SUMMIT 1.0 • A CONSTELLATION OF VOICES',
}: Marquee3DProps) {
  return (
    <div
      aria-label={text}
      className="marquee-group relative w-full overflow-hidden border-y border-[#D4AF37]/25 bg-[#120A06]/85 py-6 sm:py-8"
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

      <div className="space-y-3">
        {/* Row 1: Continuous Right-to-Left Seamless Loop (0% -> -50%) */}
        <div className="animate-marquee-3d">
          <MarqueeTrack text={text} primary prefix="r1-a" />
          <MarqueeTrack text={text} primary prefix="r1-b" />
        </div>

        {/* Row 2: Subtle Secondary Reverse Depth Track */}
        <div className="animate-marquee-3d-reverse opacity-45">
          <MarqueeTrack text={text} primary={false} prefix="r2-a" />
          <MarqueeTrack text={text} primary={false} prefix="r2-b" />
        </div>
      </div>
    </div>
  );
}
