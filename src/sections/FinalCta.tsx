import { useState, type FormEvent } from 'react';
import { Headline, Reveal } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/content';

/** The bookend: the particle logo reassembles above this section as it scrolls in. */
export function FinalCta() {
  const [business, setBusiness] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.open(whatsappLink(DEFAULT_WHATSAPP_MESSAGE + business.trim()), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="final-cta" className="relative px-6 pb-24 pt-20 sm:pb-32">
      <div className="mx-auto w-full max-w-3xl text-center">
        {/* The particle logo reassembles inside this slot (positioned by the 3D scene) */}
        <div id="cta-logo-slot" aria-hidden="true" className="mx-auto mb-8 h-[38svh] max-h-[420px] min-h-[220px] sm:h-[44svh]" />
        <Headline
          text={[{ text: 'Let’s build the website your business' }, { text: 'deserves.', className: 'accent-serif text-accent' }]}
          className="display text-balance text-display-2"
        />
        <Reveal delay={0.15} className="mx-auto mt-6 max-w-lg text-body text-muted">
          Tell us your business name. In 48 hours you’ll have a working preview on your phone. If you don’t love it, you
          don’t pay.
        </Reveal>

        <Reveal delay={0.25}>
          <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row sm:rounded-full sm:border sm:border-line-strong sm:bg-surface sm:p-1.5">
            <label htmlFor="business" className="sr-only">
              Your business name or website
            </label>
            <input
              id="business"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="Your business name or website"
              autoComplete="organization"
              className="min-h-[48px] flex-1 rounded-full border border-line-strong bg-surface px-5 text-[15px] text-fg placeholder:text-subtle focus:outline-none sm:border-0 sm:bg-transparent"
            />
            <button type="submit" className="btn btn-primary">
              Get my free preview
            </button>
          </form>
          <p className="mt-5 text-[13px] text-subtle">Opens WhatsApp · Usually answered within the hour</p>
        </Reveal>
      </div>
    </section>
  );
}
