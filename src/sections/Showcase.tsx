import { useEffect, useRef, useState, type ComponentType } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { EASE_OUT, Eyebrow, Headline } from '../components/Reveal';
import { AutoScrollFrame } from '../components/showcase/AutoScrollFrame';
import { DentalSite, EstateSite, LawSite } from '../components/showcase/IndustrySites';
import { whatsappLink } from '../lib/content';
import { scrollToY } from '../lib/smooth-scroll';
import { SPRING } from '../lib/tokens';

interface Industry {
  id: string;
  tab: string;
  audience: string;
  domain: string;
  pitch: string;
  features: string[];
  message: string;
  Site: ComponentType<{ m: boolean }>;
}

const industries: Industry[] = [
  {
    id: 'dental',
    tab: 'Dental clinic',
    audience: 'clinic',
    domain: 'lumendental.ie',
    pitch: 'Calm, trustworthy and bookable in a minute, so nervous patients actually make the appointment.',
    features: ['Online booking', 'Upfront fees', 'Google reviews'],
    message: "Hi ax07, I run a dental clinic and I'd love a website like the one on your site. Can we talk?",
    Site: DentalSite,
  },
  {
    id: 'law',
    tab: 'Law firm',
    audience: 'firm',
    domain: 'halemercer.ie',
    pitch: 'Authority at first glance, and a free consultation one tap away. The site works like your best partner.',
    features: ['Consultation booking', 'Practice areas', 'Case results'],
    message: "Hi ax07, I'm with a law firm and I'd love a website like the one on your site. Can we talk?",
    Site: LawSite,
  },
  {
    id: 'estate',
    tab: 'Real estate',
    audience: 'agency',
    domain: 'coastline.pt',
    pitch: 'Listings that sell the lifestyle, search that just works, and valuation requests straight to your phone.',
    features: ['Property search', 'Listing pages', 'Valuation requests'],
    message: "Hi ax07, I run a real estate agency and I'd love a website like the one on your site. Can we talk?",
    Site: EstateSite,
  },
];

function useIsPhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return phone;
}

/**
 * "Want a website like this?" Beautiful sites for real industries, playing like screen
 * recordings. Scroll (or tap) through them; each one ends in an invitation to build yours.
 */
export function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  const phone = useIsPhone();

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(industries.length - 1, Math.floor(v * industries.length * 0.999));
    setActive((prev) => (prev === next ? prev : next));
  });

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / industries.length));
  };

  const current = industries[active];
  const Site = current.Site;

  const cta = (
    <a href={whatsappLink(current.message)} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-auto">
      Want one like this? Let’s build it together
    </a>
  );

  return (
    <section ref={ref} id="showcase" className="relative h-[360vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-5 px-5 pt-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:pt-0">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <div className="hidden lg:block">
              <Eyebrow index="02" className="mb-4">
                Made for your industry
              </Eyebrow>
              <Headline
                text={[{ text: 'Picture this as' }, { text: 'your website.', className: 'accent-serif text-accent' }]}
                className="display text-display-3"
              />
            </div>

            {/* Industry tabs */}
            <div className="flex gap-1 rounded-full bg-raised p-1 lg:mt-8">
              {industries.map((ind, i) => (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-pressed={i === active}
                  className="relative flex-1 cursor-pointer whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors sm:px-4 sm:text-[14px]"
                >
                  {i === active && (
                    <motion.span
                      layoutId="showcase-tab"
                      transition={SPRING}
                      className="absolute inset-0 rounded-full bg-surface shadow-sm"
                    />
                  )}
                  <span className={`relative ${i === active ? 'text-fg' : 'text-muted'}`}>{ind.tab}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="mt-4 lg:mt-6"
              >
                <p className="hidden text-body-sm text-muted sm:block sm:text-body">{current.pitch}</p>
                <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
                  {current.features.map((f) => (
                    <span key={f} className="rounded-full border border-line px-3 py-1.5 text-[13px] text-fg">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="mt-5 sm:mt-7">{cta}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Device: the site plays like a screen recording */}
          <div className="order-1 lg:order-2">
            <div className="mb-4 text-center lg:hidden">
              <Eyebrow index="02" className="mb-2 justify-center">
                Made for your industry
              </Eyebrow>
              <h2 className="display text-display-3">
                Picture this as <span className="accent-serif text-accent">your website.</span>
              </h2>
            </div>

            <div
              className={`card relative mx-auto overflow-hidden p-0 ${
                phone
                  ? '!rounded-[34px] border-[6px] !border-fg w-[min(64vw,calc((100svh-330px)*0.47))]'
                  : '!rounded-[20px] w-full max-w-[min(100%,calc((100svh-260px)*1.6))] lg:max-w-none'
              }`}
            >
              {!phone && (
                <div className="flex items-center gap-3 border-b border-line bg-raised px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
                    <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
                    <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
                  </div>
                  <div className="mx-auto truncate rounded-full bg-surface px-4 py-1 text-[12px] text-muted">{current.domain}</div>
                  <span className="flex w-[42px] items-center justify-end gap-1.5 text-[11px] font-medium text-danger">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    Live
                  </span>
                </div>
              )}
              <div className={`relative ${phone ? 'aspect-[9/19]' : 'aspect-[16/10]'}`}>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`${current.id}-${phone}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="absolute inset-0"
                  >
                    <AutoScrollFrame virtualWidth={phone ? 390 : 1280}>
                      <Site m={phone} />
                    </AutoScrollFrame>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
