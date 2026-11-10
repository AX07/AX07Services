import { useEffect, useRef, useState, type ComponentType } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { EASE_OUT, Eyebrow, Headline } from '../components/Reveal';
import { AutoScrollFrame } from '../components/showcase/AutoScrollFrame';
import { DentalSite, EstateSite, LawSite } from '../components/showcase/IndustrySites';
import { whatsappLink } from '../lib/content';
import { SHOWCASE_EXIT, scrollToY } from '../lib/smooth-scroll';
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

const SUBTITLE =
  'Visitors see what you offer, trust what they see and book in a tap. We build yours in 48 hours, and you try it on your own phone before spending a euro.';

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
 * "Want a website like this?" Beautiful sites for real industries. The visitor's own scroll
 * scrolls each site in its device (a phone, or a browser window on larger screens), then moves
 * on to the next industry. Each one ends in an invitation to build yours.
 */
export function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  const phone = useIsPhone();

  // The field around the device stays at rest while the sites change: no ripple between them
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(industries.length - 1, Math.floor(v * industries.length * 0.999));
    setActive((prev) => (prev === next ? prev : next));
  });

  // Each industry's share of the scroll scrolls its site from top to bottom, with a
  // short hold at both ends before handing over to the next one
  // The scattered particles gather into the device's outline as the section arrives; the device
  // itself fades in once they have formed it (see updateScene)
  const { scrollYProgress: arrival } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  // On the way out it dissolves again as the field bursts out of it
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ['end end', 'end start'] });
  const deviceOpacity = useTransform(() => {
    const arrived = Math.min(1, Math.max(0, (arrival.get() - 0.9) / 0.1));
    const gone = Math.min(1, Math.max(0, exit.get() / (SHOWCASE_EXIT * 0.4)));
    return arrived * (1 - gone);
  });

  const pageProgress = useTransform(scrollYProgress, (v) => {
    const x = v * industries.length;
    const i = Math.min(industries.length - 1, Math.floor(x * 0.999));
    return Math.min(1, Math.max(0, (x - i - 0.1) / 0.75));
  });

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    // Land at the top of that industry's site on phones, mid-recording on larger screens
    scrollToY(top + (el.offsetHeight - window.innerHeight) * ((i + (phone ? 0.04 : 0.5)) / industries.length));
  };

  const current = industries[active];
  const Site = current.Site;

  const cta = (
    <a href={whatsappLink(current.message)} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-auto">
      Get this website
    </a>
  );

  return (
    <section ref={ref} id="showcase" className="relative h-[480vh] sm:h-[360vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-4 px-5 pt-14 sm:gap-5 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:pt-14">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <div className="hidden lg:block">
              <Eyebrow index="02" className="mb-4">
                Made for your industry
              </Eyebrow>
              <Headline
                text={[{ text: 'From first impression to' }, { text: 'instant WhatsApp booking.', className: 'accent-serif text-accent' }]}
                className="display text-display-3"
              />
              <p className="mt-4 text-pretty text-body text-muted">{SUBTITLE}</p>
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
                <div className="mt-4 hidden flex-wrap gap-2 sm:flex lg:hidden">
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
            <div className="mb-3 text-center lg:hidden">
              <Eyebrow index="02" className="mb-2 justify-center max-sm:hidden">
                Made for your industry
              </Eyebrow>
              <h2 className="display text-balance text-display-3">
                From first impression to <span className="accent-serif text-accent">instant WhatsApp booking.</span>
              </h2>
              <p className="mx-auto mt-2 max-w-md text-pretty text-body-sm text-muted">{SUBTITLE}</p>
            </div>

            <motion.div
              id="showcase-device"
              data-scene-target="showcase"
              data-scene-share="0.72"
              data-scene-fill="1"
              data-scene-pad="4"
              style={{ opacity: deviceOpacity }}
              className={`card relative mx-auto overflow-hidden p-0 ${
                phone
                  ? '!rounded-[30px] border-[5px] !border-fg w-[min(72vw,calc((100svh-410px)*0.53))]'
                  : '!rounded-[20px] w-full max-w-[min(100%,calc((100svh-320px)*1.6))] lg:max-w-none'
              }`}
            >
              {phone && (
                <div aria-hidden="true" className="relative z-10 flex h-7 items-center justify-between bg-white px-4 text-[9px] font-semibold text-black">
                  <span>9:41</span>
                  <span className="absolute left-1/2 top-2 h-[14px] w-[52px] -translate-x-1/2 rounded-full bg-black" />
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-3 rounded-[2px] border border-black/70" />
                  </span>
                </div>
              )}
              {!phone && (
                <div className="flex items-center gap-3 border-b border-line bg-raised px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                  </div>
                  <div className="mx-auto truncate rounded-full bg-surface px-4 py-1 text-[12px] text-muted">{current.domain}</div>
                  <span className="flex w-[42px] items-center justify-end gap-1.5 text-[11px] font-medium text-danger">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    Live
                  </span>
                </div>
              )}
              <div className={`relative ${phone ? 'aspect-[9/16]' : 'aspect-[16/10]'}`}>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`${current.id}-${phone}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="absolute inset-0"
                  >
                    <AutoScrollFrame virtualWidth={phone ? 390 : 1280} progress={pageProgress}>
                      <Site m={phone} />
                    </AutoScrollFrame>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
