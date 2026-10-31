import { useRef } from 'react';
import { useRange } from '../lib/motion';
import { motion, useScroll } from 'motion/react';
import { Headline } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/content';
import { scrollToId } from '../lib/smooth-scroll';

/**
 * Pinned hero. Beat 1: the promise. Beat 2: the logo turns on the left while the problem lands on the right.
 * The particles then scatter into the field behind the next chapter.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const introOpacity = useRange(scrollYProgress, [0, 0.2], [1, 0]);
  const introY = useRange(scrollYProgress, [0, 0.2], [0, -48]);
  const lineOpacity = useRange(scrollYProgress, [0.24, 0.34, 0.62, 0.72], [0, 1, 1, 0]);
  const lineY = useRange(scrollYProgress, [0.24, 0.34, 0.62, 0.72], [24, 0, 0, -24]);
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

          {/* Intro copy rises in with CSS, so it plays from first paint even while scripts are still busy */}
          <p className="eyebrow mb-4 animate-[hero-in_0.8s_var(--ease-out)_both] sm:mb-6">Independent web studio · Ireland & the Algarve</p>

          <Headline
            as="h1"
            trigger="mount"
            delay={0.1}
            text={[{ text: 'We build custom web experiences' }, { text: 'that convert.', className: 'accent-serif text-accent' }]}
            className="display text-balance text-display-1"
          />

          <p className="mt-5 max-w-[36rem] animate-[hero-in_0.9s_var(--ease-out)_0.35s_both] text-pretty text-lead text-muted">
            Interactive 3D visuals, sub-second edge performance, and direct 1-click WhatsApp booking systems crafted for Irish
            business owners.
          </p>

          <div className="mt-8 flex w-full animate-[hero-in_0.9s_var(--ease-out)_0.5s_both] flex-col items-center gap-3 sm:w-auto sm:flex-row">
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
          </div>
        </motion.div>

        {/* Beat 2: the logo glides into the left half (above on phones) while the problem lands beside it */}
        <div className="pointer-events-none absolute inset-0 z-10 mx-auto grid max-w-6xl grid-rows-[auto_1fr] gutter pt-[12svh] lg:grid-cols-2 lg:grid-rows-1 lg:items-center lg:gap-12 lg:pt-0">
          <div id="hero-beat-slot" aria-hidden="true" className="h-[30svh] lg:h-[56svh]" />
          <motion.div style={{ opacity: lineOpacity, y: lineY }} className="mt-6 text-center lg:mt-0 lg:text-left">
            <h2 className="display text-balance text-display-2">A standard site is invisible.</h2>
            <p className="mx-auto mt-5 max-w-[34rem] text-pretty text-lead text-muted lg:mx-0">
              Most local businesses rely on generic templates, slow loads, and confusing forms. When high-value clients search on
              their phones, every extra second of loading sends them to a competitor.
            </p>
          </motion.div>
        </div>

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
