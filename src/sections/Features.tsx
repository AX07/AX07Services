import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { EASE_OUT, Eyebrow } from '../components/Reveal';
import { whatsappLink } from '../lib/content';

/**
 * The tools we build into a site, assembled live as the visitor scrolls: a blank page gets its
 * layout, then each feature is written, compiled and switched on in place.
 */

// Scroll budget: scaffold, three modules, then the "and more" finale
const SCAFFOLD = 0.1;
const MODULE = 0.24;
const FINALE = SCAFFOLD + MODULE * 3;
// Within a module: the first 60% is code being written, the rest is the live feature
const BUILD = 0.6;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const MODULES = [
  {
    title: 'WhatsApp booking',
    body: 'Customers pick a time in the chat they already use. You get the booking, not a voicemail.',
    code: `<WhatsAppBooking\n  business="Lumen Dental"\n  slots={calendar.free()}\n  confirm="instant" />`,
  },
  {
    title: 'Custom calculators',
    body: 'Instant quotes, treatment estimates, rental prices: whatever customers ask before they call.',
    code: `<QuoteCalculator\n  rate={(months) => months * 160}\n  options={['Standard', 'Invisible']}\n  roundTo={50} />`,
  },
  {
    title: 'Email booking & reminders',
    body: 'Confirmations, calendar invites and reminders that cut no-shows, sent automatically.',
    code: `<BookingEmails\n  confirm="on-book"\n  reminder="24h"\n  calendar="ics" />`,
  },
] as const;

const EXTRAS = ['Deposits & payments', 'Member areas', 'Multi-language', 'Live data feeds'];

type SlotState = { phase: 'empty' | 'building' | 'live'; build: number; live: number };

function slotState(p: number, i: number, compact: boolean): SlotState {
  const lp = clamp01((p - (SCAFFOLD + i * MODULE)) / MODULE);
  // Phones skip the code-writing stage and show each finished tool straight away
  if (compact) return { phase: 'live', build: 1, live: lp };
  if (lp <= 0) return { phase: 'empty', build: 0, live: 0 };
  if (lp < BUILD) return { phase: 'building', build: lp / BUILD, live: 0 };
  return { phase: 'live', build: 1, live: (lp - BUILD) / (1 - BUILD) };
}

export function Features() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [p, setP] = useState(reduce ? 1 : 0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return;
    const rounded = Math.round(v * 500) / 500;
    setP((prev) => (prev === rounded ? prev : rounded));
  });

  // Below lg only one tool shows at a time, without the build stage
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const progress = reduce ? 1 : p;
  const active = Math.min(3, Math.max(0, Math.floor((progress - SCAFFOLD) / MODULE)));
  const finale = clamp01((progress - FINALE) / (1 - FINALE));
  const slots = MODULES.map((_, i) => slotState(progress, i, compact));
  const built = slots.filter((s) => s.phase === 'live').length;

  return (
    <section ref={ref} id="features" className="relative h-[340vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-5 pt-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14 lg:pt-12">
          {/* Left: what's being built */}
          <div>
            <Eyebrow index="03" className="mb-3 lg:mb-5">
              Built in, not bolted on
            </Eyebrow>
            <h2 className="display text-display-3">
              Built for how you <span className="text-muted">actually get booked.</span>
            </h2>

            <ol className="mt-4 lg:mt-9 lg:space-y-1">
              {[...MODULES.map((m) => ({ title: m.title, body: m.body })), { title: 'And whatever else you need', body: '' }].map(
                (step, i) => {
                  const isActive = i === active;
                  const done = i < 3 ? slots[i].phase === 'live' : finale >= 1;
                  const fill = i < 3 ? (slots[i].phase === 'empty' ? 0 : (slots[i].build + slots[i].live) / 2) : finale;
                  return (
                    <li
                      key={step.title}
                      className={`${isActive ? '' : 'hidden lg:block'} relative rounded-md py-1 transition-[background-color,box-shadow] duration-500 lg:px-4 lg:py-3 ${
                        isActive ? 'lg:bg-surface lg:shadow-raised' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors duration-500 ${
                            done ? 'bg-accent-bright text-white' : isActive ? 'bg-fg text-white' : 'bg-raised text-muted'
                          }`}
                        >
                          {done ? (
                            <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </span>
                        {/* Upcoming steps are dimmed by colour, not opacity, so their text keeps AA contrast */}
                        <h3
                          className={`font-display text-title font-semibold transition-colors duration-500 ${isActive ? '' : 'lg:text-muted'}`}
                        >
                          {step.title}
                        </h3>
                      </div>
                      {step.body && (
                        <p className={`mt-1.5 pl-9 text-[14px] leading-relaxed text-muted sm:text-[15px] ${isActive ? '' : 'lg:hidden'}`}>{step.body}</p>
                      )}
                      {i === 3 && isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: EASE_OUT }}
                          className="mt-3 pl-9"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {EXTRAS.map((x, k) => (
                              <motion.span
                                key={x}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.08 * k }}
                                className="rounded-full border border-line bg-surface px-3 py-1 text-[12px] text-fg"
                              >
                                {x}
                              </motion.span>
                            ))}
                          </div>
                          <a
                            href={whatsappLink("Hi ax07, I'd like a custom booking system or calculator on my website. Can we talk?")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary mt-4 hidden lg:inline-flex"
                          >
                            Tell us what you need
                          </a>
                        </motion.div>
                      )}
                      {/* Build progress for this step */}
                      <div className="absolute bottom-0 left-9 right-4 hidden h-px overflow-hidden bg-line lg:block">
                        <div className="h-full origin-left bg-accent-bright" style={{ transform: `scaleX(${isActive ? fill : 0})` }} />
                      </div>
                    </li>
                  );
                },
              )}
            </ol>
          </div>

          {/* Right: the site under construction */}
          <div className="card overflow-hidden !rounded-[22px]">
            <div className="flex items-center gap-2 border-b border-line bg-raised px-3 py-2">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-black/10" />
                <span className="h-2 w-2 rounded-full bg-black/10" />
                <span className="h-2 w-2 rounded-full bg-black/10" />
              </span>
              <span className="mx-auto rounded-full bg-surface px-3 py-0.5 text-[11px] text-muted">lumendental.ie</span>
              <span
                className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums transition-colors duration-500 ${
                  finale > 0 || compact ? 'bg-accent-soft text-accent' : 'bg-surface text-muted'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${finale > 0 || compact ? 'bg-accent-bright' : 'bg-warn'}`} />
                {finale > 0 || compact ? 'Live' : `Building ${built}/3`}
              </span>
            </div>

            <div className="relative bg-surface p-3 sm:p-4">
              {/* Scaffold: the page's own nav draws in first */}
              <div className="flex items-center justify-between" style={{ opacity: clamp01(progress / SCAFFOLD) }}>
                <span className="font-display text-[13px] font-semibold">Lumen Dental</span>
                <div className="flex items-center gap-2">
                  <span className="hidden h-1.5 w-8 rounded-full bg-raised sm:block" />
                  <span className="hidden h-1.5 w-8 rounded-full bg-raised sm:block" />
                  <span className="rounded-full bg-fg px-2.5 py-1 text-[10px] font-medium text-white">Book</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.1fr]">
                {MODULES.map((m, i) => (
                  <div
                    key={m.title}
                    className={`${i === Math.min(active, 2) ? '' : 'hidden'} lg:block ${i === 0 ? 'lg:row-span-2' : ''}`}
                    style={{ opacity: reduce ? 1 : clamp01((progress / SCAFFOLD) * 2 - i * 0.5) }}
                  >
                    <Slot state={slots[i]} code={m.code} className={i === 0 ? 'h-[300px] lg:h-full' : i === 1 ? 'h-[240px]' : 'h-[270px] lg:h-[150px]'}>
                      {i === 0 && <ChatModule live={slots[i].live} />}
                      {i === 1 && <QuoteCalculator auto={compact ? slots[i].live : undefined} />}
                      {i === 2 && <EmailModule progress={compact ? slots[i].live : undefined} />}
                    </Slot>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Build slot */

function Slot({ state, code, className, children }: { state: SlotState; code: string; className: string; children: React.ReactNode }) {
  const name = code.slice(1, code.indexOf('\n'));
  const typed = code.slice(0, Math.round(code.length * state.build));

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence initial={false} mode="popLayout">
        {state.phase === 'live' ? (
          <motion.div
            key="live"
            initial={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="h-full"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="build"
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className={`flex h-full flex-col overflow-hidden rounded-md border border-dashed transition-colors duration-300 ${
              state.phase === 'building' ? 'border-accent-bright/60 bg-night' : 'border-line-strong bg-[linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] bg-[size:16px_16px]'
            }`}
          >
            {state.phase === 'empty' ? (
              <div className="m-auto rounded-full bg-surface px-3 py-1 font-mono text-[11px] text-subtle">{`<${name} />`}</div>
            ) : (
              <>
                <pre className="flex-1 overflow-hidden p-3 font-mono text-[11px] leading-relaxed text-[#d1fae5] sm:text-[12px]">
                  {typed}
                  <span className="ml-px inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-accent-bright" />
                </pre>
                <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2 text-[10px] text-white/60">
                  <span className="tabular-nums">Building {name}</span>
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full origin-left bg-accent-bright" style={{ transform: `scaleX(${state.build})` }} />
                  </span>
                  <span className="tabular-nums">{Math.round(state.build * 100)}%</span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- WhatsApp */

const CHAT = [
  { from: 'them', text: 'Hi! Do you have a cleaning slot this Thursday?' },
  { from: 'bot', text: 'Hi Sarah 👋 Thursday has three openings:' },
  { from: 'slots', text: '' },
  { from: 'them', text: '10:30 please' },
  { from: 'done', text: 'Booked ✓ Thu 10:30 with Dr. Byrne. See you then!' },
] as const;

/** The conversation advances with the scroll, then stays complete once the module is built. */
function ChatModule({ live }: { live: number }) {
  const visible = Math.max(1, Math.ceil(clamp01(live / 0.85) * CHAT.length));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md bg-wa-paper">
      <div className="flex items-center gap-2.5 bg-wa-header px-3 py-2.5 text-white">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px] font-semibold">LD</span>
        <div className="leading-tight">
          <div className="text-[12px] font-medium">Lumen Dental</div>
          <div className="text-[10px] opacity-75">Booking assistant · online</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-1.5 p-2.5">
        <AnimatePresence initial={false}>
          {CHAT.slice(0, visible).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className={m.from === 'them' ? 'self-end' : 'self-start'}
            >
              {m.from === 'slots' ? (
                <div className="flex gap-1.5">
                  {['09:00', '10:30', '16:15'].map((s) => (
                    <span
                      key={s}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                        s === '10:30' && visible > 3 ? 'border-wa-header bg-wa-header text-white' : 'border-wa-header/30 bg-white text-wa-header'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <div
                  className={`max-w-[220px] rounded-2xl px-3 py-1.5 text-[12px] leading-snug shadow-sm ${
                    m.from === 'them' ? 'rounded-br-md bg-wa-bubble' : 'rounded-bl-md bg-white'
                  } ${m.from === 'done' ? 'font-medium text-wa-header' : 'text-fg'}`}
                >
                  {m.text}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Calculator */

/**
 * On phones the calculator plays itself as you scroll (`auto` = 0..1): the slider is dragged
 * out, then "Invisible aligners" is tapped. Touching it hands control to the visitor.
 */
function QuoteCalculator({ auto }: { auto?: number }) {
  const [manualSize, setSize] = useState(6);
  const [manualPremium, setPremium] = useState(false);
  const [touched, setTouched] = useState(false);
  const playing = auto !== undefined && !touched;
  const a = auto ?? 0;

  const drag = playing ? 1 - Math.pow(1 - clamp01(a / 0.55), 3) : 0;
  const size = playing ? 3 + Math.round(drag * 15) : manualSize;
  const premium = playing ? a >= 0.62 : manualPremium;
  const rate = premium ? 210 : 160;
  const total = Math.round((size * rate + 350) / 50) * 50;
  const thumb = (size - 3) / 15;

  const take = () => {
    if (!playing) return;
    setSize(size);
    setPremium(premium);
    setTouched(true);
  };

  return (
    <div className="flex h-full flex-col rounded-md border border-line bg-raised p-4" onPointerDown={take}>
      <div className="flex items-center justify-between text-[12px] text-muted">
        <span>Teeth straightening estimate</span>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">Try it</span>
      </div>
      <label htmlFor="calc-size" className="mt-3 flex items-baseline justify-between text-[13px]">
        <span>Treatment length</span>
        <span className="font-semibold tabular-nums">{size} months</span>
      </label>
      <div className="relative">
        <input
          id="calc-size"
          type="range"
          min={3}
          max={18}
          step={1}
          value={size}
          onChange={(e) => {
            setTouched(true);
            setSize(Number(e.target.value));
          }}
          className="mt-1.5 w-full cursor-pointer accent-accent-bright"
        />
        {/* A fingertip riding the thumb while the demo plays */}
        {playing && a > 0 && a < 0.6 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-[40%] rounded-full bg-fg/15 ring-2 ring-fg/20"
            style={{ left: `calc(${thumb} * (100% - 16px) + 8px)` }}
          />
        )}
      </div>
      <div className="mt-3 flex gap-1 rounded-full bg-surface p-1 text-[12px]">
        {[
          ['Standard', false],
          ['Invisible aligners', true],
        ].map(([label, value]) => (
          <button
            key={String(label)}
            type="button"
            onClick={() => {
              setTouched(true);
              setSize(size);
              setPremium(value as boolean);
            }}
            aria-pressed={premium === value}
            className={`relative flex-1 cursor-pointer rounded-full px-3 py-1 transition-colors duration-300 ${premium === value ? 'bg-fg text-white' : 'text-muted hover:text-fg'}`}
          >
            {label as string}
            {playing && value === true && a >= 0.58 && a < 0.75 && (
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0.6, scale: 0.6 }}
                animate={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="absolute inset-0 m-auto h-6 w-6 rounded-full bg-fg/25"
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-auto flex items-end justify-between border-t border-line pt-3">
        <span className="text-[12px] text-muted">Estimated total</span>
        <span className="font-display text-[26px] font-semibold tabular-nums">€{total.toLocaleString('en-IE')}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Email */

const EMAILS = [
  { at: 0.08, from: 'Lumen Dental', time: 'now', title: 'Your appointment is confirmed', body: 'Thu 10:30 · Check-up & clean · Add to calendar' },
  { at: 0.38, from: 'Booking system', time: 'now', title: 'New booking: Sarah Byrne', body: 'Thu 10:30 · added to your calendar' },
  { at: 0.68, from: 'Lumen Dental', time: 'Wed 10:30', title: 'Reminder: see you tomorrow', body: 'Sent automatically 24h before' },
];

/**
 * Desktop: the confirmation and reminder land once the module goes live.
 * Phones (`progress` = 0..1): each email arrives as you scroll, newest on top like a lock screen.
 */
function EmailModule({ progress }: { progress?: number }) {
  if (progress !== undefined) {
    const arrived = EMAILS.filter((m) => progress >= m.at).reverse();
    return (
      <div className="flex h-full flex-col gap-2 overflow-hidden rounded-md bg-raised p-2.5">
        <AnimatePresence initial={false}>
          {arrived.map((m) => (
            <motion.div
              key={m.title}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="rounded-sm bg-surface p-3 shadow-card"
            >
              <div className="flex items-center justify-between text-[10px] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
                  {m.from}
                </span>
                <span>{m.time}</span>
              </div>
              <div className="mt-1 text-[12px] font-semibold">{m.title}</div>
              <div className="mt-0.5 text-[11px] text-muted">{m.body}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {arrived.length === 0 && <div className="m-auto text-[12px] text-subtle">Inbox</div>}
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden rounded-md bg-raised p-2.5">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
        className="rounded-sm bg-surface p-3 shadow-card"
      >
        <div className="flex items-center justify-between text-[10px] text-muted">
          <span>Lumen Dental</span>
          <span>now</span>
        </div>
        <div className="mt-1 text-[12px] font-semibold">Your appointment is confirmed</div>
        <div className="mt-0.5 text-[11px] text-muted">Thu 10:30 · Check-up & clean · Add to calendar</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.5 }}
        className="mt-2 flex items-center gap-2 rounded-sm bg-surface/80 px-3 py-2 text-[11px] text-muted shadow-xs"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
        Reminder scheduled · 24h before
      </motion.div>
    </div>
  );
}
