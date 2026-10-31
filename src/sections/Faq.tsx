import { Eyebrow, Headline, RevealGroup, RevealItem } from '../components/Reveal';
import { faqs } from '../lib/content';

export function Faq() {
  return (
    <section id="faq" className="relative gutter section-y">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Eyebrow index="08" className="mb-5">
            Questions
          </Eyebrow>
          <Headline text="Good questions, straight answers." className="display text-display-2" />
        </div>

        <RevealGroup stagger={0.05} as="div" className="border-t border-line">
          {faqs.map((f) => (
            <RevealItem key={f.q} className="border-b border-line">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-title font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="relative h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-open:rotate-45"
                  >
                    <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-fg" />
                    <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-fg" />
                  </span>
                </summary>
                <p className="max-w-xl pb-7 pr-10 text-body text-muted">{f.a}</p>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
