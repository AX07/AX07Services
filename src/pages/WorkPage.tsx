import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EASE_OUT, Eyebrow, Headline, Reveal } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, projects, rememberWorkReturn, whatsappLink, workPath, type ProjectCategory } from '../lib/content';
import { goToSection, linkProps } from '../lib/router';
import { SPRING } from '../lib/tokens';
import { WaveBackdrop } from '../components/WaveBackdrop';
import { ReelVideo } from '../components/ReelVideo';

const FILTERS: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'clinics', label: 'Clinics' },
  { id: 'tours', label: 'Tours & watersports' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'in-house', label: 'In-house' },
];

/** The full portfolio: every build with its result, a live preview and the real site. */
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

        {/* Bento grid: four columns on desktop, wide tiles (2 columns) and narrow ones in a 2+1+1 / 1+1+2 rhythm; "dense" fills any gap a filter leaves */}
        <motion.div layout className="mt-10 grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => {
              const wide = i % 3 === 0;
              return (
              <motion.article
                key={p.id}
                onClickCapture={() => rememberWorkReturn('/work')}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.04 }}
                className={`card group flex flex-col overflow-hidden !p-0 ${wide ? 'lg:col-span-2' : ''}`}
              >
                <a
                  {...linkProps(workPath(p.id))}
                  aria-label={`View the ${p.title} site`}
                  className="block border-b border-line bg-raised"
                >
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-fg/15" />
                      <span className="h-2 w-2 rounded-full bg-fg/15" />
                      <span className="h-2 w-2 rounded-full bg-fg/15" />
                    </div>
                    <span className="mx-auto truncate rounded-full bg-ink px-3 py-0.5 text-[11px] text-muted">
                      {new URL(p.url).hostname.replace(/^www\./, '')}
                    </span>
                    <span className="w-[30px]" />
                  </div>
                  <div className={`relative overflow-hidden ${wide ? 'aspect-[16/10] lg:aspect-[16/8]' : 'aspect-[16/10]'}`}>
                    <ReelVideo id={p.id} shot={p.shot} title={p.title} className="absolute inset-0" />
                  </div>
                </a>

                <div className="flex flex-1 flex-col p-5">
                  <div className="text-[13px] text-subtle">
                    {p.kind} · {p.place}
                  </div>
                  <h2 className="display mt-1 text-title">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 text-body-sm text-muted">{p.description}</p>

                  <div className="mt-4 flex items-baseline gap-3 rounded-md bg-raised px-3.5 py-2.5">
                    <span className="display text-title text-accent">{p.stat}</span>
                    <span className="text-[13px] text-muted">{p.statLabel}</span>
                  </div>

                  {p.quote && (
                    <blockquote className="mt-4 text-body-sm">
                      <p className="line-clamp-2 font-serif text-[17px] italic leading-snug">“{p.quote}”</p>
                      <footer className="mt-1.5 text-[13px] text-subtle">{p.author}</footer>
                    </blockquote>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <a {...linkProps(workPath(p.id))} className="btn btn-primary !min-h-[38px] !px-4 text-[13px]">
                      View the site
                    </a>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-quiet !min-h-[38px] !px-4 text-[13px]">
                      Live site ↗
                    </a>
                    <a
                      href={whatsappLink(`Hi ax07, I saw the ${p.title} site in your portfolio and would like something like it for my business.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-quiet !min-h-[38px] !px-4 text-[13px]"
                    >
                      One like this
                    </a>
                  </div>
                </div>
              </motion.article>
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
