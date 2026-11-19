import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  highlightAfter?: string;
  startDelay?: number;
}

/**
 * Aceternity UI TextGenerateEffect: progressively reveals each word
 * from optical blur & slide into crisp editorial focus.
 */
export function TextGenerateEffect({
  words,
  className = '',
  highlightAfter = '-',
  startDelay = 0.15,
}: TextGenerateEffectProps) {
  const prefersReducedMotion = useReducedMotion();
  const wordArray = words.split(' ');
  const splitIndex = wordArray.indexOf(highlightAfter);

  if (prefersReducedMotion) {
    return <h1 className={className}>{words}</h1>;
  }

  return (
    <h1 className={className}>
      {wordArray.map((word, idx) => {
        const isSubtitlePart = splitIndex !== -1 && idx > splitIndex;
        return (
          <motion.span
            key={`${word}-${idx}`}
            initial={{ opacity: 0, filter: 'blur(14px)', y: 18 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{
              duration: 0.65,
              delay: startDelay + 0.095 * idx,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`inline-block will-change-[transform,opacity,filter] ${
              isSubtitlePart ? 'italic text-[#E5C667]' : 'text-[#FAF6EE]'
            }`}
          >
            {word}
            {idx < wordArray.length - 1 ? '\u00A0' : ''}
          </motion.span>
        );
      })}
    </h1>
  );
}

/**
 * jjettas.com / book.sequel.co style rolling Odometer Number counter on viewport entry.
 */
export function OdometerNumber({
  target,
  suffix = '',
  decimals = 0,
  className = '',
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 1200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(target);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, prefersReducedMotion]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formatted}
      {suffix}
    </span>
  );
}

/**
 * book.sequel.co-style Starring / Chambers scroll-illuminated word band.
 * Words light up sequentially from muted espresso to glowing gold/ivory as user scrolls.
 */
function ScrollWord({
  label,
  progress,
  range,
}: {
  label: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const scale = useTransform(progress, range, [0.96, 1.03]);

  return (
    <motion.span
      style={{ opacity, scale }}
      className="inline-block font-serif text-xl font-semibold tracking-wide text-[#F3E5AB] will-change-transform sm:text-3xl"
    >
      {label}
    </motion.span>
  );
}

function ScrollIlluminatedLineupAnimated({ items }: { items: string[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.4'],
  });

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-6 sm:gap-x-10 sm:gap-y-4"
    >
      {items.map((item, idx) => {
        const start = idx / items.length;
        const end = Math.min(1, start + 1 / items.length + 0.15);
        return <ScrollWord key={item} label={item} progress={scrollYProgress} range={[start, end]} />;
      })}
    </div>
  );
}

export function ScrollIlluminatedLineup({ items }: { items: string[] }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-6">
        {items.map((item) => (
          <span key={item} className="font-serif text-xl font-semibold text-[#F3E5AB] sm:text-3xl">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return <ScrollIlluminatedLineupAnimated items={items} />;
}
