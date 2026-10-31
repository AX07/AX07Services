import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EASE_OUT, Eyebrow, Headline, Reveal } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, projects, whatsappLink, type ProjectCategory } from '../lib/content';
import { goToSection, linkProps } from '../lib/router';
import { demoPath } from '../lib/clients';
import { SPRING } from '../lib/tokens';

const FILTERS: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'tours', label: 'Tours & watersports' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'in-house', label: 'In-house' },
];

/** The full portfolio: every build with its result, a live preview and the real site. */
export function WorkPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <main className="relative z-10 px-5 pb-28 pt-32 sm:px-6 sm:pt-40">
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
              <span className={`relative ${filter === f.id ? 'text-white' : 'text-muted hover:text-fg'}`}>{f.label}</span>
            </button>
          ))}
        </Reveal>

        <motion.div layout className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.04 }}
                className="card group flex flex-col overflow-hidden !p-0"
              >
                <a
                  {...linkProps(demoPath({ slug: p.id, stagingUrl: p.url }))}
                  aria-label={`Open the live preview of ${p.title}`}
                  className="block border-b border-line bg-raised"
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
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={`${p.shot}-1280.webp`}
                      srcSet={`${p.shot}-720.webp 720w, ${p.shot}-1280.webp 1280w`}
                      sizes="(min-width: 768px) 560px, 92vw"
                      alt={`${p.title} website`}
                      loading={i < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </a>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="text-[13px] text-subtle">
                    {p.kind} · {p.place}
                  </div>
                  <h2 className="display mt-1.5 text-title-lg">{p.title}</h2>
                  <p className="mt-3 text-body-sm text-muted">{p.description}</p>

                  <div className="mt-5 flex items-baseline gap-3 rounded-md bg-raised px-4 py-3">
                    <span className="display text-title-lg text-accent">{p.stat}</span>
                    <span className="text-[14px] text-muted">{p.statLabel}</span>
                  </div>

                  {p.quote && (
                    <blockquote className="mt-5 text-body-sm">
                      <p className="font-serif text-lead italic">“{p.quote}”</p>
                      <footer className="mt-1.5 text-[13px] text-subtle">{p.author}</footer>
                    </blockquote>
                  )}

                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <a {...linkProps(demoPath({ slug: p.id, stagingUrl: p.url }))} className="btn btn-primary !min-h-[42px] !px-5 text-[14px]">
                      Live preview
                    </a>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-quiet !min-h-[42px] !px-5 text-[14px]">
                      Visit site ↗
                    </a>
                    <a
                      href={whatsappLink(`Hi ax07, I saw the ${p.title} site in your portfolio and would like something like it for my business.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-quiet !min-h-[42px] !px-5 text-[14px]"
                    >
                      One like this
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-20 overflow-hidden rounded-lg bg-fg p-8 text-white sm:mt-28 sm:p-14">
          <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-accent-bright">Free 48-hour preview</span>
          <h2 className="display mt-3 max-w-2xl text-display-3">Your business could be the next one here.</h2>
          <p className="mt-4 max-w-xl text-body text-white/65">
            We build a working version of your site in 48 hours. If you love it, we launch it. If not, you owe nothing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn bg-white text-fg hover:bg-white/90">
              Get my free preview
            </a>
            <button type="button" onClick={() => goToSection('pricing')} className="btn cursor-pointer border border-white/20 text-white hover:bg-white/10">
              See pricing
            </button>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
