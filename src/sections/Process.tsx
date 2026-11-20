import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Eyebrow, Headline, Reveal, RevealGroup, RevealItem } from '../components/Reveal';

/** A preview we built from public information only, before the first conversation */
const EXAMPLE = { name: 'Miguel Reis Digital Dentistry', url: 'https://digital-dentistry-ten.vercel.app/' };
import { DEFAULT_WHATSAPP_MESSAGE, processSteps, whatsappLink } from '../lib/content';
import { railPulse } from '../lib/rail';

// Share of the pinned stretch before the first step lights (the whole section is seen first) and after the last
const HOLD = 0.12;
const TAIL = 0.1;

/**
 * "Your free preview", pinned like "See it work": the section is taller than the screen and its content stays put
 * (sticky) while the visitor scrolls through it, so the normal scroll plays the steps: each one lights up and the line
 * draws on to it, and a step bar shows how far along it is. Nothing takes over the scroll wheel, so it can't get stuck.
 * Phones show one step at a time in the same pinned frame. Reduced motion shows every step as done.
 */
export function Process() {
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const n = processSteps.length;
  // -1 before the first step, then the lit step
  const [active, setActive] = useState(reduce ? n - 1 : -1);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return;
    const next = p < HOLD ? -1 : Math.min(n - 1, Math.floor(((p - HOLD) / (1 - HOLD - TAIL)) * n));
    setActive((prev) => {
      // Story beat: each step reached on the way down ripples the field gathered along the line
      if (next > prev && next >= 0)
        railPulse({ tone: 'accent', size: next === n - 1 ? 'lg' : 'sm', label: `${processSteps[next].step} · ${processSteps[next].title}` });
      return next;
    });
  });

  const line = (active + 1) / n;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={section} id="process" className="relative h-[300vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gutter pb-4 pt-20">
      <div className="relative isolate mx-auto w-full max-w-6xl">
        <Eyebrow index="04" className="mb-5">
          Your free preview
        </Eyebrow>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14">
          <Headline
            text={[{ text: 'See it working' }, { text: 'before you pay.', className: 'text-accent' }]}
            className="display max-w-3xl text-balance text-display-2 lg:[@media(max-height:900px)]:text-display-3"
          />
          <Reveal delay={0.1}>
            <p className="max-w-md text-body text-muted">
              Send us your business name. Within 48 hours you get a link to your own site, built and working. You decide after
              you’ve used it.
            </p>
            {/* Desktop: the actions sit beside the headline, so the pinned section fits short screens */}
            <PreviewActions className="mt-6 hidden lg:flex" />
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-6 lg:mt-12 lg:[@media(max-height:900px)]:mt-8">
          {/* Track + drawn line: horizontal on desktop, vertical on mobile */}
          <div aria-hidden="true" className="absolute left-[11px] top-2 bottom-2 w-px bg-line lg:left-0 lg:right-0 lg:top-[11px] lg:bottom-auto lg:h-px lg:w-auto">
            <motion.div data-scene-target="process" data-scene-line="1" data-scene-pad="3" data-scene-share="0.35" initial={false} animate={{ scaleY: line }} transition={{ duration: 0.6 }} className="h-full w-px origin-top bg-accent lg:hidden" />
            <motion.div data-scene-target="process-wide" data-scene-pad="6" data-scene-share="0.35" initial={false} animate={{ scaleX: line }} transition={{ duration: 0.6 }} className="hidden h-px w-full origin-left bg-accent lg:block" />
          </div>

          <RevealGroup stagger={0.08} className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-6">
            {processSteps.map((s, i) => {
              const isActive = i === active;
              const done = i < active;
              return (
                <RevealItem key={s.step} className={`relative pl-12 lg:block lg:pl-0 lg:pt-14 ${i === Math.max(0, active) ? "" : "max-lg:hidden"}`}>
                  <span
                    className={`absolute left-0 top-0 flex h-[23px] w-[23px] items-center justify-center rounded-full border transition-colors duration-500 lg:top-0 ${
                      isActive || done ? 'border-accent-bright bg-accent-bright' : 'border-line-strong bg-ink'
                    }`}
                  >
                                        <span className={`relative h-1.5 w-1.5 rounded-full ${isActive || done ? 'bg-white' : 'bg-accent'}`} />
                  </span>
                  <div
                    ref={(el) => {
                      cards.current[i] = el;
                    }}
                    className={`rounded-md border p-5 transition-[background-color,border-color,box-shadow,opacity,transform] duration-500 ease-out sm:p-6 ${
                      isActive
                        ? 'border-line bg-surface opacity-100 shadow-raised lg:-translate-y-1'
                        : 'border-transparent opacity-75'
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[15px] font-semibold text-accent tabular-nums">{s.step}</span>
                      <span className="text-[13px] text-subtle">{s.meta}</span>
                    </div>
                    <h3 className="display mt-3 text-title-lg lg:[@media(max-height:900px)]:mt-2 lg:[@media(max-height:900px)]:text-title">{s.title}</h3>
                    <p className="mt-3 max-w-sm text-body text-muted lg:[@media(max-height:900px)]:mt-2 lg:[@media(max-height:900px)]:text-body-sm">{s.body}</p>
                    <ul className="mt-4 space-y-1.5 lg:[@media(max-height:900px)]:mt-3">
                      {s.points.map((pt) => (
                        <li key={pt} className="flex gap-2 text-body-sm text-fg/85">
                          <svg viewBox="0 0 16 16" className="mt-[5px] h-3 w-3 shrink-0 text-accent" aria-hidden="true">
                            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>

        {/* Where the stopped section is: one segment per step, filled as the scroll plays them */}
        {!reduce && (
          <div className="mt-6 flex items-center justify-center gap-3" aria-label={`Step ${active + 1} of ${n}`}>
            <div className="flex gap-1.5">
              {processSteps.map((s, i) => (
                <span key={s.step} className="h-1 w-10 overflow-hidden rounded-full bg-line-strong">
                  <span className={`block h-full origin-left rounded-full bg-accent-bright transition-transform duration-500 ease-out ${i <= active ? 'scale-x-100' : 'scale-x-0'}`} />
                </span>
              ))}
            </div>
            <span className="text-[12px] tabular-nums text-subtle">{active >= n - 1 ? 'Scroll to continue' : `${active + 1}/${n} · scroll`}</span>
          </div>
        )}

        <Reveal delay={0.1} className="lg:hidden">
          <PreviewActions className="mt-5 flex" />
        </Reveal>
      </div>
      </div>
    </section>
  );
}

function PreviewActions({ className = '' }: { className?: string }) {
  return (
    <div className={`flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start lg:gap-3 xl:flex-row xl:items-center xl:gap-5 ${className}`}>
      <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
        Get your free 48h preview
      </a>
      <a
        href={EXAMPLE.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[14px] text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg"
      >
        See a real preview ↗
      </a>
    </div>
  );
}
