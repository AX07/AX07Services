import { Eyebrow, Headline, Reveal, RevealGroup, RevealItem } from '../components/Reveal';
import { whatsappLink } from '../lib/content';
import { linkProps } from '../lib/router';

const LINKEDIN = 'https://www.linkedin.com/in/alexpintosmollahan/';

const TENETS = [
  {
    n: '01',
    title: 'Sub-second, on a phone',
    body: 'Every 100ms of delay costs enquiries. We ship static, compressed pages from a global edge network, so your site opens before your customer loses interest.',
  },
  {
    n: '02',
    title: 'Built from a blank page',
    body: 'No themes, no 40 plugins. Your site is designed and coded around how your customers actually find you and book you, so it looks like nobody else.',
  },
  {
    n: '03',
    title: 'See it before you pay',
    body: 'No slide decks or upfront retainers. We build a working preview of your site in 48 hours. If you love it, we launch it.',
  },
];

const STACK = [
  { name: 'React & Next.js', role: 'Framework', body: 'Pages that render instantly and score in the green on Core Web Vitals.' },
  { name: 'Three.js & React Three Fiber', role: '3D on the web', body: 'GPU-rendered 3D, like the logo on our home page, that runs smoothly on phones.' },
  { name: 'Custom GLSL shaders', role: 'Graphics', body: 'Hand-written effects instead of heavy video files or plugins.' },
  { name: 'Vercel edge network', role: 'Hosting', body: 'Served close to every visitor, with SSL and compression handled automatically.' },
  { name: 'Supabase & PostgreSQL', role: 'Data', body: 'Bookings, member areas and live data stored securely when your site needs them.' },
  { name: 'n8n automations', role: 'Workflows', body: 'WhatsApp routing, booking emails, reminders and invoices sent without anyone lifting a finger.' },
];

export function AboutPage() {
  return (
    <main className="relative z-10 px-5 pb-28 pt-32 sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        {/* Manifesto */}
        <Eyebrow className="mb-5">About the studio</Eyebrow>
        <Headline
          as="h1"
          trigger="mount"
          text={[{ text: 'Slow websites kill businesses.' }, { text: 'We kill the lag.', className: 'font-serif italic font-normal text-accent' }]}
          className="display max-w-4xl text-display-1"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lead text-muted">
            Most agencies sell a WordPress theme loaded with plugins that takes seconds to load. ax07 is an independent studio in
            Ireland and the Algarve that engineers each site from scratch, keeps it fast, and shows it to you working before you pay.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TENETS.map((t) => (
            <RevealItem key={t.n} className="card p-7">
              <span className="font-display text-[15px] font-semibold text-accent tabular-nums">{t.n}</span>
              <h2 className="display mt-3 text-title-lg">{t.title}</h2>
              <p className="mt-3 text-body-sm text-muted">{t.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Stack */}
        <section className="mt-28 sm:mt-36">
          <Eyebrow className="mb-5">What we build with</Eyebrow>
          <Headline
            text={[{ text: 'Real code.' }, { text: 'No page builders.', className: 'text-muted' }]}
            className="display max-w-3xl text-display-2"
          />
          <RevealGroup className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((s) => (
              <RevealItem key={s.name} className="bg-surface p-6 sm:p-7">
                <div className="text-[12px] font-medium uppercase tracking-[0.12em] text-subtle">{s.role}</div>
                <h3 className="mt-2 font-display text-title font-semibold">{s.name}</h3>
                <p className="mt-2 text-body-sm text-muted">{s.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* Founder */}
        <Reveal className="card mt-28 grid grid-cols-1 items-center gap-10 p-7 sm:mt-36 sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-14">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="group relative mx-auto block w-56 sm:w-64" aria-label="Alex Pintos Mollahan on LinkedIn">
            <img
              src="/about/alex.webp"
              alt="Alex Pintos Mollahan, founder of ax07"
              width={280}
              height={280}
              loading="lazy"
              className="aspect-square w-full rounded-full object-cover shadow-float transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg ring-4 ring-surface">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z" />
              </svg>
            </span>
          </a>

          <div>
            <Eyebrow className="mb-4">Founder</Eyebrow>
            <h2 className="display text-display-3">Alex Pintos Mollahan</h2>
            <p className="mt-4 max-w-2xl text-body text-muted">
              With over eight years in 3D web engineering, WebGL and fast hosting infrastructure, Alex started ax07 to give local
              businesses the kind of website that usually only big brands can afford.
            </p>
            <p className="mt-3 max-w-2xl text-body text-muted">
              You work directly with the person building your site. No account managers, no hand-offs, and no risk: we prove the
              value by building your preview first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink("Hi Alex, I've been reading about ax07 and would like to talk about a website for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Talk to Alex on WhatsApp
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn btn-quiet">
                LinkedIn ↗
              </a>
              <a {...linkProps('/work')} className="btn btn-quiet">
                See the work
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
