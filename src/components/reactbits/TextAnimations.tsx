import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * ReactBits-inspired BlurText: resolves words smoothly from optical blur into crisp focus.
 */
export function BlurText({ text, className = '', delay = 0, as = 'p' }: BlurTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');
  const MotionTag = motion[as];

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, filter: 'blur(12px)', y: 12 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.65,
            delay: delay + index * 0.075,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block will-change-[transform,opacity,filter]"
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </MotionTag>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * ReactBits-inspired SplitText: splits headline into animated characters on scroll.
 */
export function SplitText({ text, className = '', delay = 0, as = 'h2' }: SplitTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');
  const Tag = as;

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  let charCursor = 0;

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wIdx) => (
        <span key={`${word}-${wIdx}`} className="inline-block whitespace-nowrap">
          {word.split('').map((char, cIdx) => {
            const currentDelay = delay + charCursor * 0.022;
            charCursor += 1;
            return (
              <motion.span
                key={`${char}-${cIdx}`}
                aria-hidden="true"
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.5,
                  delay: currentDelay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block will-change-[transform,opacity,filter]"
              >
                {char}
              </motion.span>
            );
          })}
          {wIdx < words.length - 1 ? <span aria-hidden="true">&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
}

/**
 * ReactBits-inspired ShinyText: sweeping metallic gold & pearl shimmer over display type.
 */
export function ShinyText({ children, className = '' }: ShinyTextProps) {
  return <span className={`shiny-text inline-block ${className}`}>{children}</span>;
}
