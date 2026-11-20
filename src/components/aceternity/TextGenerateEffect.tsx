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
 * from optical blur & slide into crisp editorial focus, plus a Framer Motion
 * hover lift effect and 4s golden metallic shimmer on 'A Constellation of Voices'.
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

  const primaryWords = splitIndex !== -1 ? wordArray.slice(0, splitIndex + 1) : wordArray;
  const constellationWords = splitIndex !== -1 ? wordArray.slice(splitIndex + 1) : [];

  if (prefersReducedMotion) {
    return (
      <h1 className={className}>
        <span
          className="text-white"
          style={{
            textShadow:
              '0 0 14px rgba(212, 175, 55, 0.4), 0 0 22px rgba(100, 255, 255, 0.15)',
          }}
        >
          {primaryWords.join(' ')}{' '}
        </span>
        {constellationWords.length > 0 && (
          <span className="mt-1 inline-block italic text-[#E5C667]">
            {constellationWords.join(' ')}
          </span>
        )}
      </h1>
    );
  }

  return (
    <h1 className={className}>
      {/* Primary Heading ('The Aurora Summit -') with Aurora Glow + Rotating Celestial Aura */}
      <span className="relative inline-block">
        {/* Subtle Blurred Rotating Gold & Icy-Cyan Radial Background Aura */}
        <motion.span
          aria-hidden="true"
          animate={{
            rotate: [0, 360],
            scale: [0.96, 1.06, 0.96],
          }}
          transition={{
            rotate: { duration: 22, repeat: Infinity, ease: 'linear' },
            scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="pointer-events-none absolute -inset-x-10 -inset-y-5 z-0 rounded-full opacity-75 blur-3xl will-change-transform"
          style={{
            background:
              'radial-gradient(ellipse at 32% 45%, rgba(212, 175, 55, 0.24) 0%, transparent 62%), radial-gradient(ellipse at 68% 55%, rgba(100, 255, 255, 0.13) 0%, transparent 64%)',
          }}
        />

        {/* Crisp White Text with 4-Second Breathing Champagne-Gold & Icy-Cyan Glow (10px -> 30px) */}
        <motion.span
          animate={{
            textShadow: [
              '0 0 10px rgba(212, 175, 55, 0.4), 0 0 18px rgba(100, 255, 255, 0.15)',
              '0 0 30px rgba(212, 175, 55, 0.48), 0 0 42px rgba(100, 255, 255, 0.2)',
              '0 0 10px rgba(212, 175, 55, 0.4), 0 0 18px rgba(100, 255, 255, 0.15)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 inline-block text-white"
        >
          {primaryWords.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              initial={{ opacity: 0, filter: 'blur(14px)', y: 18 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{
                duration: 0.65,
                delay: startDelay + 0.085 * idx,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block text-white will-change-[transform,opacity,filter]"
            >
              {word}
              {idx < primaryWords.length - 1 || constellationWords.length > 0 ? '\u00A0' : ''}
            </motion.span>
          ))}
        </motion.span>
      </span>

      {constellationWords.length > 0 && (
        <motion.span
          initial={{ opacity: 0, filter: 'blur(16px)', y: 22 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          whileHover={{
            y: -6,
            scale: 1.025,
            filter: 'drop-shadow(0 10px 26px rgba(212, 175, 55, 0.45))',
          }}
          transition={{
            opacity: { duration: 0.75, delay: startDelay + 0.085 * primaryWords.length, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 0.75, delay: startDelay + 0.085 * primaryWords.length, ease: [0.16, 1, 0.3, 1] },
            y: { type: 'spring', stiffness: 320, damping: 20 },
            scale: { type: 'spring', stiffness: 320, damping: 20 },
          }}
          className="hero-gold-shimmer relative z-10 inline-block cursor-default px-1 italic will-change-transform"
        >
          {constellationWords.join(' ')}
        </motion.span>
      )}
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
