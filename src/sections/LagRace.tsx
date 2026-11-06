import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { EASE_OUT, Eyebrow } from '../components/Reveal';
import { useRange } from '../lib/motion';
import { AutoScrollFrame } from '../components/showcase/AutoScrollFrame';
import { DentalSite } from '../components/showcase/IndustrySites';
import { OldTemplateSite } from '../components/showcase/OldTemplateSite';
import { crossedForward, railPulse, type RailPulse } from '../lib/rail';

const SLOW_LOAD = 3.2; // seconds: a typical template site on 4G
const FAST_LOAD = 0.4; // seconds: an ax07 build
const RACE_LENGTH = 4;

/** Share of visitors still waiting after t seconds (53% gone by 3s, Google mobile research) */
// The race as story beats for the 3D field: green when ours lands, red as the template loses people
const RAIL_MOMENTS: { at: number; pulse: RailPulse }[] = [
  { at: FAST_LOAD, pulse: { tone: 'accent', size: 'lg', label: 'ax07 build loaded · 0.4s' } },
  { at: 1.3, pulse: { tone: 'accent', size: 'sm', label: 'Booking received' } },
  { at: 2.6, pulse: { tone: 'danger', size: 'sm', label: 'Visitor gave up' } },
  { at: SLOW_LOAD, pulse: { tone: 'danger', size: 'lg', label: 'Template loaded · 3.2s' } },
];

/** Desktop and up: the race runs in browser windows */
function useIsWide() {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return wide;
}

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
  const headerOpacity = useRange(enter, [0.06, 0.42], [0, 1]);
  const headerY = useRange(enter, [0.06, 0.42], [36, 0]);
  const phonesOpacity = useRange(enter, [0.3, 0.75], [0, 1]);
  const phonesY = useRange(enter, [0.3, 0.75], [48, 0]);
  const [t, setT] = useState(0);

  useMotionValueEvent(clock, 'change', (v) => {
    const rounded = Math.round(v * 20) / 20;
    setT((prev) => (prev === rounded ? prev : rounded));
  });

  const lastT = useRef(0);
  useEffect(() => {
    RAIL_MOMENTS.forEach((m) => crossedForward(lastT.current, t, m.at) && railPulse(m.pulse));
    lastT.current = t;
  }, [t]);

  const waiting = stillWaiting(t);
  const wide = useIsWide();

  return (
    <section ref={ref} id="lag" className="relative h-[210vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-6 sm:pt-24">
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

          <motion.div style={{ opacity: phonesOpacity, y: phonesY }} className={`mx-auto mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-8 ${
              // Fits the screen's height: phones by their tall shape, browser windows by their wide one
              wide ? 'max-w-[min(64rem,calc((100svh-430px)*3.2+2rem))]' : 'max-w-[min(48rem,calc((100svh-380px)*1.1))]'
            }`}>
            <Phone label="Typical template site" short="Template site" loadAt={SLOW_LOAD} t={t} tone="slow" wide={wide}>
              <div className="flex items-center justify-between text-[11px] @min-[280px]:text-[13px]">
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

            <Phone label="Built by ax07" short="ax07 build" loadAt={FAST_LOAD} t={t} tone="fast" wide={wide}>
              <div className="flex items-center justify-between text-[11px] @min-[280px]:text-[13px]">
                <span className="text-muted">Visitors still here</span>
                <span className="font-semibold tabular-nums text-accent">100%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-accent-soft">
                <div className="h-full w-full rounded-full bg-accent-bright" />
              </div>
            </Phone>
          </motion.div>

          <p className="mx-auto mt-6 w-fit max-w-md rounded-full bg-ink/80 px-3 py-1 text-center text-[12px] text-muted backdrop-blur-sm sm:text-[13px]">
            53% of mobile visitors leave a page that takes longer than 3 seconds to load. Source: Google.
          </p>
        </div>
      </div>
    </section>
  );
}

function Phone({
  label,
  short,
  loadAt,
  t,
  tone,
  wide,
  children,
}: {
  label: string;
  /** Shorter label for phones, where two labels and timers share one narrow row */
  short: string;
  loadAt: number;
  t: number;
  tone: 'slow' | 'fast';
  /** Desktop: a browser window showing the desktop site, instead of a phone */
  wide: boolean;
  children: React.ReactNode;
}) {
  const loaded = t >= loadAt;
  const booked = tone === 'fast' && t >= 1.3;
  const abandoned = tone === 'slow' && t >= 2.6 && !loaded;

  const screen = (
    <div
      className={`relative overflow-hidden bg-raised ${
        wide ? 'aspect-[16/10]' : 'aspect-[9/14] rounded-[17px] @min-[280px]:aspect-[9/15] @min-[280px]:rounded-[24px]'
      }`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {loaded ? (
          <motion.div
            key="site"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="absolute inset-0 bg-white"
          >
            {/* The same practice twice: a dated boxed theme on the slow device, ours on the fast one */}
            <AutoScrollFrame virtualWidth={wide ? 1280 : 390}>
              {tone === 'slow' ? <OldTemplateSite wide={wide} /> : <DentalSite m={!wide} />}
            </AutoScrollFrame>
          </motion.div>
        ) : (
          <motion.div key="skeleton" exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col gap-2 p-3 @min-[280px]:p-4">
            <div className={`rounded-xl bg-fg/[0.06] ${wide ? 'h-[45%]' : 'h-[38%]'}`} />
            <div className="h-2.5 w-4/5 rounded-full bg-fg/[0.06]" />
            <div className="h-2.5 w-3/5 rounded-full bg-fg/[0.06]" />
            <div className="h-1.5 w-full rounded-full bg-fg/[0.05]" />
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="h-full w-full animate-[shimmer_1.4s_linear_infinite] bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-surface)_70%,transparent),transparent)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outcome toasts: small notifications anchored to a corner, sized to the device */}
      <AnimatePresence>
        {booked && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full border border-line bg-surface/95 py-1 pl-1 pr-2 text-[9px] shadow-md backdrop-blur @min-[280px]:right-2.5 @min-[280px]:top-2.5 @min-[280px]:gap-1.5 @min-[280px]:py-1.5 @min-[280px]:pl-1.5 @min-[280px]:pr-3 @min-[280px]:text-[11px]"
          >
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-wa text-white @min-[280px]:h-5 @min-[280px]:w-5">
              <svg viewBox="0 0 16 16" className="h-2 w-2 @min-[280px]:h-2.5 @min-[280px]:w-2.5" aria-hidden="true">
                <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {/* Narrow devices: a small "Booked" chip, so the site underneath stays visible */}
            <span className="whitespace-nowrap font-medium leading-none @min-[280px]:hidden">Booked</span>
            <span className="hidden whitespace-nowrap font-medium leading-none @min-[280px]:inline">New booking via WhatsApp</span>
          </motion.div>
        )}
        {abandoned && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="absolute inset-x-2 bottom-2 rounded-2xl border border-line bg-surface/95 px-2.5 py-2 text-[10px] shadow-md backdrop-blur @min-[280px]:inset-x-auto @min-[280px]:bottom-2.5 @min-[280px]:left-2.5 @min-[280px]:rounded-full @min-[280px]:px-3 @min-[280px]:py-1.5 @min-[280px]:text-[11px]"
          >
            <span className="font-medium text-danger">Visitor left</span>
            <span className="text-muted"> · back to Google results</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Sized by its own width (a container), not the screen's: on short screens the devices can be
  // as narrow as on a mobile, so they take the compact labels and the small booking chip
  return (
    <div className="@container flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <span className={`text-[12px] font-medium @min-[280px]:text-[14px] ${tone === 'fast' ? 'text-fg' : 'text-muted'}`}>
          <span className="@min-[280px]:hidden">{short}</span>
          <span className="hidden @min-[280px]:inline">{label}</span>
        </span>
        <span
          className={`text-[12px] tabular-nums @min-[280px]:text-[13px] ${loaded ? (tone === 'fast' ? 'text-accent' : 'text-muted') : 'text-subtle'}`}
        >
          {loaded ? `${loadAt.toFixed(1)}s` : 'Loading…'}
        </span>
      </div>

      {wide ? (
        <div className="card overflow-hidden !rounded-[14px] p-0">
          <div className="flex items-center gap-3 border-b border-line bg-raised px-3 py-2">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-fg/15" />
              <span className="h-2 w-2 rounded-full bg-fg/15" />
              <span className="h-2 w-2 rounded-full bg-fg/15" />
            </div>
            <div className="mx-auto truncate rounded-full bg-surface px-3 py-0.5 text-[11px] text-muted">lumendental.ie</div>
            <span className="w-[42px]" />
          </div>
          {screen}
        </div>
      ) : (
        <div className="card relative overflow-hidden !rounded-[22px] p-1.5 @min-[280px]:!rounded-[30px] @min-[280px]:p-2">{screen}</div>
      )}

      <div className="px-1">{children}</div>
    </div>
  );
}
