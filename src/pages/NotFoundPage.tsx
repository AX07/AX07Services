import { Eyebrow, Headline, Reveal } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/content';
import { linkProps } from '../lib/router';
import { WaveBackdrop } from '../components/WaveBackdrop';

const PLACES = [
  { to: '/', title: 'Home', body: 'What we build and what it costs.' },
  { to: '/work', title: 'Work', body: 'Sites we built and the results they delivered.' },
  { to: '/about', title: 'About', body: 'Who is behind the studio and how we work.' },
];

/** Shown for any address the site doesn't have, with a real 404 status (vercel.json serves 404.html). */
export function NotFoundPage() {
  return (
    <main className="relative isolate z-10 flex min-h-[100svh] items-center px-5 pb-24 pt-32 sm:px-6 sm:pt-40">
      <WaveBackdrop eager className="top-0 h-[min(80svh,720px)]" />
      <div className="mx-auto w-full max-w-6xl">
        <Eyebrow className="mb-5">Error 404</Eyebrow>
        <Headline
          as="h1"
          trigger="mount"
          text={[{ text: 'This page loaded fast.' }, { text: 'It just isn’t here.', className: 'text-muted' }]}
          className="display max-w-3xl text-display-1"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-body text-muted">
            The link may be old or mistyped. If someone sent you a preview link, ask them for a fresh one, or message us and we’ll
            send it straight over.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-2">
          <a {...linkProps('/')} className="btn btn-primary">
            Back to home
          </a>
          <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-quiet">
            Message us on WhatsApp
          </a>
        </Reveal>

        <Reveal delay={0.4} className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PLACES.map((p) => (
            <a key={p.to} {...linkProps(p.to)} className="card group block !p-6 transition-colors hover:border-fg/20">
              <div className="flex items-center justify-between">
                <span className="display text-title">{p.title}</span>
                <span aria-hidden="true" className="text-muted transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
              <p className="mt-2 text-body-sm text-muted">{p.body}</p>
            </a>
          ))}
        </Reveal>
      </div>
    </main>
  );
}
