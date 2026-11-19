import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { EASE_OUT, Eyebrow, Headline, Reveal, RevealGroup, RevealItem } from '../components/Reveal';
import { CountTo } from '../components/Gauge';
import { SpeedTest } from '../components/SpeedTest';
import { standAt } from '../lib/motion';
import { addHold } from '../lib/smooth-scroll';
import { LogoStrip } from '../components/LogoStrip';
import { FOUND_ON } from '../data/tech';

const CARDS = 3; // the speed test, first paint, 48h + €0
const SPOT = 'transition-[opacity,transform,box-shadow] duration-500 ease-out';

/**
 * The page stops once the cards are fully in view, then each scroll spotlights the next card (lifted and outlined,
 * the particle field around it, the others dimmed); after the last, the page scrolls on. Where the cards don't all
 * fit on screen (phones), the page glides to each card in turn instead of standing still.
 * The reveal animates each outer box; the spotlight styles the card inside it (the reveal's inline styles would win).
 */
export function Proof() {
  const ref = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const paintRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1);
  const paintSeen = useInView(paintRef, { amount: 0.6 });

  useEffect(() => {
    const section = ref.current?.querySelector<HTMLElement>(':scope > .mx-auto');
    const cards = grid.current;
    if (reduce || !section || !cards) return;
    const positions = () => {
      const room = window.innerHeight - 84;
      // Everything fits: stand still with the whole section in view; the cards fit: stand on them; else card by card
      if (section.offsetHeight <= room) return Array(CARDS + 1).fill(standAt(section));
      if (cards.offsetHeight <= room) return Array(CARDS + 1).fill(standAt(cards));
      const each = [...cards.querySelectorAll<HTMLElement>("[data-proof-card]")].map(standAt);
      return [each[0], ...each];
    };
    return addHold(CARDS, positions, setStep);
  }, [reduce]);

  // Before the first step every card shows as normal; then the lit one stands out
  const look = (i: number) =>
    step < 0 ? '' : step === i ? '-translate-y-1 shadow-[0_0_0_1px_var(--color-accent-bright),0_24px_60px_-28px_var(--color-accent-bright)]' : 'opacity-50';
  // Before the first step every card can draw the particle field (the scene picks the one in view); then only the lit one
  const target = (i: number, name: string) => (step < 0 || step === i ? name : undefined);
  const paintOn = reduce ? paintSeen : step >= 1;

  return (
    <section ref={ref} id="proof" className="relative isolate gutter section-y">
      <div className="mx-auto max-w-6xl">
        <Eyebrow index="05" className={`mb-5 lg:[@media(max-height:820px)]:mb-3`}>
          Proof, not promises
        </Eyebrow>
        <div className={`grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14 lg:[@media(max-height:820px)]:grid-cols-[1.6fr_1fr]`}>
          <Headline
            text={[{ text: 'Fast is a feature.' }, { text: 'Test it yourself.', className: 'text-muted' }]}
            className="display max-w-3xl text-display-2 lg:[@media(max-height:820px)]:text-display-3 lg:[@media(max-height:700px)]:text-[40px]!"
          />
          <Reveal delay={0.1} className={`max-w-xl text-body text-muted lg:[@media(max-height:820px)]:text-body-sm lg:[@media(max-height:700px)]:hidden`}>
            Customers searching on their phone don’t wait for a slow page. They go back to Google and ring the next result. Run
            your own site against ours.
          </Reveal>
        </div>

        <div ref={grid}>
        <RevealGroup className={`mt-14 grid grid-cols-1 gap-4 lg:mt-10 lg:[@media(max-height:820px)]:gap-3 lg:grid-cols-3 lg:grid-rows-[auto_auto] lg:[@media(max-height:820px)]:mt-5`}>
          {/* Live speed test: the visitor's own site vs ours */}
          <RevealItem className="lg:col-span-2 lg:row-span-2">
            <div data-proof-card data-scene-target={target(0, 'proof')} className={`card h-full p-6 ${SPOT} sm:p-8 lg:[@media(max-height:820px)]:p-4 ${look(0)}`}>
              <SpeedTest />
            </div>
          </RevealItem>

          {/* First paint timeline */}
          <RevealItem>
            <div
              data-proof-card data-scene-target={target(1, 'proof-paint')}
              className={`card flex h-full flex-col justify-between gap-6 p-6 ${SPOT} sm:p-7 lg:[@media(max-height:820px)]:gap-3 lg:[@media(max-height:820px)]:p-4 ${look(1)}`}
            >
              <span className="eyebrow">First paint on 4G</span>
              <div className={`display text-stat lg:[@media(max-height:820px)]:text-stat-sm`}>
                <CountTo to={0.4} decimals={1} />
                <span className="text-muted">s</span>
              </div>
              <div ref={paintRef}>
                <div className="relative h-2 rounded-full bg-raised">
                  {/* The race runs when its card is spotlit (wide) or comes into view (phones) */}
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
            <div data-proof-card data-scene-target={target(2, 'proof-preview')} className={`card grid h-full grid-cols-2 gap-4 p-6 ${SPOT} sm:p-7 lg:[@media(max-height:820px)]:p-4 ${look(2)}`}>
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
        </div>

        {/* Where that speed and structure pays off: the search and AI answer engines the site is built to be read by */}
        <LogoStrip label="SEO-optimised and fast, ready to be found on" items={FOUND_ON} className="mt-12" />
      </div>
    </section>
  );
}
