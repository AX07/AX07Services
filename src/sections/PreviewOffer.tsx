import { Eyebrow, Headline, Reveal, RevealGroup, RevealItem } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/content';

/** Example of a preview we built from public information only, before the first conversation */
const EXAMPLE = { name: 'Miguel Reis Digital Dentistry', url: 'https://digital-dentistry-ten.vercel.app/' };

const INCLUDED = [
  {
    n: '01',
    title: 'Your business, not a template',
    body: 'Your name, logo, services, photos, opening hours and reviews, taken from what is already public: Google, Instagram and your current site.',
  },
  {
    n: '02',
    title: 'A working site, not a mock-up',
    body: 'A private link you open on your own phone. Every page, menu and button works, so you judge the real thing, not a picture of it.',
  },
  {
    n: '03',
    title: 'Enquiries that reach you',
    body: 'The booking buttons go to your WhatsApp, or the form you already use. Send yourself a test enquiry and see where it lands.',
  },
  {
    n: '04',
    title: 'Nothing to pay, nothing to sign',
    body: 'No deposit and no card. If it isn’t right for your business, you owe nothing and we delete it.',
  },
];

/** What the free 48-hour preview actually is: the offer spelled out, right after the real work. */
export function PreviewOffer() {
  return (
    <section id="preview" className="relative gutter section-y">
      <div className="mx-auto max-w-6xl">
        <Eyebrow index="04" className="mb-5">
          Your free preview
        </Eyebrow>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14">
          <Headline
            text={[{ text: 'See it working' }, { text: 'before you pay.', className: 'text-muted' }]}
            className="display max-w-3xl text-display-2"
          />
          <Reveal delay={0.1}>
            <p className="max-w-md text-body text-muted">
              Send us your business name. Within 48 hours you get a link to your own site, built and working. You decide after
              you’ve used it.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-4">
          {INCLUDED.map((item) => (
            <RevealItem key={item.n} className="card flex flex-col gap-3 p-6 sm:p-7">
              <span className="text-[13px] font-medium tabular-nums text-accent">{item.n}</span>
              <h3 className="display text-title">{item.title}</h3>
              <p className="text-body-sm text-muted">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Get your free 48h preview
          </a>
          <a
            href={EXAMPLE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg"
          >
            See a real preview: {EXAMPLE.name} ↗
          </a>
        </Reveal>
      </div>
    </section>
  );
}
