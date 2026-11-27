import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EASE_OUT, Eyebrow, Headline, Reveal } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, projects, rememberWorkReturn, whatsappLink, workPath, type ProjectCategory } from '../lib/content';
import { goToSection, linkProps } from '../lib/router';
import { SPRING } from '../lib/tokens';
import { WaveBackdrop } from '../components/WaveBackdrop';
import { ReelVideo } from '../components/ReelVideo';
import { WorkTile } from '../components/WorkTile';
import { LoopVideo } from '../components/LoopVideo';

const FILTERS: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'clinics', label: 'Clinics' },
  { id: 'tours', label: 'Tours & watersports' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'in-house', label: 'In-house' },
];

/** The full portfolio: every build playing in a bento grid; a tile opens its demo page. */
export function WorkPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <main className="relative isolate z-10 px-5 pb-28 pt-32 sm:px-6 sm:pt-40">
      <WaveBackdrop eager className="top-0 h-[min(80svh,720px)]" />
      <div className="mx-auto max-w-6xl">
        <Eyebrow className="mb-5">Portfolio</Eyebrow>
        <Headline
          as="h1"
          trigger="mount"
          text={[{ text: 'Built for speed.' }, { text: 'Built for bookings.', className: 'text-muted' }]}
          className="display max-w-3xl text-display-1"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-body text-muted">
            Every site here started from a blank page, was previewed by the owner within 48 hours, and sends customers straight to
            the business instead of a booking platform.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className="relative cursor-pointer rounded-full px-4 py-2 text-[14px] transition-colors"
            >
              {filter === f.id && (
                <motion.span layoutId="work-filter" transition={SPRING} className="absolute inset-0 rounded-full bg-fg" />
              )}
              <span className={`relative ${filter === f.id ? 'text-on-fg' : 'text-muted hover:text-fg'}`}>{f.label}</span>
            </button>
          ))}
        </Reveal>

        {/* Bento of media tiles: the newest showcase across the top, then wide + narrow + narrow; the last tile stretches so a filter leaves no hole */}
        <motion.div layout className="mt-10 grid grid-flow-dense auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[clamp(200px,24vw,300px)] md:grid-cols-4 md:gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {(filter === 'all' || filter === 'in-house') && (
              <motion.div key="realestate" layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.5, ease: EASE_OUT }} className="col-span-full md:row-span-2">
                {/* A static page in public/realestate, so a plain link, not the in-app router */}
                <WorkTile
                  href="/realestate"
                  kind="Concept templates · Real estate"
                  title="Real estate showcase portfolio"
                  stat="Three openings and moving listing videos"
                  art={<LoopVideo src="/realestate/media/hero-beach.mp4" poster="/realestate/media/hero-beach.jpg" />}
                  className="h-full"
                />
              </motion.div>
            )}
            {shown.map((p, i) => {
              const last = i === shown.length - 1;
              const span =
                last && shown.length % 3 === 1 ? 'col-span-full' : i % 3 === 0 || (last && shown.length % 3 === 2) ? 'col-span-2' : 'col-span-1';
              return (
                <motion.div
                  key={p.id}
                  onClickCapture={() => rememberWorkReturn('/work')}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.04 }}
                  className={span}
                >
                  <WorkTile
                    {...linkProps(workPath(p.id))}
                    kind={`${p.kind} · ${p.place}`}
                    title={p.title}
                    stat={`${p.stat} ${p.statLabel}`}
                    art={<ReelVideo id={p.id} shot={p.shot} title={p.title} className="absolute inset-0" />}
                    className="h-full"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-20 overflow-hidden rounded-lg bg-night p-8 text-white ring-1 ring-line sm:mt-28 sm:p-14">
          <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-accent-bright">Free 48-hour preview</span>
          <h2 className="display mt-3 max-w-2xl text-display-3">Your business could be the next one here.</h2>
          <p className="mt-4 max-w-xl text-body text-white/65">
            We build a working version of your site in 48 hours. If you love it, we launch it. If not, you owe nothing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-light">
              Get my free preview
            </a>
            <button type="button" onClick={() => goToSection('pricing')} className="btn btn-ghost-light">
              See pricing
            </button>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
