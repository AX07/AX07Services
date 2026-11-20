import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { EASE_OUT, Eyebrow, Headline, Reveal, RevealGroup, RevealItem } from '../components/Reveal';
import { CountTo } from '../components/Gauge';
import { SpeedTest } from '../components/SpeedTest';
import { reaimParticles } from '../lib/smooth-scroll';
import { LogoStrip } from '../components/LogoStrip';
import { FOUND_ON } from '../data/tech';
import { useMinWidth } from '../lib/motion';

const SPOT = 'transition-[opacity,transform,box-shadow] duration-500 ease-out';

// Plays once each time the section comes into view (the page never stops here): the speed test types ax07.dev, runs it
// and shows the score, then empties the box for the visitor; the spotlight and particles then move to first paint,
// then to 48h + €0, and finally let go of every card. [step, ms after coming into view]
const TIMELINE = [
  [0, 500], // type ax07.dev
  [1, 1700], // run it (the score shows 1.5 s later)
  [2, 5200], // box back to yourbusiness.com
  [3, 6400], // first paint
  [4, 9000], // 48h + €0
  [5, 11800], // all cards back to normal
] as const;
const DEMO = ['type', 'run'] as const;
const cardOf = (step: number) => (step < 0 || step > 4 ? -1 : step <= 2 ? 0 : step - 2); // which card a step lights

/** The reveal animates each outer box; the spotlight styles the card inside it (the reveal's inline styles would win). */
export function Proof() {
  const ref = useRef<HTMLElement>(null);
  const paintRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1);
  const paintSeen = useInView(paintRef, { amount: 0.6 });
  const wide = useMinWidth(1024);

  useEffect(() => {
    const el = ref.current;
    if (reduce || !el) return;
    let timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        timers.forEach(window.clearTimeout);
        timers = [];
        if (!e.isIntersecting) return setStep(-1);
        timers = TIMELINE.map(([s, ms]) => window.setTimeout(() => setStep(s), ms));
      },
      // A band across the middle of the screen: a share of the section would never be reached on phones, where it is over two screens tall
      { rootMargin: '-40% 0px -40% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, [reduce]);

  // Phones stack the cards, so the spotlight follows the scroll instead: the card nearest the middle of the screen
  const [near, setNear] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (wide || reduce || !el) return;
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let dist = Infinity;
      el.querySelectorAll('[data-proof-card]').forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < dist) [best, dist] = [i, d];
      });
      setNear(best);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [wide, reduce]);

  // The spotlight moves without the page scrolling, so tell the particles to follow it
  useEffect(() => {
    if (wide) return reaimParticles(900);
    // Phones: re-measuring every frame while the card lifts is too heavy, so the field is re-aimed once it has settled
    const t = window.setTimeout(() => reaimParticles(0), 520);
    return () => window.clearTimeout(t);
  }, [step, near, wide]);

  const lit = wide ? cardOf(step) : step < 0 ? -1 : near;
  const look = (i: number) =>
    lit < 0 ? '' : lit === i ? '-translate-y-1 shadow-[0_0_0_1px_var(--color-accent-bright),0_24px_60px_-28px_var(--color-accent-bright)]' : 'opacity-50';
  // The particle field outlines the lit card; with none lit (before and after the sequence) it stays on the speed test
  const target = (i: number, name: string) => ((lit < 0 ? 0 : lit) === i ? name : undefined);
  const paintOn = reduce ? paintSeen : wide ? step >= 3 : lit === 1;
  const demo = step < 0 ? 'off' : step < DEMO.length ? DEMO[step] : 'ready';

  return (
    <section ref={ref} id="proof" className="relative isolate gutter section-y">
      <div className="mx-auto max-w-6xl">
        <Eyebrow index="05" className="mb-5">
          Proof, not promises
        </Eyebrow>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14">
          <Headline
            text={[{ text: 'Fast is a feature.' }, { text: 'Test it yourself.', className: 'text-muted' }]}
            className="display max-w-3xl text-display-2"
          />
          <Reveal delay={0.1} className="max-w-xl text-body text-muted">
            Customers searching on their phone don’t wait for a slow page. They go back to Google and ring the next result. Run
            your own site against ours.
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 lg:mt-10 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          {/* Live speed test: the visitor's own site vs ours */}
          <RevealItem className="lg:col-span-2 lg:row-span-2">
            <div data-proof-card data-scene-target={target(0, 'proof')} className={`card h-full p-6 ${SPOT} sm:p-8 ${look(0)}`}>
              <SpeedTest demo={demo} />
            </div>
          </RevealItem>

          {/* First paint timeline */}
          <RevealItem>
            <div data-proof-card data-scene-target={target(1, 'proof-paint')} className={`card flex h-full flex-col justify-between gap-6 p-6 ${SPOT} sm:p-7 ${look(1)}`}>
              <span className="eyebrow">First paint on 4G</span>
              <div className="display text-stat">
                <CountTo to={0.4} decimals={1} />
                <span className="text-muted">s</span>
              </div>
              <div ref={paintRef}>
                <div className="relative h-2 rounded-full bg-raised">
                  {/* The race runs when its card is spotlit */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paintOn ? 0.1 : 0 }}
                    transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
                    className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-accent-bright"
                  />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paintOn ? 0.8 : 0 }}
                    transition={{ duration: paintOn ? 2.4 : 0.3, ease: 'linear', delay: paintOn ? 0.2 : 0 }}
                    className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-danger/25"
                  />
                </div>
                <div className="mt-2 flex justify-between text-[12px] text-muted">
                  <span className="text-accent">ax07 · 0.4s</span>
                  <span>Template · 3.2s</span>
                </div>
              </div>
            </div>
          </RevealItem>

          {/* 48h + €0 */}
          <RevealItem>
            <div data-proof-card data-scene-target={target(2, 'proof-preview')} className={`card grid h-full grid-cols-2 gap-4 p-6 ${SPOT} sm:p-7 ${look(2)}`}>
              <div className="flex flex-col justify-between gap-4">
                <span className="eyebrow">To your preview</span>
                <div className="display text-stat-sm">
                  <CountTo to={48} duration={1.4} />
                  <span className="text-muted">h</span>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-4 border-l border-line pl-4">
                <span className="eyebrow">Before you approve</span>
                <div className="display text-stat-sm">€0</div>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>

        {/* Where that speed and structure pays off: the search and AI answer engines the site is built to be read by */}
        <LogoStrip label="SEO-optimised and fast, ready to be found on" items={FOUND_ON} className="mt-12" />
      </div>
    </section>
  );
}
