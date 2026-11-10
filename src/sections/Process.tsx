import { GlassOrbs } from '../components/GlassOrbs';
import { useRef, useState } from 'react';
import { useRange } from '../lib/motion';
import { motion, transform, useMotionValueEvent, useScroll } from 'motion/react';
import { Eyebrow, Headline, Reveal, RevealGroup, RevealItem } from '../components/Reveal';

/** A preview we built from public information only, before the first conversation */
const EXAMPLE = { name: 'Miguel Reis Digital Dentistry', url: 'https://digital-dentistry-ten.vercel.app/' };
import { DEFAULT_WHATSAPP_MESSAGE, processSteps, whatsappLink } from '../lib/content';
import { railPulse } from '../lib/rail';

export function Process() {
  const section = useRef<HTMLElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  // Phones: the steps scroll past and the line draws as they go.
  // Desktop: the section pins until the line has reached the last step.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 15%'] });
  const { scrollYProgress: pinned } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const line = useRange(scrollYProgress, [0, 1], [0, 1]);
  const pinnedLine = useRange(pinned, [0.05, 0.85], [0, 1]);
  // Spotlight one step at a time as the line reaches it
  const [active, setActive] = useState(0);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const pick = (next: number) => setActive((prev) => (prev === next ? prev : next));

  // Story beats: each step the timeline reaches ripples the field gathered along it.
  // Rewinds when the visitor scrolls back above the section, so it replays on the way down.
  const lastStep = useRef(-1);
  const echo = (started: boolean, step: number) => {
    if (!started) {
      lastStep.current = -1;
      return;
    }
    if (step <= lastStep.current) return;
    lastStep.current = step;
    const s = processSteps[step];
    railPulse({ tone: 'accent', size: step === processSteps.length - 1 ? 'lg' : 'sm', label: `${s.step} · ${s.title}` });
  };

  useMotionValueEvent(pinned, 'change', (v) => {
    if (window.innerWidth < 1024) return;
    const next = Math.min(processSteps.length - 1, Math.floor(transform(v, [0.05, 0.85], [0, 1]) * processSteps.length));
    pick(next);
    echo(v > 0.05, next);
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (window.innerWidth >= 1024) return;
    // Stacked: the card crossing the middle of the viewport is the active one
    const mid = window.innerHeight * 0.55;
    let next = 0;
    cards.current.forEach((el, i) => {
      if (el && el.getBoundingClientRect().top < mid) next = i;
    });
    pick(next);
    echo(v > 0, next);
  });

  return (
    <section ref={section} id="process" className="relative gutter section-y lg:h-[220vh] lg:py-0">
      <div className="relative isolate mx-auto max-w-6xl lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:pt-12">
        <GlassOrbs layout="spread" className="-inset-x-[20vw] overflow-visible" />
        <Eyebrow index="04" className="mb-5">
          Your free preview
        </Eyebrow>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14">
          <Headline
            text={[{ text: 'See it working' }, { text: 'before you pay.', className: 'text-accent' }]}
            className="display max-w-3xl text-balance text-display-2 lg:[@media(max-height:780px)]:text-display-3"
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

        <div ref={ref} className="relative mt-16 lg:mt-12 lg:[@media(max-height:780px)]:mt-8">
          {/* Track + drawn line: horizontal on desktop, vertical on mobile */}
          <div aria-hidden="true" className="absolute left-[11px] top-2 bottom-2 w-px bg-line lg:left-0 lg:right-0 lg:top-[11px] lg:bottom-auto lg:h-px lg:w-auto">
            <motion.div data-scene-target="process" data-scene-line="1" data-scene-pad="3" data-scene-share="0.35" style={{ scaleY: line }} className="h-full w-px origin-top bg-accent lg:hidden" />
            <motion.div data-scene-target="process-wide" data-scene-pad="6" data-scene-share="0.35" style={{ scaleX: pinnedLine }} className="hidden h-px w-full origin-left bg-accent lg:block" />
          </div>

          <RevealGroup stagger={0.08} className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-6">
            {processSteps.map((s, i) => {
              const isActive = i === active;
              const done = i < active;
              return (
                <RevealItem key={s.step} className="relative pl-12 lg:pl-0 lg:pt-14">
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
                    <h3 className="display mt-3 text-title-lg lg:[@media(max-height:780px)]:mt-2 lg:[@media(max-height:780px)]:text-title">{s.title}</h3>
                    <p className="mt-3 max-w-sm text-body text-muted lg:[@media(max-height:780px)]:mt-2 lg:[@media(max-height:780px)]:text-body-sm">{s.body}</p>
                    <ul className="mt-4 space-y-1.5 lg:[@media(max-height:780px)]:mt-3">
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

        <Reveal delay={0.1} className="lg:hidden">
          <PreviewActions className="mt-10 flex" />
        </Reveal>
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
