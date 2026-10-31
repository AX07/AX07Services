import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { EASE_OUT, Eyebrow } from '../components/Reveal';
import { useRange } from '../lib/motion';

const SLOW_LOAD = 3.2; // seconds: a typical template site on 4G
const FAST_LOAD = 0.4; // seconds: an ax07 build
const RACE_LENGTH = 4;

/** Share of visitors still waiting after t seconds (53% gone by 3s, Google mobile research) */
const stillWaiting = (t: number) => Math.round(100 - Math.min(1, Math.max(0, (t - 1) / 2)) * 53 - Math.max(0, t - 3) * 8);

/**
 * "We kill the lag", shown rather than told: scrolling runs a stopwatch while two phones load
 * side by side. Visitors drain away from the slow one in real time.
 */
export function LagRace() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const clock = useRange(scrollYProgress, [0.05, 0.75], [0, RACE_LENGTH]);

  // Handoff from the hero: once its last line has gone and the logo has burst, the headline
  // fades up through the particle field, then the phones follow
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const headerOpacity = useRange(enter, [0.5, 0.92], [0, 1]);
  const headerY = useRange(enter, [0.5, 0.92], [36, 0]);
  const phonesOpacity = useRange(enter, [0.75, 1], [0, 1]);
  const phonesY = useRange(enter, [0.75, 1], [48, 0]);
  const [t, setT] = useState(0);

  useMotionValueEvent(clock, 'change', (v) => {
    const rounded = Math.round(v * 20) / 20;
    setT((prev) => (prev === rounded ? prev : rounded));
  });

  const waiting = stillWaiting(t);

  return (
    <section ref={ref} id="lag" className="relative h-[210vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 pt-14 sm:px-6">
          <motion.div style={{ opacity: headerOpacity, y: headerY }} className="flex flex-col items-center text-center">
            <Eyebrow index="01" className="mb-4">
              The cost of lag
            </Eyebrow>
            <h2 className="display text-display-3">
              Your customers <span className="text-muted">won’t wait.</span>
            </h2>
            {/* Stopwatch */}
            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-[pulse-ring_1.6s_var(--ease-out)_infinite] rounded-full bg-accent-bright" />
                <span className="relative h-2 w-2 rounded-full bg-accent-bright" />
              </span>
              <span className="font-display text-[15px] font-semibold tabular-nums">{t.toFixed(1)}s</span>
              <span className="text-[13px] text-muted">since they tapped your link</span>
            </div>
          </motion.div>

          <motion.div style={{ opacity: phonesOpacity, y: phonesY }} className="mx-auto mt-6 grid max-w-[min(48rem,calc((100svh-320px)*1.1))] grid-cols-2 gap-3 sm:mt-8 sm:gap-8">
            <Phone label="Typical template site" loadAt={SLOW_LOAD} t={t} tone="slow">
              <div className="flex items-center justify-between text-[11px] sm:text-[13px]">
                <span className="text-muted">Visitors still waiting</span>
                <span className={`font-semibold tabular-nums ${waiting < 60 ? 'text-danger' : 'text-fg'}`}>{waiting}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-raised">
                <div
                  className="h-full origin-left rounded-full bg-danger/70 transition-transform duration-300 ease-out"
                  style={{ transform: `scaleX(${waiting / 100})` }}
                />
              </div>
            </Phone>

            <Phone label="Built by ax07" loadAt={FAST_LOAD} t={t} tone="fast">
              <div className="flex items-center justify-between text-[11px] sm:text-[13px]">
                <span className="text-muted">Visitors still here</span>
                <span className="font-semibold tabular-nums text-accent">100%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-accent-soft">
                <div className="h-full w-full rounded-full bg-accent-bright" />
              </div>
            </Phone>
          </motion.div>

          <p className="mx-auto mt-6 max-w-md text-center text-[12px] text-subtle sm:text-[13px]">
            53% of mobile visitors leave a page that takes longer than 3 seconds to load. Source: Google.
          </p>
        </div>
      </div>
    </section>
  );
}

function Phone({
  label,
  loadAt,
  t,
  tone,
  children,
}: {
  label: string;
  loadAt: number;
  t: number;
  tone: 'slow' | 'fast';
  children: React.ReactNode;
}) {
  const loaded = t >= loadAt;
  const booked = tone === 'fast' && t >= 1.3;
  const abandoned = tone === 'slow' && t >= 2.6 && !loaded;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <span className={`text-[12px] font-medium sm:text-[14px] ${tone === 'fast' ? 'text-fg' : 'text-muted'}`}>{label}</span>
        <span className={`text-[12px] tabular-nums sm:text-[13px] ${loaded ? (tone === 'fast' ? 'text-accent' : 'text-muted') : 'text-subtle'}`}>
          {loaded ? `${loadAt.toFixed(1)}s` : 'Loading…'}
        </span>
      </div>

      {/* Device */}
      <div className="card relative overflow-hidden !rounded-[22px] p-1.5 sm:!rounded-[30px] sm:p-2">
        <div className="relative aspect-[9/14] overflow-hidden rounded-[17px] bg-raised sm:aspect-[9/15] sm:rounded-[24px]">
          <AnimatePresence initial={false} mode="popLayout">
            {loaded ? (
              <motion.div
                key="site"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="absolute inset-0 flex flex-col bg-surface"
              >
                <div className="h-[42%] bg-[linear-gradient(160deg,#0b3b57,#04263b_55%,#ffb34766)]" />
                <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                  <div className="h-2.5 w-4/5 rounded-full bg-fg/85 sm:h-3" />
                  <div className="h-2.5 w-3/5 rounded-full bg-fg/85 sm:h-3" />
                  <div className="mt-1 h-1.5 w-full rounded-full bg-raised" />
                  <div className="h-1.5 w-5/6 rounded-full bg-raised" />
                  <div className="mt-auto h-7 w-full rounded-full bg-fg sm:h-9" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="skeleton" exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col gap-2 p-3 sm:p-4">
                <div className="h-[38%] rounded-xl bg-fg/[0.06]" />
                <div className="h-2.5 w-4/5 rounded-full bg-fg/[0.06]" />
                <div className="h-2.5 w-3/5 rounded-full bg-fg/[0.06]" />
                <div className="h-1.5 w-full rounded-full bg-fg/[0.05]" />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="h-full w-full animate-[shimmer_1.4s_linear_infinite] bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-surface)_70%,transparent),transparent)]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Outcome toasts */}
          <AnimatePresence>
            {booked && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="absolute inset-x-2 top-2 flex items-center gap-2 rounded-2xl bg-surface/95 px-2.5 py-2 text-[10px] shadow-lg backdrop-blur sm:inset-x-3 sm:top-3 sm:text-[12px]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wa text-white sm:h-6 sm:w-6">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-medium leading-tight">New booking via WhatsApp</span>
              </motion.div>
            )}
            {abandoned && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="absolute inset-x-2 bottom-2 rounded-2xl bg-surface/95 px-2.5 py-2 text-[10px] shadow-lg backdrop-blur sm:inset-x-3 sm:bottom-3 sm:text-[12px]"
              >
                <span className="font-medium text-danger">Visitor left</span>
                <span className="text-muted"> · back to Google results</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-1">{children}</div>
    </div>
  );
}
