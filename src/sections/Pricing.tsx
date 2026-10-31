import { Eyebrow, Headline, Reveal, RevealGroup, RevealItem } from '../components/Reveal';
import { plans, whatsappLink } from '../lib/content';

export function Pricing() {
  return (
    <section id="pricing" className="relative gutter section-y">
      <div className="mx-auto max-w-6xl">
        <Eyebrow index="07" className="mb-5">
          Pricing
        </Eyebrow>
        <Headline
          text={[{ text: 'One honest price.' }, { text: 'No surprises after launch.', className: 'text-muted' }]}
          className="display max-w-3xl text-display-2"
        />
        <Reveal className="mt-6 max-w-xl text-body text-muted">
          The 48-hour preview is free either way. You only choose a plan once you’ve seen your site working on your own phone.
        </Reveal>

        <RevealGroup stagger={0.08} className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
            <RevealItem
              key={plan.id}
              className={`card relative flex flex-col p-8 sm:p-10 ${plan.featured ? '!border-accent/40' : ''}`}
            >
              {plan.featured && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(80%_60%_at_100%_0%,rgba(16,185,129,0.10),transparent)]"
                />
              )}
              <div className="relative flex items-center justify-between gap-4">
                <h3 className="font-display text-title">{plan.name}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-[12px] font-medium text-accent">Most chosen</span>
                )}
              </div>
              <p className="relative mt-2 text-body-sm text-muted">{plan.pitch}</p>

              <div className="relative mt-8 flex items-baseline gap-2">
                <span className="display text-stat">{plan.price}</span>
                <span className="text-[15px] text-muted">{plan.cadence}</span>
              </div>
              <p className="relative mt-1 text-[14px] text-subtle">{plan.extra}</p>

              <ul className="relative mt-8 flex-1 space-y-3 border-t border-line pt-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[15px] text-fg/90">
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-accent">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={whatsappLink(plan.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn relative mt-10 w-full ${plan.featured ? 'btn-primary' : 'btn-quiet'}`}
              >
                {plan.cta}
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
