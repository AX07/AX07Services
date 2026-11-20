import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { EASE_OUT, Eyebrow, Headline } from '../components/Reveal';
import { whatsappLink } from '../lib/content';
import { crossedForward, railPulse } from '../lib/rail';
import { SHOWCASE_EXIT } from '../lib/smooth-scroll';

/**
 * "See it work": our own site on a phone (a browser window on larger screens). The visitor's
 * scroll plays a booking from start to finish: the page scrolls to the plans, a finger taps
 * Subscription, WhatsApp opens with the message already written, it's sent, and a real person
 * replies. Every button on the screen is live, so anyone can stop scrolling and try it for real.
 *
 * Keeps the showcase's id and device: the particle field bursts out of the hero, gathers into
 * this device and bursts out of it again on the way out (see updateScene).
 */

// Scroll beats, as a share of the section's pinned scroll
const AT = {
  scroll: [0.05, 0.33] as const, // the page scrolls down to the plans
  pointer: 0.33, // the finger comes in
  tap: 0.44, // Subscription is tapped
  open: [0.47, 0.55] as const, // WhatsApp opens over the site
  send: 0.63, // send is tapped
  typing: 0.69,
  reply1: 0.76,
  reply2: 0.86,
};

const OPTIONS = [
  {
    id: 'full',
    name: 'Full build',
    price: '€1,270',
    cadence: 'one-time',
    extra: '+ €47/month hosting and care',
    pitch: 'Your site and booking system, yours from day one.',
    cta: 'Book on WhatsApp',
    message: "Hi ax07, I'm interested in the full build (€1,270 + €47/month). Can we talk?",
  },
  {
    id: 'sub',
    name: 'Subscription',
    price: '€0',
    cadence: 'upfront',
    extra: '€174/month for 12 months',
    pitch: 'Everything included, and the code is yours after 12 months.',
    cta: 'Book on WhatsApp',
    message: "Hi ax07, I'd like the subscription: €0 upfront and €174/month. Can we talk?",
    featured: true,
  },
  {
    id: 'custom',
    name: 'Custom build',
    price: 'Quoted',
    cadence: 'for you',
    extra: 'Dashboards, calculators, client portals',
    pitch: 'A bigger system, built around how you already work.',
    cta: 'Get a quote',
    message: "Hi ax07, I'd like a quote for a custom build. Here's what I have in mind:",
  },
  {
    id: 'ask',
    name: 'Ask a question',
    price: '',
    cadence: '',
    extra: '',
    pitch: 'Not sure which fits? Ask us anything and a real person replies.',
    cta: 'Ask on WhatsApp',
    message: 'Hi ax07, I have a question:',
  },
] as const;

const SUB_MESSAGE = OPTIONS[1].message;

const STEPS = [
  { title: 'They see what you offer', body: 'Clear options and prices, on a site that opens instantly on any phone.' },
  { title: 'One tap opens WhatsApp', body: 'The message is already written for them. All that’s left is pressing send.' },
  { title: 'A real person replies', body: 'You answer from your own phone, book them in, and it lands in your dashboard.' },
];

const CTA_MESSAGE = "Hi ax07, I'd like a WhatsApp booking system like the one on your site. Can we talk?";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function stageAt(p: number) {
  if (p < AT.tap) return 0; // browsing the site
  if (p < AT.open[0]) return 1; // tapped
  if (p < AT.send) return 2; // WhatsApp open, message ready
  if (p < AT.typing) return 3; // sent
  if (p < AT.reply1) return 4; // typing
  if (p < AT.reply2) return 5; // first reply
  return 6;
}

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

export function BookingDemo() {
  const ref = useRef<HTMLElement>(null);
  const phone = useIsPhone();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [stage, setStage] = useState(0);

  const lastP = useRef(0);
  useMotionValueEvent(p, 'change', (v) => {
    const next = stageAt(v);
    setStage((prev) => (prev === next ? prev : next));
    const prev = lastP.current;
    if (crossedForward(prev, v, AT.tap)) railPulse({ tone: 'accent', size: 'sm', label: 'Subscription chosen' });
    if (crossedForward(prev, v, AT.send)) railPulse({ tone: 'accent', size: 'sm', label: 'Message sent' });
    if (crossedForward(prev, v, AT.reply1)) railPulse({ tone: 'accent', size: 'lg', label: 'A real reply' });
    lastP.current = v;
  });

  // The scattered particles gather into the device's outline as the section arrives; the device
  // fades in once they have formed it, and dissolves again as the field bursts out of it
  const { scrollYProgress: arrival } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ['end end', 'end start'] });
  const deviceOpacity = useTransform(() => {
    const arrived = clamp01((arrival.get() - 0.9) / 0.1);
    const gone = clamp01(exit.get() / (SHOWCASE_EXIT * 0.4));
    return arrived * (1 - gone);
  });

  const step = stage < 1 ? 0 : stage < 3 ? 1 : 2;
  const waOpen = stage >= 2;

  const cta = (
    <a href={whatsappLink(CTA_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-auto">
      Get this for your business
    </a>
  );

  const headline = (
    <>
      One tap from your site <span className="accent-serif text-accent">to a booking in WhatsApp.</span>
    </>
  );

  return (
    <section ref={ref} id="showcase" className="relative h-[270vh] sm:h-[240vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-4 px-5 pt-14 sm:gap-5 sm:px-6 sm:pt-16 lg:grid-cols-[0.82fr_1.3fr] lg:gap-10 lg:pt-24">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <div className="hidden lg:block">
              <Eyebrow index="02" className="mb-4">
                See it work
              </Eyebrow>
              <Headline
                text={[{ text: 'One tap from your site' }, { text: 'to a booking in WhatsApp.', className: 'accent-serif text-accent' }]}
                className="display text-display-3"
              />
              <p className="mt-4 text-pretty text-body text-muted [@media(max-height:950px)]:hidden">
                This is our own site, built the way we build yours. Scroll to watch someone choose a plan, or tap any button on the
                screen and try it for real.
              </p>

              <ol className="mt-7 space-y-1 [@media(max-height:950px)]:mt-4">
                {STEPS.map((s, i) => (
                  <li
                    key={s.title}
                    className={`rounded-md px-4 py-3 transition-[background-color,box-shadow] duration-500 ${i === step ? 'bg-surface shadow-raised' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors duration-500 ${
                          i < step ? 'bg-accent-bright text-white' : i === step ? 'bg-fg text-on-fg' : 'bg-raised text-muted'
                        }`}
                      >
                        {i < step ? <Check className="h-3 w-3" /> : i + 1}
                      </span>
                      <h3 className={`font-display text-title font-semibold transition-colors duration-500 ${i === step ? '' : 'text-muted'}`}>
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-1 pl-9 text-[15px] leading-relaxed text-muted [@media(max-height:950px)]:hidden">{s.body}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-7 [@media(max-height:950px)]:mt-4">{cta}</div>
            </div>

            {/* Phones and tablets: the current step under the device */}
            <div className="text-center lg:hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="text-body-sm text-muted"
                >
                  <span className="font-medium text-fg">
                    {step + 1}. {STEPS[step].title}.
                  </span>{' '}
                  <span className="max-sm:hidden">{STEPS[step].body}</span>
                </motion.p>
              </AnimatePresence>
              <div className="mt-3 sm:mt-4">{cta}</div>
            </div>
          </div>

          {/* Device */}
          <div className="order-1 lg:order-2">
            <div className="mb-3 text-center lg:hidden">
              <Eyebrow index="02" className="mb-2 justify-center max-sm:hidden">
                See it work
              </Eyebrow>
              <h2 className="display text-balance text-display-3">{headline}</h2>
              <p className="mx-auto mt-2 max-w-md text-pretty text-body-sm text-muted max-sm:hidden">
                Our own site, built the way we build yours. Scroll to watch a booking, or tap and try it.
              </p>
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
                  ? '!rounded-[30px] border-[5px] !border-fg w-[min(72vw,calc((100svh-268px)*0.5625))]'
                  : '!rounded-[20px] w-full max-w-[min(100%,calc((100svh-320px)*1.6))] lg:max-w-none'
              }`}
            >
              {phone ? (
                <div
                  aria-hidden="true"
                  className={`relative z-10 flex h-7 items-center justify-between px-4 text-[9px] font-semibold transition-colors duration-300 ${
                    waOpen ? 'bg-wa-header text-white' : 'bg-ink text-fg'
                  }`}
                >
                  <span>9:41</span>
                  <span className="absolute left-1/2 top-2 h-[14px] w-[52px] -translate-x-1/2 rounded-full bg-black" />
                  <span className="h-1.5 w-3 rounded-[2px] border border-current opacity-70" />
                </div>
              ) : (
                <div className="flex items-center gap-3 border-b border-line bg-raised px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
                  </div>
                  <div className="mx-auto flex items-center gap-1.5 truncate rounded-full bg-surface px-4 py-1 text-[12px] text-muted">
                    <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                      <path d="M4.5 7V5.5a3.5 3.5 0 017 0V7M3.5 7h9v6.5h-9z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    </svg>
                    {waOpen ? 'web.whatsapp.com' : 'ax07.dev'}
                  </div>
                  <span className="w-[42px]" />
                </div>
              )}

              <DemoScreen phone={phone} p={p} stage={stage} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Screen */

/**
 * The page is drawn at real size (390px wide on a phone, 860px in a browser window) and scaled
 * down to the frame, so it reads as a real site rather than a drawing of one.
 */
function DemoScreen({ phone, p, stage }: { phone: boolean; p: MotionValue<number>; stage: number }) {
  const vw = phone ? 390 : 860;
  const frameRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [frameH, setFrameH] = useState(0);
  const travel = useMotionValue(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const page = pageRef.current;
    if (!frame || !page) return;
    const measure = () => {
      const s = frame.clientWidth / vw;
      if (!s) return;
      setScale(s);
      setFrameH(frame.clientHeight);
      // Scroll far enough to bring the Subscription card into the middle of the screen
      const card = cardRef.current;
      const max = Math.max(0, page.offsetHeight * s - frame.clientHeight);
      if (!card) return travel.set(max);
      const top = (card.getBoundingClientRect().top - page.getBoundingClientRect().top) / s;
      const want = (top + card.offsetHeight / 2) * s - frame.clientHeight * 0.5;
      travel.set(Math.min(max, Math.max(0, want)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    ro.observe(page);
    return () => ro.disconnect();
  }, [vw, travel]);

  const y = useTransform(() => -travel.get() * easeInOut(seg(p.get(), AT.scroll[0], AT.scroll[1])));
  const thumbY = useTransform(p, (v) => `${easeInOut(seg(v, AT.scroll[0], AT.scroll[1])) * 300}%`);

  // WhatsApp opening: slides up like an app on a phone, fades in as a new tab on a computer
  const waY = useTransform(p, (v) => (phone ? `${(1 - easeInOut(seg(v, AT.open[0], AT.open[1]))) * 100}%` : '0%'));
  const waOpacity = useTransform(p, (v) => (phone ? (v >= AT.open[0] ? 1 : 0) : seg(v, AT.open[0], AT.open[0] + 0.04)));

  const scaled = (children: ReactNode, height?: number) => (
    <div
      style={{
        width: vw,
        height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        opacity: scale ? 1 : 0,
      }}
    >
      {children}
    </div>
  );

  return (
    <div ref={frameRef} className={`relative overflow-hidden bg-ink ${phone ? 'aspect-[9/16]' : 'aspect-[16/10]'}`}>
      {/* Out of flow: the full-size page must not widen the frame it is scaled into */}
      <motion.div style={{ y }} className="absolute left-0 top-0">
        <div ref={pageRef} style={{ width: vw, transform: `scale(${scale})`, transformOrigin: 'top left', opacity: scale ? 1 : 0 }}>
          <Ax07Site m={phone} p={p} cardRef={cardRef} />
        </div>
      </motion.div>
      <div aria-hidden="true" className="absolute inset-y-2 right-1 w-[3px]">
        <motion.div style={{ y: thumbY }} className="h-1/4 w-full rounded-full bg-fg/30" />
      </div>

      <motion.div
        style={{ y: waY, opacity: waOpacity }}
        className={`absolute inset-0 overflow-hidden ${stage >= 2 ? '' : 'pointer-events-none'}`}
        aria-hidden={stage < 2}
      >
        {scale > 0 && scaled(<WhatsAppScreen m={phone} p={p} stage={stage} />, frameH / scale)}
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------- ax07.dev, in miniature */

function Ax07Site({ m, p, cardRef }: { m: boolean; p: MotionValue<number>; cardRef: Ref<HTMLDivElement> }) {
  const pressScale = useTransform(p, (v) => 1 - 0.06 * Math.sin(Math.PI * seg(v, AT.tap - 0.012, AT.tap + 0.02)));

  return (
    <div className="bg-ink text-fg">
      {/* Nav */}
      <div aria-hidden="true" className={`flex items-center justify-between ${m ? 'px-5 py-4' : 'px-12 py-5'}`}>
        <div className="flex items-center gap-2.5">
          <img src="/logo-mark.png" alt="" className={`${m ? 'h-7 w-7' : 'h-9 w-9'} dark:invert`} />
          <span className={`font-display font-semibold tracking-tight ${m ? 'text-[20px]' : 'text-[24px]'}`}>
            ax07<span className="text-muted">.dev</span>
          </span>
        </div>
        {m ? (
          <span className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line">
            <span className="h-[2px] w-4 rounded-full bg-fg" />
            <span className="h-[2px] w-4 rounded-full bg-fg" />
          </span>
        ) : (
          <div className="flex items-center gap-7 text-[16px] text-muted">
            <span>See it work</span>
            <span>Pricing</span>
            <span>About</span>
            <span className="rounded-full bg-fg px-5 py-2.5 font-medium text-on-fg">Free preview</span>
          </div>
        )}
      </div>

      {/* Hero, as on the real page */}
      <div aria-hidden="true" className={`text-center ${m ? 'px-6 pb-14 pt-6' : 'px-12 pb-16 pt-4'}`}>
        <img src="/logo-mark.png" alt="" className={`mx-auto dark:invert ${m ? 'h-24 w-24' : 'h-32 w-32'}`} />
        <p className={`mt-6 font-medium uppercase tracking-[0.16em] text-subtle ${m ? 'text-[11px]' : 'text-[13px]'}`}>
          Independent web studio · Ireland & the Algarve
        </p>
        <h3 className={`display mx-auto mt-4 max-w-[60rem] text-balance ${m ? 'text-[38px] leading-[1.05]' : 'text-[54px] leading-[1.03]'}`}>
          We build custom web experiences <span className="accent-serif text-accent">that convert.</span>
        </h3>
        <p className={`mx-auto mt-5 max-w-[36rem] text-pretty text-muted ${m ? 'text-[16px]' : 'text-[19px]'}`}>
          Websites with a booking system built in. One tap opens WhatsApp, a real person answers, and every booking lands in your
          dashboard.
        </p>
        <div className={`mt-8 flex justify-center gap-3 ${m ? 'flex-col' : ''}`}>
          <span className="btn btn-primary">Get your free 48h preview</span>
          <span className="btn btn-quiet">See plans</span>
        </div>
      </div>

      {/* Plans */}
      <div className={m ? 'px-5 pb-12' : 'px-12 pb-16'}>
        <p aria-hidden="true" className={`font-medium uppercase tracking-[0.16em] text-subtle ${m ? 'text-[11px]' : 'text-[13px]'}`}>
          Pricing
        </p>
        <h4 aria-hidden="true" className={`display mt-3 ${m ? 'text-[30px]' : 'text-[44px]'}`}>
          Choose how to start.
        </h4>
        <div className={`mt-7 grid gap-4 ${m ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {OPTIONS.map((o) => {
            const featured = 'featured' in o && o.featured;
            return (
              <div
                key={o.id}
                ref={o.id === 'sub' ? cardRef : undefined}
                className={`relative flex flex-col rounded-[20px] border p-6 ${featured ? 'border-accent/50 bg-accent-soft/40' : 'border-line bg-surface'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[20px] font-semibold">{o.name}</span>
                  {featured && <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[12px] font-medium text-accent">Most chosen</span>}
                </div>
                {o.price ? (
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className={`display text-[40px] leading-none ${featured ? 'text-accent' : ''}`}>{o.price}</span>
                    <span className="text-[15px] text-muted">{o.cadence}</span>
                  </div>
                ) : (
                  <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-raised text-[20px]">💬</span>
                )}
                {o.extra && <p className="mt-1.5 text-[14px] text-subtle">{o.extra}</p>}
                <p className={`mt-3 flex-1 text-[15px] leading-snug text-muted ${m ? '' : 'min-h-[2.6em]'}`}>{o.pitch}</p>
                <motion.div style={featured ? { scale: pressScale } : undefined} className="relative mt-5">
                  <a
                    href={whatsappLink(o.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn w-full !min-h-[48px] text-[15px] ${featured ? 'btn-primary' : 'btn-quiet'}`}
                  >
                    <WhatsAppGlyph className="h-4 w-4" />
                    {o.cta}
                  </a>
                  {featured && <Pointer p={p} from={AT.pointer} at={AT.tap} touch={m} />}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- WhatsApp */

function WhatsAppScreen({ m, p, stage }: { m: boolean; p: MotionValue<number>; stage: number }) {
  const chat = <Chat m={m} p={p} stage={stage} />;
  if (m) return chat;

  // WhatsApp Web: the chat list on the left, the conversation on the right
  return (
    <div className="flex h-full bg-white text-[#111b21]">
      <div className="flex w-[250px] shrink-0 flex-col border-r border-black/10">
        <div className="flex h-[64px] items-center justify-between bg-[#f0f2f5] px-4">
          <span className="h-10 w-10 rounded-full bg-black/10" />
          <span className="flex gap-5">
            <span className="h-5 w-5 rounded-full bg-black/10" />
            <span className="h-5 w-5 rounded-full bg-black/10" />
          </span>
        </div>
        <div className="px-3 py-2">
          <div className="h-9 rounded-lg bg-[#f0f2f5] px-4 text-[14px] leading-9 text-black/45">Search or start a new chat</div>
        </div>
        <div className="flex items-center gap-3 bg-[#f0f2f5] px-4 py-3">
          <Avatar size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex justify-between text-[16px]">
              <span>ax07.dev</span>
              <span className="text-[12px] text-black/45">10:24</span>
            </div>
            <div className="truncate text-[14px] text-black/55">
              {stage >= 5 ? 'Hi! Thanks for getting in touch 👋' : stage >= 4 ? 'typing…' : stage >= 3 ? SUB_MESSAGE : 'Business account'}
            </div>
          </div>
        </div>
        {[0.55, 0.4, 0.62, 0.48, 0.35].map((w, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <span className="h-12 w-12 shrink-0 rounded-full bg-black/[0.07]" />
            <div className="flex-1 space-y-2">
              <span className="block h-3 rounded-full bg-black/[0.08]" style={{ width: `${w * 100}%` }} />
              <span className="block h-2.5 w-4/5 rounded-full bg-black/[0.05]" />
            </div>
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1">{chat}</div>
    </div>
  );
}

const REPLIES = [
  'Hi! Thanks for getting in touch 👋 Great choice: the subscription has nothing to pay upfront.',
  'What’s your business called, and do you have a website already? We’ll send you a free preview within 48 hours.',
];

function Chat({ m, p, stage }: { m: boolean; p: MotionValue<number>; stage: number }) {
  const sent = stage >= 3;
  const read = stage >= 4;

  return (
    <div className="flex h-full flex-col bg-wa-paper text-[#111b21]">
      {/* Header */}
      <div className={`flex items-center gap-3 ${m ? 'bg-wa-header px-3 py-3 text-white' : 'h-[64px] bg-[#f0f2f5] px-4'}`}>
        {m && (
          <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden="true">
            <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <Avatar size={m ? 38 : 40} />
        <div className="leading-tight">
          <div className={`font-medium ${m ? 'text-[16px]' : 'text-[16px]'}`}>ax07.dev</div>
          <div className={`text-[13px] ${m ? 'opacity-80' : 'text-black/55'}`}>{stage === 4 ? 'typing…' : 'online'}</div>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex flex-1 flex-col justify-end gap-2 overflow-hidden ${m ? 'px-3 py-3' : 'px-8 py-5'}`}>
        <span className="mx-auto mb-1 rounded-md bg-white/90 px-3 py-1 text-[12px] text-black/55 shadow-sm">Today</span>
        <AnimatePresence initial={false}>
          {sent && (
            <Bubble key="out" out m={m}>
              {SUB_MESSAGE}
              <span className="ml-2 inline-flex translate-y-0.5 items-center gap-1 whitespace-nowrap text-[11px] text-black/45">
                10:24 <Ticks read={read} />
              </span>
            </Bubble>
          )}
          {stage === 4 && (
            <Bubble key="typing" m={m}>
              <span className="flex gap-1 py-1.5">
                {[0, 0.15, 0.3].map((d) => (
                  <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-black/35" style={{ animationDelay: `${d}s` }} />
                ))}
              </span>
            </Bubble>
          )}
          {stage >= 5 && (
            <Bubble key="r1" m={m}>
              {REPLIES[0]}
              <Time />
            </Bubble>
          )}
          {stage >= 6 && (
            <Bubble key="r2" m={m}>
              {REPLIES[1]}
              <Time />
            </Bubble>
          )}
        </AnimatePresence>
      </div>

      {/* Composer: the message arrives already written */}
      <div className={`flex items-end gap-2 ${m ? 'px-2 pb-3 pt-1' : 'bg-[#f0f2f5] px-4 py-3'}`}>
        <div
          className={`min-h-[44px] flex-1 rounded-[22px] bg-white px-4 py-2.5 text-[15px] leading-snug ${sent ? 'text-black/40' : 'text-[#111b21]'} ${
            m ? 'shadow-sm' : ''
          }`}
        >
          {sent ? 'Message' : SUB_MESSAGE}
        </div>
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.99.99 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" fill="currentColor" />
          </svg>
          <Pointer p={p} from={AT.open[1]} at={AT.send} touch={m} />
        </span>
      </div>
    </div>
  );
}

function Bubble({ out = false, m, children }: { out?: boolean; m: boolean; children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className={`${out ? 'self-end rounded-tr-sm bg-wa-bubble' : 'self-start rounded-tl-sm bg-white'} ${
        m ? 'max-w-[82%] text-[15px]' : 'max-w-[78%] text-[17px]'
      } rounded-xl px-3 py-2 leading-snug shadow-sm`}
    >
      {children}
    </motion.div>
  );
}

const Time = () => <span className="ml-2 inline-block translate-y-0.5 text-[11px] text-black/45">10:25</span>;

function Ticks({ read }: { read: boolean }) {
  return (
    <svg viewBox="0 0 18 12" className={`h-3 w-[18px] transition-colors duration-300 ${read ? 'text-[#53bdeb]' : 'text-black/40'}`} aria-hidden="true">
      <path d="M1 6.5l3 3 6.5-7M7 9.5l1 0.5 6.5-7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Avatar({ size }: { size: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full bg-[#0c0d10]" style={{ width: size, height: size }}>
      <img src="/logo-mark.png" alt="" className="invert" style={{ width: size * 0.6, height: size * 0.6 }} />
    </span>
  );
}

/* ---------------------------------------------------------------- Pointer */

/**
 * A finger (or a mouse pointer on a computer) that glides onto its parent and taps it at `at`,
 * all driven by the scroll. Drawn inside the scaled page, so it lands exactly on the button.
 */
function Pointer({ p, from, at, touch }: { p: MotionValue<number>; from: number; at: number; touch: boolean }) {
  const travel = (v: number) => 1 - Math.pow(1 - seg(v, from, at - 0.01), 3);
  const x = useTransform(p, (v) => (1 - travel(v)) * 150);
  const y = useTransform(p, (v) => (1 - travel(v)) * 190);
  const opacity = useTransform(p, (v) => Math.min(seg(v, from, from + 0.02), 1 - seg(v, at + 0.04, at + 0.06)));
  const press = useTransform(p, (v) => 1 - 0.18 * Math.sin(Math.PI * seg(v, at - 0.012, at + 0.02)));
  const ring = useTransform(p, (v) => 0.4 + seg(v, at, at + 0.04) * 1.6);
  const ringOpacity = useTransform(p, (v) => (v < at ? 0 : 0.55 * (1 - seg(v, at, at + 0.04))));

  return (
    <motion.span
      aria-hidden="true"
      style={{ x, y, opacity }}
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-0 w-0"
    >
      <motion.span
        style={{ scale: ring, opacity: ringOpacity }}
        className="absolute -left-8 -top-8 h-16 w-16 rounded-full border-[3px] border-accent-bright"
      />
      <motion.span style={{ scale: press }} className="absolute left-0 top-0 block">
        {touch ? (
          <span className="absolute -left-7 -top-7 block h-14 w-14 rounded-full border-2 border-white/80 bg-black/25 shadow-[0_4px_16px_rgb(0_0_0/0.25)] backdrop-blur-[2px]" />
        ) : (
          <svg viewBox="0 0 24 24" className="absolute -left-1 -top-1 h-10 w-10 drop-shadow-[0_3px_6px_rgb(0_0_0/0.3)]">
            <path d="M5 3l14 8.5-6.2 1.3L10 19z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        )}
      </motion.span>
    </motion.span>
  );
}

/* ---------------------------------------------------------------- Icons */

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 000-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.1-1.2c0-.1-.2-.2-.4-.3z"
      />
    </svg>
  );
}
