import { Fragment, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

import { EASE_OUT } from '../lib/tokens';

// Re-exported so existing imports keep working; the source of truth is lib/tokens.ts
export { EASE_OUT };

const VIEWPORT = { once: true, amount: 0.25, margin: '0px 0px -10% 0px' } as const;

type Tag = 'div' | 'section' | 'li' | 'article' | 'p' | 'span';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
}

/** Fade + rise on enter. Starts from 24px and 0 opacity, never from scale 0. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </MotionTag>
  );
}

const group = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  as = 'div',
}: RevealProps & { stagger?: number }) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={group(stagger, delay)}>
      {children}
    </MotionTag>
  );
}

export function RevealItem({ children, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export interface Segment {
  text: string;
  className?: string;
}

interface HeadlineProps {
  text: string | Segment[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  delay?: number;
  /** 'view' plays when scrolled into view, 'mount' plays on load */
  trigger?: 'view' | 'mount';
}

/** Masked headline: every word rises from behind its own clip line. */
export function Headline({ text, as = 'h2', className, delay = 0, trigger = 'view' }: HeadlineProps) {
  const reduce = useReducedMotion();
  const segments = typeof text === 'string' ? [{ text }] : text;
  const MotionTag = motion[as];
  const play = trigger === 'mount' ? { animate: 'visible' } : { whileInView: 'visible', viewport: VIEWPORT };
  let index = 0;

  return (
    <MotionTag className={className} initial="hidden" {...play} variants={group(0.05, delay)}>
      {segments.map((seg, s) => (
        <span key={s} className={seg.className}>
          {seg.text
            .split(' ')
            .filter(Boolean)
            .map((word) => {
              const key = index++;
              return (
                <Fragment key={key}>
                  <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: reduce ? { opacity: 0 } : { y: '105%' },
                        visible: reduce
                          ? { opacity: 1, transition: { duration: 0.3 } }
                          : { y: '0%', transition: { duration: 1, ease: EASE_OUT } },
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>{' '}
                </Fragment>
              );
            })}
        </span>
      ))}
    </MotionTag>
  );
}

/** Small numbered label used at the top of every chapter. */
export function Eyebrow({ index, children, className = '' }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 eyebrow ${className}`}>
      {index && <span className="font-medium text-accent tabular-nums">{index}</span>}
      {index && <span className="h-px w-6 bg-line-strong" />}
      <span>{children}</span>
    </div>
  );
}
