import { useEffect, useRef, useState, type RefObject } from 'react';
import { motion, useScroll } from 'motion/react';
import { ReelVideo } from '../components/ReelVideo';
import { PHONE_ROWS, TIER, WorkTile } from '../components/WorkTile';
import { Eyebrow, Headline } from '../components/Reveal';
import { projects, rememberWorkReturn, workPath } from '../lib/content';
import { linkProps } from '../lib/router';

// `desk` places a tile on the six-column desktop grid. Small tiles keep the recording's own shape, so nothing is cropped
const SMALL = 'md:col-span-2 md:row-span-1 md:aspect-[16/10]';
const BIG = 'md:col-span-4 md:row-span-2';

// Home page: seven builds (All work has every one), listed in phone order
const TILES: { id: string; tier: keyof typeof TIER; desk: string }[] = [
  { id: 'digital-dentistry', tier: 'big', desk: `md:order-1 ${BIG}` },
  { id: 'flyfoil', tier: 'mid', desk: `md:order-2 ${SMALL}` },
  { id: 'la-kafeteria', tier: 'mid', desk: `md:order-4 ${SMALL}` },
  { id: 'realestate', tier: 'big', desk: `md:order-5 ${BIG}` },
  { id: 'vice-city', tier: 'big', desk: 'md:order-7 md:col-span-6 md:row-span-1 md:aspect-[16/9]' },
  { id: 'altura', tier: 'small', desk: `md:order-3 ${SMALL}` },
  { id: 'albania', tier: 'small', desk: `md:order-6 ${SMALL}` },
];

function tile(id: string) {
  // The real estate showcase is a static page, not a project: a plain link
  if (id === 'realestate') {
    return { shot: undefined, kind: 'Concept templates · Real estate', title: 'Real estate showcase', stat: 'Three openings and moving listing videos', link: { href: '/realestate' } };
  }
  const p = projects.find((x) => x.id === id)!;
  return { shot: p.shot, kind: `${p.kind} · ${p.place}`, title: p.title, stat: `${p.stat} ${p.statLabel}`, link: linkProps(workPath(id)) };
}

/** The lit tile is the one being read: nearest mid-screen, with side-by-side tiles taking turns left to right. */
function useSpotlight(grid: RefObject<HTMLDivElement | null>) {
  const [active, setActive] = useState(-1);
  const { scrollY } = useScroll();
  useEffect(() => {
    const pick = () => {
      const el = grid.current;
      const g = el?.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      if (!el || !g || g.top > mid || g.bottom < mid) return setActive(-1);
      let best = -1;
      let distance = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const r = child.getBoundingClientRect();
        const d = Math.abs(r.top + r.height * ((r.left + r.width / 2 - g.left) / g.width) - mid);
        if (d < distance) [best, distance] = [i, d];
      });
      setActive(best);
    };
    pick();
    return scrollY.on('change', pick);
  }, [grid, scrollY]);
  return active;
}

/** Bento of looping sites: scrolling lights up one at a time, and the particle field traces the lit tile. */
export function Work() {
  const grid = useRef<HTMLDivElement>(null);
  const active = useSpotlight(grid);
  const { scrollYProgress } = useScroll({ target: grid, offset: ['start center', 'end center'] });

  return (
    <section id="work" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Eyebrow index="03" className="mb-3">
          Selected work
        </Eyebrow>
        <div className="flex items-end justify-between gap-6">
          <Headline text={[{ text: 'Work that pays' }, { text: 'for itself.' }]} className="display text-display-2" />
          <a {...linkProps('/work')} className="btn btn-quiet !min-h-[40px] shrink-0 !px-4 text-[14px]">
            All work →
          </a>
        </div>
        <div className="mt-4 h-px bg-line">
          <motion.div style={{ scaleX: scrollYProgress }} className="h-px origin-left bg-accent" />
        </div>

        <div ref={grid} className={`mt-8 grid grid-cols-2 gap-3 ${PHONE_ROWS} md:auto-rows-auto md:grid-cols-6 md:gap-5`}>
          {TILES.map(({ id, tier, desk }, i) => {
            const t = tile(id);
            const lit = active === i;
            return (
              <WorkTile
                key={id}
                {...t.link}
                onClickCapture={() => rememberWorkReturn('/#work')}
                kind={t.kind}
                title={t.title}
                stat={t.stat}
                art={<ReelVideo id={id} shot={t.shot} title={t.title} className="absolute inset-0" />}
                // The particle field gathers around the lit tile (see updateScene)
                data-scene-target={lit ? `work-${i}` : undefined}
                data-scene-pad="7"
                data-scene-share="0.4"
                className={`${TIER[tier]} ${desk} transition-[opacity,filter,scale] duration-500 ease-out ${
                  lit ? 'z-10 scale-[1.015]' : active < 0 ? '' : 'scale-[0.985] opacity-80 saturate-[0.7]'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
