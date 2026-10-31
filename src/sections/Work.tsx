import { useLayoutEffect, useRef, useState } from 'react';
import { useRange } from '../lib/motion';
import { motion, useScroll } from 'motion/react';
import { Eyebrow, Headline } from '../components/Reveal';
import { projects } from '../lib/content';
import { linkProps } from '../lib/router';

/**
 * Pinned horizontal gallery: vertical scroll drives the track sideways, so the work is
 * presented one project at a time like a keynote, on every screen size.
 */
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
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-6xl px-6 sm:mb-14">
          <Eyebrow index="06" className="mb-5">
            Selected work
          </Eyebrow>
          <div className="flex items-end justify-between gap-8">
            <Headline
              text={[{ text: 'Work that pays' }, { text: 'for itself.', className: 'text-muted' }]}
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
          {projects.map((p) => (
            <article
              key={p.id}
              className="card group flex w-[84vw] shrink-0 flex-col overflow-hidden !p-0 sm:w-[70vw] lg:h-[min(30rem,56svh)] lg:w-[64rem] lg:flex-row"
            >
              {/* The real site, framed in a browser window */}
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${p.title}`}
                className="flex flex-col border-b border-line bg-raised lg:w-[62%] lg:border-b-0 lg:border-r"
              >
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-black/10" />
                    <span className="h-2 w-2 rounded-full bg-black/10" />
                    <span className="h-2 w-2 rounded-full bg-black/10" />
                  </div>
                  <span className="mx-auto truncate rounded-full bg-ink px-3 py-0.5 text-[11px] text-muted">
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
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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
    </section>
  );
}
