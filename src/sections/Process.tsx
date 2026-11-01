import { useRef, useState } from 'react';
import { useRange } from '../lib/motion';
import { motion, transform, useMotionValueEvent, useScroll } from 'motion/react';
import { Eyebrow, Headline, RevealGroup, RevealItem } from '../components/Reveal';
import { processSteps } from '../lib/content';
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

  // Progress rail: each step the timeline reaches is echoed on the rail, numbered like the step.
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
    <section ref={section} id="process" className="relative gutter section-y lg:h-[260vh] lg:py-0">
      <div className="mx-auto max-w-6xl lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:pt-12">
        <Eyebrow index="05" className="mb-5">
          How it works
        </Eyebrow>
        <Headline
          text={[{ text: 'From first message to live site.' }, { text: 'In days, not months.', className: 'text-muted' }]}
          className="display max-w-3xl text-display-2"
        />

        <div ref={ref} className="relative mt-20 lg:mt-16">
          {/* Track + drawn line: horizontal on desktop, vertical on mobile */}
          <div aria-hidden="true" className="absolute left-[11px] top-2 bottom-2 w-px bg-line lg:left-0 lg:right-0 lg:top-[11px] lg:bottom-auto lg:h-px lg:w-auto">
            <motion.div style={{ scaleY: line }} className="h-full w-px origin-top bg-accent lg:hidden" />
            <motion.div style={{ scaleX: pinnedLine }} className="hidden h-px w-full origin-left bg-accent lg:block" />
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
                        : 'border-transparent opacity-45'
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[15px] font-semibold text-accent tabular-nums">{s.step}</span>
                      <span className="text-[13px] text-subtle">{s.meta}</span>
                    </div>
                    <h3 className="display mt-3 text-title-lg">{s.title}</h3>
                    <p className="mt-3 max-w-sm text-body text-muted">{s.body}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
