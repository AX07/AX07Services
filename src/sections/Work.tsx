import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ReelVideo } from '../components/ReelVideo';
import { WorkTile } from '../components/WorkTile';
import { Eyebrow, Headline } from '../components/Reveal';
import { projects, rememberWorkReturn, workPath } from '../lib/content';
import { linkProps } from '../lib/router';

// Home page: six builds in one bento screen (All work has every one)
const FEATURED = ['digital-dentistry', 'flyfoil', 'altura', 'albania', 'la-kafeteria', 'vice-city'].map((id) => projects.find((p) => p.id === id)!).filter(Boolean);
const AREAS = ['[grid-area:a]', '[grid-area:b]', '[grid-area:c]', '[grid-area:d]', '[grid-area:e]', '[grid-area:f]'];
const STEP = 50; // svh of scroll each project holds the spotlight

/** Pinned bento: scrolling lights up one project at a time, and the particle field traces the lit tile. */
export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(-1);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const n = FEATURED.length;
    // All lit on the way in and on the way out
    setActive(reduce || p < 0.04 || p > 0.96 ? -1 : Math.min(n - 1, Math.floor(((p - 0.04) / 0.92) * n)));
  });

  return (
    <section ref={sectionRef} id="work" className="relative" style={reduce ? undefined : { height: `${100 + FEATURED.length * STEP}svh` }}>
      <div className={`mx-auto flex h-[100svh] max-w-6xl flex-col gap-4 px-4 pb-5 pt-24 sm:px-6 ${reduce ? '' : 'sticky top-0'}`}>
        <div>
          <Eyebrow index="03" className="mb-3">
            Selected work
          </Eyebrow>
          <div className="flex items-end justify-between gap-6">
            <Headline text={[{ text: 'Work that pays' }, { text: 'for itself.' }]} className="display text-display-3" />
            <a {...linkProps('/work')} className="btn btn-quiet !min-h-[40px] shrink-0 !px-4 text-[14px]">
              All work →
            </a>
          </div>
          <div className="mt-3 h-px bg-line">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-px origin-left bg-accent" />
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[1.35fr_1fr_1fr_1fr] gap-3.5 [grid-template-areas:'a_a'_'b_c'_'d_d'_'e_f'] md:grid-cols-4 md:grid-rows-3 md:gap-5 md:[grid-template-areas:'a_a_b_c'_'a_a_d_d'_'e_e_f_f']">
          {FEATURED.map((p, i) => {
            const lit = active === i;
            return (
              <WorkTile
                key={p.id}
                {...linkProps(workPath(p.id))}
                onClickCapture={() => rememberWorkReturn('/#work')}
                kind={`${p.kind} · ${p.place}`}
                title={p.title}
                stat={`${p.stat} ${p.statLabel}`}
                art={<ReelVideo id={p.id} shot={p.shot} title={p.title} className="absolute inset-0" />}
                // The particle field gathers around the lit tile (see updateScene)
                data-scene-target={lit ? `work-${i}` : undefined}
                data-scene-pad="7"
                data-scene-share="0.4"
                className={`${AREAS[i]} min-h-0 transition-[opacity,filter,scale] duration-500 ease-out ${
                  lit ? 'z-10 scale-[1.02]' : active < 0 ? '' : 'scale-[0.97] opacity-60 saturate-[0.35]'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
