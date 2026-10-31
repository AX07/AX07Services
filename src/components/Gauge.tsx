import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { scoreTone } from '../lib/pagespeed';

const TONES = {
  good: { stroke: 'var(--color-accent-bright)', track: 'var(--color-accent-soft)', text: 'text-accent' },
  average: { stroke: '#f59e0b', track: 'var(--color-warn-soft)', text: 'text-warn' },
  poor: { stroke: '#ef4444', track: 'var(--color-danger-soft)', text: 'text-danger' },
} as const;

/** Lighthouse-style score ring that sweeps from 0 to its score every time it scrolls into view. */
export function Gauge({ score, size = 140, label }: { score: number; size?: number; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? score : 0);

  useEffect(() => {
    if (reduce) {
      setValue(score);
      return;
    }
    // Reset while off screen so the sweep plays again on the way back
    if (!inView) {
      setValue(0);
      return;
    }
    const controls = animate(0, score, { duration: 1.8, ease: [0.23, 1, 0.32, 1], onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduce, score]);

  const tone = TONES[scoreTone(score)];
  const r = 42;
  const c = 2 * Math.PI * r;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke={tone.track} strokeWidth="7" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={tone.stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - value / 100)}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-display font-semibold tabular-nums tracking-tight ${tone.text}`}
          style={{ fontSize: size * 0.3 }}
        >
          {Math.round(value)}
        </span>
      </div>
      {label && <span className="text-[13px] text-muted">{label}</span>}
    </div>
  );
}

/** Number that counts to its target every time it scrolls into view. */
export function CountTo({
  to,
  from = 0,
  decimals = 0,
  duration = 1.6,
  className,
}: {
  to: number;
  from?: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : from);

  useEffect(() => {
    if (reduce) return;
    if (!inView) {
      setValue(from);
      return;
    }
    const controls = animate(from, to, { duration, ease: [0.23, 1, 0.32, 1], onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduce, from, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {value.toLocaleString('en-IE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}
