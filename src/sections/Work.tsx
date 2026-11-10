import { GlassOrbs } from '../components/GlassOrbs';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Eyebrow, Headline } from '../components/Reveal';
import { projects, rememberWorkReturn, workPath } from '../lib/content';
import { linkProps } from '../lib/router';
import { EASE_OUT } from '../lib/tokens';

/** How long each project stays in front before the carousel moves on */
const HOLD_MS = 3000;

/**
 * Auto-playing carousel: one project in front at a time, moving on every 3 seconds. It pauses while
 * the visitor hovers, focuses or drags it, and while it is off screen; arrows, dots and swipes move
 * it by hand. With reduced motion it waits for the visitor instead of playing.
 */
export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  // A drag that ended on a card must not also open it
  const dragged = useRef(false);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const reduced = useReducedMotion();
  const count = projects.length;
  const playing = inView && !hovered && !focused && !dragging && !reduced;

  // Distance between two cards, measured from the layout so it follows every breakpoint
  useLayoutEffect(() => {
    const measure = () => {
      const cards = trackRef.current?.children;
      if (cards && cards.length > 1) setStep((cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(index + 1), HOLD_MS);
    return () => window.clearTimeout(t);
  }, [playing, index, go]);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-roledescription="carousel"
      aria-label="Selected work"
      className="relative isolate overflow-hidden section-y"
    >
      <GlassOrbs layout="pair" />
      <div className="mx-auto mb-10 w-full max-w-6xl px-6 sm:mb-14">
        <Eyebrow index="03" className="mb-5">
          Selected work
        </Eyebrow>
        <div className="flex items-end justify-between gap-8">
          <Headline text={[{ text: 'Work that pays' }, { text: 'for itself.' }]} className="display text-display-2" />
          <div className="mb-2 flex shrink-0 items-center gap-2">
            <ArrowButton dir="prev" onClick={() => go(index - 1)} />
            <ArrowButton dir="next" onClick={() => go(index + 1)} />
            <a {...linkProps('/work')} className="btn btn-quiet ml-1 hidden !min-h-[40px] !px-4 text-[14px] sm:inline-flex">
              All work →
            </a>
          </div>
        </div>
      </div>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
      >
        <motion.div
          ref={trackRef}
          animate={{ x: -index * step }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
          drag="x"
          dragConstraints={{ left: -index * step, right: -index * step }}
          dragElastic={0.25}
          onDragStart={() => {
            setDragging(true);
            dragged.current = true;
          }}
          onDragEnd={(_, info) => {
            setDragging(false);
            const swipe = info.offset.x + info.velocity.x * 0.2;
            if (swipe < -60) go(index + 1);
            else if (swipe > 60) go(index - 1);
            // Let the click that ends this drag through first, then cards open on a tap again
            window.setTimeout(() => (dragged.current = false), 0);
          }}
          onClickCapture={(e) => {
            if (dragged.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="flex w-max cursor-grab touch-pan-y gap-4 pl-6 pr-6 active:cursor-grabbing sm:gap-6 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
        >
          {projects.map((p, i) => (
            <article
              key={p.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${p.title}`}
              className={`card group flex w-[84vw] shrink-0 flex-col overflow-hidden !p-0 transition-opacity duration-700 sm:w-[70vw] lg:h-[min(30rem,56svh)] lg:w-[64rem] lg:flex-row ${
                i === index ? '' : 'opacity-50'
              }`}
            >
              {/* The real site, framed in a browser window */}
              <a
                {...linkProps(workPath(p.id))}
                onClickCapture={() => rememberWorkReturn('/#work')}
                aria-label={`View the ${p.title} site`}
                draggable={false}
                className="flex flex-col border-b border-line bg-raised/60 lg:w-[62%] lg:border-b-0 lg:border-r"
              >
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-fg/15" />
                    <span className="h-2 w-2 rounded-full bg-fg/15" />
                    <span className="h-2 w-2 rounded-full bg-fg/15" />
                  </div>
                  <span className="mx-auto truncate rounded-full bg-ink/80 px-3 py-0.5 text-[11px] text-muted">
                    {new URL(p.url).hostname.replace(/^www\./, '')}
                  </span>
                  <span className="w-[30px]" />
                </div>
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:flex-1">
                  <img
                    src={`${p.shot}-1280.webp`}
                    srcSet={`${p.shot}-720.webp 720w, ${p.shot}-1280.webp 1280w`}
                    sizes="(min-width: 1024px) 40rem, 84vw"
                    width={1280}
                    height={800}
                    alt={`${p.title} website homepage`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full select-none object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </a>

              {/* Result and proof */}
              <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
                <div>
                  <span className="text-[13px] text-muted">
                    {p.kind} · {p.place}
                  </span>
                  <h3 className="display mt-2 text-title-lg">{p.title}</h3>
                </div>
                <div>
                  <div className="display text-stat text-accent">{p.stat}</div>
                  <div className="text-[14px] text-muted">{p.statLabel}</div>
                </div>
                {p.quote && (
                  <figure className="hidden sm:block">
                    <blockquote className="text-body-sm text-fg/90">“{p.quote}”</blockquote>
                    <figcaption className="mt-2 text-[13px] text-subtle">{p.author}</figcaption>
                  </figure>
                )}
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      {/* Dots: the one in front fills over its 3 seconds, and holds while the carousel is paused */}
      <div className="mx-auto mt-8 flex w-full max-w-6xl items-center gap-2 px-6">
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show ${p.title}`}
            aria-current={i === index}
            className={`relative h-1.5 cursor-pointer overflow-hidden rounded-full bg-fg/15 transition-[width] duration-500 ease-[var(--ease-out)] ${
              i === index ? 'w-10' : 'w-1.5 hover:bg-fg/30'
            }`}
          >
            {i === index && (
              <span
                key={index}
                className="absolute inset-0 origin-left rounded-full bg-accent-bright"
                style={{
                  animation: reduced ? undefined : `carousel-fill ${HOLD_MS}ms linear both`,
                  animationPlayState: playing ? 'running' : 'paused',
                  transform: reduced ? 'none' : undefined,
                }}
              />
            )}
          </button>
        ))}
        <a {...linkProps('/work')} className="ml-auto text-[14px] text-muted hover:text-fg sm:hidden">
          All work →
        </a>
      </div>
    </section>
  );
}

function ArrowButton({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous project' : 'Next project'}
      className="btn btn-quiet !min-h-[40px] !w-10 !p-0"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === 'prev' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} />
      </svg>
    </button>
  );
}
