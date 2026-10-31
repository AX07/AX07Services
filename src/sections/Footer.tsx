import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { EASE_OUT } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/content';
import { goToSection, linkProps } from '../lib/router';

type Policy = 'cookies' | 'privacy' | 'terms';

const EMAIL = 'ax07.dev@gmail.com';

const socials = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/ax07dev/', icon: <LinkedInIcon /> },
  { name: 'Google reviews', href: 'https://share.google/1em5V7FtwTtUx9awY', icon: <GoogleIcon /> },
  { name: 'GitHub', href: 'https://github.com/AX07', icon: <GitHubIcon /> },
];

const explore = [
  { id: 'showcase', label: 'Showcase' },
  { id: 'features', label: 'Features' },
  { id: 'proof', label: 'Speed test' },
  { id: 'work', label: 'Work' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

const pages = [
  { path: '/work', label: 'All work' },
  { path: '/about', label: 'About' },
];

export function Footer() {
  const [policy, setPolicy] = useState<Policy | null>(null);

  return (
    <footer className="relative border-t border-line px-5 pb-10 pt-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo-mark.png" alt="" width={24} height={24} className="h-6 w-6 dark:invert" />
              <span className="font-display text-[18px] font-semibold tracking-tight">ax07</span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
              Independent web studio. Custom websites, booking systems and calculators, designed and engineered in Dublin and
              Tavira.
            </p>
            <a
              href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-6 !min-h-[44px] text-[14px]"
            >
              Get your free 48h preview
            </a>
          </div>

          {/* Contact */}
          <FooterColumn title="Contact">
            <FooterLink href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} external>
              WhatsApp +353 89 441 9127
            </FooterLink>
            <FooterLink href={`mailto:${EMAIL}`}>{EMAIL}</FooterLink>
            <li className="text-[14px] text-subtle">Dublin, Ireland · Tavira, Algarve</li>
          </FooterColumn>

          {/* Find us */}
          <FooterColumn title="Find us">
            {socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[14px] text-fg transition-colors hover:text-accent"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface">{s.icon}</span>
                  {s.name}
                </a>
              </li>
            ))}
          </FooterColumn>

          {/* Explore */}
          <FooterColumn title="Explore">
            {explore.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => goToSection(l.id)} className="cursor-pointer text-[14px] text-fg transition-colors hover:text-accent">
                  {l.label}
                </button>
              </li>
            ))}
            {pages.map((pg) => (
              <li key={pg.path}>
                <a {...linkProps(pg.path)} className="text-[14px] text-fg transition-colors hover:text-accent">
                  {pg.label}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-[13px] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ax07. All rights reserved.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {(['cookies', 'privacy', 'terms'] as const).map((p) => (
              <button key={p} type="button" onClick={() => setPolicy(p)} className="cursor-pointer transition-colors hover:text-fg">
                {POLICIES[p].label}
              </button>
            ))}
            {/* Private: demo links for clients (password-protected, kept out of search) */}
            <a {...linkProps('/admin')} rel="nofollow" className="transition-colors hover:text-fg">
              Admin
            </a>
          </div>
        </div>
      </div>

      <PolicyDialog policy={policy} onClose={() => setPolicy(null)} />
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-4">{title}</h2>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, external, children }: { href: string; external?: boolean; children: ReactNode }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-[14px] text-fg transition-colors hover:text-accent"
      >
        {children}
      </a>
    </li>
  );
}

/* ---------------------------------------------------------------- Policies */

const POLICIES: Record<Policy, { label: string; title: string; body: ReactNode }> = {
  cookies: {
    label: 'Cookies',
    title: 'Cookies & storage',
    body: (
      <>
        <p>This website sets no cookies and stores nothing on your device. There are no analytics, advertising trackers or fingerprinting scripts.</p>
        <p>
          To show the page, a few things are fetched from other services: fonts from <strong>Google Fonts</strong> and, in the work and showcase
          sections, images we host ourselves. Google receives your IP address to deliver the fonts.
        </p>
        <p>
          If you use the speed test, the website address you enter is sent to <strong>Google PageSpeed Insights</strong>. If Google is unavailable,
          your browser requests that address directly to estimate its speed.
        </p>
        <p>Our host (Vercel) keeps standard server logs, such as IP address and time of request, for security and reliability.</p>
      </>
    ),
  },
  privacy: {
    label: 'Privacy',
    title: 'Privacy policy',
    body: (
      <>
        <p>
          We only collect what you choose to send us, usually by WhatsApp or email: your name, your business, your contact details and anything
          you share about the project. We use it to reply to you and to build your preview and website.
        </p>
        <p>We never sell, rent or share your details with advertisers or marketing lists.</p>
        <p>
          WhatsApp is operated by Meta and email by your provider; their own terms apply to messages sent through them. We keep project
          conversations while we work together and delete them on request.
        </p>
        <p>
          Under the GDPR you can ask to see, correct or erase your data at any time. Email <strong>{EMAIL}</strong> and we’ll reply within 30 days.
        </p>
      </>
    ),
  },
  terms: {
    label: 'Terms',
    title: 'Terms of service',
    body: (
      <>
        <p>
          <strong>Free preview.</strong> We build a working preview of your website within 48 hours at no cost and with no deposit. If you don’t
          approve it, you owe nothing and we delete it.
        </p>
        <p>
          <strong>One-time build.</strong> €1,270 for the build, plus €47 per month for hosting, security and monitoring, cancellable at any time.
          You own the code and design once the build is paid, and you can host it yourself if you prefer.
        </p>
        <p>
          <strong>Partnership.</strong> €174 per month with €0 upfront, including hosting, updates and ongoing improvements. After 12 months of
          payments the code is yours. You can cancel at any time before then; the site comes down and the build is not handed over.
        </p>
        <p>
          <strong>Your domain.</strong> Your domain name always belongs to you, on either plan.
        </p>
        <p className="text-subtle">These summaries describe how we work; your written project agreement sets out the full terms.</p>
      </>
    ),
  },
};

function PolicyDialog({ policy, onClose }: { policy: Policy | null; onClose: () => void }) {
  useEffect(() => {
    if (!policy) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [policy, onClose]);

  // Portal to <body> so the dialog sits above the fixed nav, outside the page's stacking layers
  return createPortal(
    <AnimatePresence>
      {policy && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            data-lenis-prevent
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="card relative max-h-[85svh] w-full max-w-lg overflow-y-auto p-7 sm:p-9"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <span className="eyebrow">Last updated October 2026</span>
                <h3 id="policy-title" className="display mt-2 text-title-lg">
                  {POLICIES[policy].title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                autoFocus
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-raised text-muted transition-colors hover:text-fg"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mt-6 space-y-4 text-body-sm text-muted [&_strong]:font-semibold [&_strong]:text-fg">
              {POLICIES[policy].body}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------------------------------------------------------------- Icons */

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-[#0a66c2]" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.09 3.58-5.17 3.58-8.64z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3A7.2 7.2 0 0 1 12 19.3a7.2 7.2 0 0 1-6.76-4.97H1.24v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.24 14.33A7.2 7.2 0 0 1 4.86 12c0-.81.14-1.6.38-2.33v-3.1h-4A12 12 0 0 0 0 12c0 1.94.46 3.77 1.24 5.43l4-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A12 12 0 0 0 1.24 6.57l4 3.1A7.2 7.2 0 0 1 12 4.75z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-fg" aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .3" />
    </svg>
  );
}
