import { useLayoutEffect, useRef, useState } from 'react';
import { useRange } from '../lib/motion';
import { motion, useScroll } from 'motion/react';
import { ReelVideo } from '../components/ReelVideo';
import { Eyebrow, Headline } from '../components/Reveal';
import { projects, rememberWorkReturn, workPath } from '../lib/content';
import { linkProps } from '../lib/router';

/**
 * Pinned horizontal gallery: vertical scroll drives the track sideways, so the work is
 * presented one project at a time like a keynote, on every screen size.
 */
// Home page: the four strongest builds (All work has every one), and the track moves faster than the scroll, so the
// pinned stretch is shorter
const FEATURED = ['digital-dentistry', 'flyfoil', 'altura', 'albania'].map((id) => projects.find((p) => p.id === id)!).filter(Boolean);
const TRAVEL = 0.45; // page scroll per pixel the track moves sideways

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useRange(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const progress = useRange(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative"
      // Pinned height = one screen + however far the track travels sideways
      style={{ height: `calc(100svh + ${Math.round(distance * TRAVEL)}px)` }}
    >
      <div className="sticky top-0 isolate flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-6xl px-6 sm:mb-14">
          <Eyebrow index="03" className="mb-5">
            Selected work
          </Eyebrow>
          <div className="flex items-end justify-between gap-8">
            <Headline
              text={[{ text: 'Work that pays' }, { text: 'for itself.' }]}
              className="display text-display-2"
            />
            <div className="mb-2 flex shrink-0 flex-col items-end gap-4">
              <a {...linkProps('/work')} className="btn btn-quiet !min-h-[40px] !px-4 text-[14px]">
                All work →
              </a>
              <div className="hidden h-px w-40 bg-line sm:block">
                <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-accent" />
              </div>
            </div>
          </div>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-4 pl-6 pr-6 sm:gap-6 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
          {FEATURED.map((p) => (
            // Each slide is a small bento box: the site playing in a browser window, then the name, the result and a word from the owner
            <article
              key={p.id}
              className="card group grid w-[84vw] shrink-0 grid-cols-2 gap-2 overflow-hidden !p-2 sm:w-[70vw] lg:h-[min(30rem,56svh)] lg:w-[64rem] lg:grid-cols-[62%_1fr] lg:grid-rows-[auto_auto_1fr] lg:gap-3 lg:!p-3"
            >
              {/* The real site, framed in a browser window */}
              <a
                {...linkProps(workPath(p.id))}
                onClickCapture={() => rememberWorkReturn('/#work')}
                aria-label={`View the ${p.title} site`}
                className="col-span-2 flex flex-col overflow-hidden rounded-[calc(var(--radius-lg)-6px)] border border-line bg-raised/60 lg:col-span-1 lg:row-span-3"
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
                  <ReelVideo id={p.id} shot={p.shot} title={p.title} className="absolute inset-0" />
                </div>
              </a>

              {/* Name */}
              <div className="col-span-2 rounded-[calc(var(--radius-lg)-6px)] bg-raised/60 p-4 lg:col-span-1 lg:p-6">
                <span className="text-[13px] text-muted">
                  {p.kind} · {p.place}
                </span>
                <h3 className="display mt-1 text-title-lg">{p.title}</h3>
              </div>
              {/* Result */}
              <div className="rounded-[calc(var(--radius-lg)-6px)] bg-raised/60 p-4 lg:p-6">
                <div className="display text-stat text-accent">{p.stat}</div>
                <div className="text-[14px] text-muted">{p.statLabel}</div>
              </div>
              {/* A word from the owner, or what was built */}
              <figure className="flex flex-col justify-end rounded-[calc(var(--radius-lg)-6px)] bg-raised/60 p-4 lg:p-6">
                <blockquote className="line-clamp-4 text-body-sm text-fg/90">{p.quote ? `“${p.quote}”` : p.description}</blockquote>
                {p.quote && <figcaption className="mt-2 text-[13px] text-subtle">{p.author}</figcaption>}
              </figure>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
