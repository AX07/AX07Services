import { useRef } from 'react';
import { useRange } from '../lib/motion';
import { motion, useScroll } from 'motion/react';
import { EASE_OUT, Headline } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/content';
import { scrollToId } from '../lib/smooth-scroll';

/**
 * Pinned hero. Beat 1: the promise. Beat 2: the logo turns while one line lands.
 * The particles then scatter into the field behind the next chapter.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const introOpacity = useRange(scrollYProgress, [0, 0.2], [1, 0]);
  const introY = useRange(scrollYProgress, [0, 0.2], [0, -48]);
  const lineOpacity = useRange(scrollYProgress, [0.28, 0.38, 0.56, 0.66], [0, 1, 1, 0]);
  const lineY = useRange(scrollYProgress, [0.28, 0.38, 0.56, 0.66], [24, 0, 0, -24]);
  const cueOpacity = useRange(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative h-[260vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Soft scrim so type stays crisp over the particles */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[64%] h-[70vh] w-[120vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(251,251,253,0.92),rgba(251,251,253,0))]"
        />

        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pt-[9svh] text-center sm:pt-[10svh]"
        >
          {/* The particle logo assembles in this slot, above the headline */}
          <div id="hero-logo-slot" aria-hidden="true" className="h-[26svh] w-full sm:h-[28svh] lg:h-[30svh]" />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="eyebrow mb-4 sm:mb-6"
          >
            Independent web studio · Ireland & the Algarve
          </motion.p>

          <Headline
            as="h1"
            trigger="mount"
            delay={0.1}
            text={[{ text: 'Slow websites kill businesses.' }, { text: 'We kill the lag.', className: 'accent-serif text-accent' }]}
            className="display text-balance text-display-1"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.55 }}
            className="mt-5 max-w-[30rem] text-pretty text-lead text-muted"
          >
            Custom websites that load in under a second and turn visitors into bookings.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.7 }}
            className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <a
              href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full sm:w-auto"
            >
              Get your free 48h preview
            </a>
            <button type="button" onClick={() => scrollToId('work')} className="btn btn-quiet hidden sm:inline-flex">
              See the work
            </button>
          </motion.div>
        </motion.div>

        {/* Beat 2: lands while the logo turns */}
        <motion.p
          style={{ opacity: lineOpacity, y: lineY }}
          className="display pointer-events-none absolute inset-x-0 bottom-[12svh] z-10 mx-auto max-w-3xl px-6 text-center text-[28px] text-balance sm:text-[40px]"
        >
          Every second of lag costs you customers. <span className="text-muted">So we built a studio around speed.</span>
        </motion.p>

        {/* Scroll cue: the hero only ever asks for one thing */}
        <motion.div
          style={{ opacity: cueOpacity }}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-7 z-10 hidden flex-col items-center gap-3 text-[12px] tracking-[0.18em] text-subtle uppercase lg:flex [@media(max-height:820px)]:!hidden"
        >
          <span>Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_1.8s_var(--ease-in-out)_infinite] bg-fg/70" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
