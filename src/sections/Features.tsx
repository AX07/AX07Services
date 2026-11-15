import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { EASE_OUT, Eyebrow } from '../components/Reveal';
import { whatsappLink } from '../lib/content';
import { railPulse } from '../lib/rail';
import { traces } from '../lib/scene-store';

/**
 * The tools we build into a site, assembled live as the visitor scrolls: a blank page gets its
 * layout, then each feature is written, compiled and switched on in place.
 */

// Scroll budget: scaffold, three modules, then the "and more" finale
const SCAFFOLD = 0.06;
const MODULE = 0.24;
const FINALE = SCAFFOLD + MODULE * 3;
// Within a module: the first 60% is code being written, the rest is the live feature
const BUILD = 0.6;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const MODULES = [
  {
    title: 'WhatsApp booking',
    body: 'A tap on your site opens a chat with the service already chosen. You reply in person, from your own phone.',
    code: `<WhatsAppBooking\n  business="Lumen Dental"\n  service={selected}\n  reply="in person" />`,
  },
  {
    title: 'Your booking dashboard',
    body: 'Every booking lands in one place: names, dates, services and who has paid. Nothing lost in a notebook or an inbox.',
    code: `<BookingDashboard\n  bookings={live}\n  payments="tracked"\n  notify="whatsapp" />`,
  },
  {
    title: 'A page for every client',
    body: 'Each client gets a private link with their appointment, payment status and a calendar invite, and can rebook in one tap.',
    code: `<ClientPage\n  link="private"\n  calendar="ics"\n  rebook="whatsapp" />`,
  },
] as const;

const EXTRAS = ['Quote calculators', 'Email reminders', 'Deposits & payments', 'Multi-language'];

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
  // The particle field traces the site's outline as it is built, closing the loop as it goes live
  traces.features = clamp01((progress - SCAFFOLD) / (FINALE - SCAFFOLD));
  const active = Math.min(3, Math.max(0, Math.floor((progress - SCAFFOLD) / MODULE)));
  const finale = clamp01((progress - FINALE) / (1 - FINALE));
  const slots = MODULES.map((_, i) => slotState(progress, i, compact));
  const built = slots.filter((s) => s.phase === 'live').length;

  // Story beats: the field ripples as each tool switches on (on phones, as each one comes into
  // view), and strongest once the site is complete. Steps back silently when scrolling up.
  const milestone = compact ? (progress > SCAFFOLD ? Math.min(3, active) + 1 : 0) : built + (finale >= 1 ? 1 : 0);
  const lastMilestone = useRef(0);
  useEffect(() => {
    if (milestone > lastMilestone.current && !reduce) {
      railPulse(
        milestone <= MODULES.length
          ? { tone: 'accent', size: 'sm', label: `${MODULES[milestone - 1].title} · live` }
          : { tone: 'accent', size: 'lg', label: 'Site complete' },
      );
    }
    lastMilestone.current = milestone;
  }, [milestone, reduce]);

  return (
    <section ref={ref} id="features" className="relative h-[340vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-5 pt-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14 lg:pt-12">
          {/* Left: what's being built */}
          <div>
            <Eyebrow index="04" className="mb-3 lg:mb-5">
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
                            done ? 'bg-accent-bright text-white' : isActive ? 'bg-fg text-on-fg' : 'bg-raised text-muted'
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
                            href={whatsappLink("Hi ax07, I'd like a booking system with a dashboard like this for my business. Can we talk?")}
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
          <div data-scene-target="features" className="card overflow-hidden !rounded-[22px]">
            <div className="flex items-center gap-2 border-b border-line bg-raised px-3 py-2">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-fg/15" />
                <span className="h-2 w-2 rounded-full bg-fg/15" />
                <span className="h-2 w-2 rounded-full bg-fg/15" />
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
                  <span className="rounded-full bg-fg px-2.5 py-1 text-[10px] font-medium text-on-fg">Book</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.1fr]">
                {MODULES.map((m, i) => (
                  <div
                    key={m.title}
                    className={`${i === Math.min(active, 2) ? '' : 'hidden'} lg:block ${i === 0 ? 'lg:row-span-2' : ''}`}
                    style={{ opacity: reduce ? 1 : clamp01((progress / SCAFFOLD) * 2 - i * 0.5) }}
                  >
                    <Slot state={slots[i]} code={m.code} className={i === 0 ? 'h-[300px] lg:h-full' : i === 1 ? 'h-[300px] lg:h-[262px]' : 'h-[300px] lg:h-[196px]'}>
                      {i === 0 && <ChatModule live={slots[i].live} />}
                      {i === 1 && <AdminModule live={slots[i].live} />}
                      {i === 2 && <ClientModule live={slots[i].live} compact={compact} />}
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
        ) : state.phase === 'empty' ? (
          // Not built yet: a faint, desaturated preview of the finished tool, so the page never
          // shows a placeholder, only something waiting to be switched on
          <motion.div
            key="ghost"
            inert
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="pointer-events-none h-full opacity-30 grayscale"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="build"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="flex h-full flex-col overflow-hidden rounded-md border border-dashed border-accent-bright/60 bg-night"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- WhatsApp */

const CHAT = [
  { from: 'them', text: 'Hi! Do you have a cleaning slot this Thursday?' },
  { from: 'biz', text: 'Hi Sarah 👋 Thursday has three openings:' },
  { from: 'slots', text: '' },
  { from: 'them', text: '10:30 please' },
  { from: 'done', text: 'Booked ✓ Thu 10:30 with Dr Byrne. Your booking: lumendental.ie/b/sarah' },
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
          <div className="text-[10px] opacity-75">online</div>
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

/* ---------------------------------------------------------------- Dashboard */

const BOOKINGS = [
  { at: 0.08, name: 'Sarah Byrne', service: 'Check-up & clean', when: 'Thu 10:30', status: 'Confirmed', paid: 'Paid' },
  { at: 0.36, name: 'Tom Walsh', service: 'Teeth whitening', when: 'Fri 14:00', status: 'Confirmed', paid: 'Deposit' },
  { at: 0.64, name: 'Aoife Kelly', service: 'Emergency visit', when: 'Today 16:15', status: 'New', paid: 'Unpaid' },
] as const;

/** The admin side: each booking made in WhatsApp drops in at the top as the visitor scrolls. */
function AdminModule({ live }: { live: number }) {
  const arrived = BOOKINGS.filter((b) => live >= b.at).reverse();
  const stats: [string, number][] = [
    ['Bookings', arrived.length],
    ['Confirmed', arrived.filter((b) => b.status === 'Confirmed').length],
    ['Paid', arrived.filter((b) => b.paid === 'Paid').length],
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-line bg-raised">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-fg text-[9px] font-semibold text-on-fg">LD</span>
          <span className="text-[12px] font-semibold">Bookings</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5 text-[10px] text-muted">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-bright" />
          Live
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 px-3 pt-2.5">
        {stats.map(([label, n]) => (
          <div key={label} className="rounded-sm bg-surface px-2.5 py-1.5">
            <div className="text-[10px] text-muted">{label}</div>
            <div className="font-display text-[18px] font-semibold leading-tight tabular-nums">{n}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden p-3">
        <AnimatePresence initial={false}>
          {arrived.map((b) => (
            <motion.div
              key={b.name}
              layout
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="relative flex items-center gap-2.5 overflow-hidden rounded-sm bg-surface px-2.5 py-2 shadow-xs"
            >
              {/* A new booking flashes green as it lands */}
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: EASE_OUT }}
                className="pointer-events-none absolute inset-0 bg-accent-soft"
              />
              <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-raised text-[10px] font-semibold">
                {b.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
              </span>
              <div className="relative min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold">{b.name}</div>
                <div className="truncate text-[10px] text-muted">
                  {b.service} · {b.when}
                </div>
              </div>
              <span
                className={`relative rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  b.status === 'New' ? 'bg-warn-soft text-warn' : 'bg-accent-soft text-accent'
                }`}
              >
                {b.status}
              </span>
              <span className="relative hidden w-12 text-right text-[10px] text-muted sm:block">{b.paid}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {arrived.length === 0 && <div className="m-auto text-[12px] text-subtle">Waiting for bookings</div>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Client page */

const CLIENT_STEPS = [
  { at: 0.1, label: 'Booked' },
  { at: 0.35, label: 'Confirmed' },
  { at: 0.6, label: 'Paid' },
  { at: 0.85, label: 'Reminder set' },
] as const;

/** The client's side: their private booking page, filling in as the booking moves along. */
function ClientModule({ live, compact }: { live: number; compact: boolean }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-line bg-raised">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-1.5 text-[10px] text-muted">
        <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" aria-hidden="true">
          <path d="M4.5 7V5.5a3.5 3.5 0 017 0V7M3.5 7h9v6.5h-9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        lumendental.ie/b/sarah
        <span className="ml-auto rounded-full bg-surface px-1.5 py-px text-[9px]">Private link</span>
      </div>
      <div className={`flex flex-1 gap-3 p-3 ${compact ? 'flex-col' : ''}`}>
        <div className="flex-1 rounded-sm bg-surface p-3 shadow-xs">
          <div className="text-[10px] text-muted">Hi Sarah, your appointment</div>
          <div className="mt-1 font-display text-[15px] font-semibold leading-tight">Check-up & clean</div>
          <div className="mt-0.5 text-[11px] text-muted">Thu 10:30 · Dr Byrne</div>
          <div className="mt-2.5 flex gap-1.5">
            <span className="rounded-full bg-fg px-2.5 py-1 text-[10px] font-medium text-on-fg">Add to calendar</span>
            <span className="rounded-full border border-line px-2.5 py-1 text-[10px]">Rebook</span>
          </div>
        </div>
        <ol className={`flex shrink-0 gap-x-3 gap-y-1.5 ${compact ? 'flex-wrap' : 'w-[38%] flex-col justify-center'}`}>
          {CLIENT_STEPS.map((st) => {
            const done = live >= st.at;
            return (
              <li key={st.label} className={`flex items-center gap-2 text-[11px] transition-colors duration-500 ${done ? 'text-fg' : 'text-subtle'}`}>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-500 ${
                    done ? 'bg-accent-bright text-white' : 'border border-line'
                  }`}
                >
                  {done && (
                    <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {st.label}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
