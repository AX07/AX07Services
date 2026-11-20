import { useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Eyebrow, Headline, Reveal } from '../components/Reveal';
import { TECH } from '../data/tech';
import { LogoStrip } from '../components/LogoStrip';
import { StepBar } from '../components/StepBar';

/**
 * What we build, as one system, pinned like "See it work": the section is taller than the screen and its content stays
 * put (sticky) while the visitor scrolls through it, so the normal scroll plays it: each piece lights up, the particle
 * field outlines it and a pulse runs down its line into "Your business", and a step bar shows how far along it is.
 * Nothing takes over the scroll wheel, so it can't get stuck. The tech we build with runs along the bottom.
 */

const PARTS = [
  { title: 'Website', body: 'Fast on every phone', icon: 'M3 5h18v11H3zM8 20h8M12 16v4' },
  { title: 'Booking', body: 'One tap to WhatsApp or a short form', icon: 'M4 5h16v11H9l-5 4z' },
  { title: 'Booking inbox', body: 'Every request in one place for your team', icon: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1 2h6l1-2h5' },
  { title: 'Client page', body: 'Forms and appointment details for each client', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' },
] as const;

// Where each card's line starts on the 1000-wide drawing, and the shared bus it bends into
const X = [125, 375, 625, 875];
const path = (x: number) => `M${x} 0 V70 L${x + (x < 500 ? 40 : -40)} 110 H500`;
const STEPS = PARTS.length + 1; // each piece, then everything connected
// Share of the pinned stretch before the first piece lights (the whole section is seen first) and after the last
const HOLD = 0.1;
const TAIL = 0.1;

export function FitsTogether() {
  const ref = useRef<HTMLElement>(null);
  const diagram = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // -1 before the first piece; 0–3: that piece is lit; 4: everything is connected (shown straight away with reduced motion)
  const [step, setStep] = useState(reduce ? STEPS - 1 : -1);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return;
    setStep(p < HOLD ? -1 : Math.min(STEPS - 1, Math.floor(((p - HOLD) / (1 - HOLD - TAIL)) * STEPS)));
  });
  const done = (i: number) => step > i || step === STEPS - 1;
  const allOn = step === STEPS - 1;

  return (
    <section ref={ref} id="features" className="relative h-[500vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gutter pb-3 pt-20">
      <div className="mx-auto w-full max-w-6xl">
        <Eyebrow index="01" className="mb-5 lg:[@media(max-height:900px)]:mb-3">
          How it fits together
        </Eyebrow>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14">
          <Headline
            text={[{ text: 'One system,' }, { text: 'built around you.', className: 'accent-serif text-accent' }]}
            className="display text-balance text-display-2 lg:[@media(max-height:900px)]:text-display-3"
          />
          <Reveal delay={0.1}>
            <p className="max-w-md text-body text-muted max-sm:hidden lg:[@media(max-height:900px)]:text-body-sm">
              Not a website with tools bolted on. Your site, your bookings, your inbox and each client’s own page work as one, so
              nobody falls through the gaps.
            </p>
          </Reveal>
        </div>

        <div ref={diagram} className="relative mx-auto mt-6 w-full max-w-5xl sm:mt-10 lg:mt-10 lg:[@media(max-height:900px)]:mt-5">
        <Reveal delay={0.15}>
          {/* The four pieces */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-8">
            {PARTS.map((p, i) => {
              const active = step === i;
              return (
                <div
                  key={p.title}
                  // The particle field outlines the lit piece (see updateScene in lib/smooth-scroll.ts)
                  data-scene-target={active ? `fit-${i}` : undefined}
                  data-scene-tint={active ? '1' : undefined}
                  className={`card relative flex min-h-[9.5rem] max-sm:min-h-[7.5rem] lg:[@media(max-height:900px)]:min-h-[7rem] flex-col justify-between overflow-hidden p-4 transition-[transform,box-shadow] duration-500 ease-out sm:p-5 ${
                    active ? '-translate-y-1 shadow-[0_0_0_1px_var(--color-accent-bright),0_18px_40px_-18px_var(--color-accent-bright)]' : ''
                  }`}
                >
                  {/* A soft sheen sweeps across the card while it's its turn */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,color-mix(in_srgb,var(--color-accent-bright)_18%,transparent)_50%,transparent_70%)] transition-transform duration-[1400ms] ease-out ${
                      active ? 'translate-x-full' : '-translate-x-full'
                    }`}
                  />
                  <div className="flex items-start justify-between">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-none stroke-fg/70" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d={p.icon} />
                    </svg>
                    <span
                      aria-hidden="true"
                      className={`grid h-6 w-6 place-items-center rounded-full bg-accent-bright text-on-accent transition-[opacity,transform] duration-300 ${
                        done(i) ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-6 lg:[@media(max-height:900px)]:mt-3">
                    <h3 className="display text-[17px] leading-tight sm:text-[19px]">{p.title}</h3>
                    <p className="mt-1 text-[13px] leading-snug text-muted">{p.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* The lines into the business: drawn on wide screens; phones get one straight line */}
          <svg viewBox="0 0 1000 160" aria-hidden="true" className="hidden h-auto w-full overflow-visible lg:block lg:[@media(max-height:900px)]:h-[84px]" preserveAspectRatio="none" fill="none">
            {X.map((x) => (
              <path key={x} d={path(x)} stroke="var(--color-line-strong)" strokeWidth={1.5} />
            ))}
            <path d="M500 110 V160" stroke="var(--color-line-strong)" strokeWidth={1.5} />
            {/* The pulse: a short bright stretch of the same path, run from the card to the bus */}
            {X.map((x, i) => (
              <path
                key={`${x}-${step === i}`}
                d={path(x)}
                pathLength={1}
                stroke="var(--color-accent-bright)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="0.22 1.2"
                className={step === i ? 'animate-[pulse-run_1.2s_var(--ease-out)_both]' : 'opacity-0'}
              />
            ))}
            <rect x={491} y={101} width={18} height={18} rx={5} className="fill-surface" stroke={allOn ? 'var(--color-accent-bright)' : 'var(--color-line-strong)'} strokeWidth={1.5} />
          </svg>
          <div aria-hidden="true" className="mx-auto h-10 w-px bg-line-strong lg:hidden" />

          {/* Your business */}
          <div className="flex justify-center">
            <div
              data-scene-target={allOn ? 'fit-business' : undefined}
              data-scene-tint={allOn ? '1' : undefined}
              className={`card inline-flex items-center gap-3 !rounded-full px-5 py-3 transition-shadow duration-500 sm:px-6 sm:py-3.5 ${
                allOn ? 'shadow-[0_0_0_1px_var(--color-accent-bright),0_0_40px_-6px_var(--color-accent-bright)]' : ''
              }`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-bright text-on-accent">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth={3} strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <span className="display text-[18px] sm:text-[20px]">Your business</span>
            </div>
          </div>
        </Reveal>
        </div>

        {/* Where the pinned section is */}
        {!reduce && <StepBar steps={STEPS} active={step} className="mt-4 sm:mt-6" />}

        {/* What we build with */}
        <LogoStrip label="Built with" items={TECH} className="mt-5 sm:mt-8" />
      </div>
      </div>
    </section>
  );
}
