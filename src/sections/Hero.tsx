import { useRef } from 'react';
import { useRange } from '../lib/motion';
import { motion, useScroll } from 'motion/react';
import { Headline } from '../components/Reveal';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/content';

/**
 * Pinned hero. Beat 1: the promise in one line, one button, and the particle logo large (the page's one big moment). Beat 2: the logo turns on the left while the problem lands on the right.
 * The particles then scatter into the field behind the next chapter.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const introOpacity = useRange(scrollYProgress, [0, 0.2], [1, 0]);
  const introY = useRange(scrollYProgress, [0, 0.2], [0, -48]);
  const lineOpacity = useRange(scrollYProgress, [0.24, 0.34, 0.76, 0.86], [0, 1, 1, 0]);
  const lineY = useRange(scrollYProgress, [0.24, 0.34, 0.76, 0.86], [24, 0, 0, -24]);
  const cueOpacity = useRange(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative h-[210vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Soft scrim so type stays crisp over the particles */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[64%] h-[70vh] w-[120vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-ink)_75%,transparent),transparent)]"
        />

        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pt-[9svh] text-center sm:pt-[10svh]"
        >
          {/* The one big moment: the particle logo assembles large in this slot, above a single line and a single button */}
          <div id="hero-logo-slot" aria-hidden="true" className="h-[38svh] w-full sm:h-[44svh] lg:h-[50svh]" />

          {/* Intro copy rises in with CSS, so it plays from first paint even while scripts are still busy */}
          <Headline
            as="h1"
            trigger="mount"
            delay={0.1}
            text={[{ text: 'Websites that turn visitors' }, { text: 'into booked clients.', className: 'accent-serif text-accent' }]}
            className="display text-balance text-display-1"
          />

          <a
            href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-8 w-full animate-[hero-in_0.9s_var(--ease-out)_0.4s_both] sm:w-auto"
          >
            Get your free preview
          </a>
        </motion.div>

        {/* Beat 2: the logo glides into the left half (above on phones) while the problem lands beside it */}
        <div className="pointer-events-none absolute inset-0 z-10 mx-auto grid max-w-6xl grid-rows-[auto_1fr] gutter pt-[12svh] lg:grid-cols-2 lg:grid-rows-1 lg:items-center lg:gap-12 lg:pt-0">
          <div id="hero-beat-slot" aria-hidden="true" className="h-[30svh] lg:h-[56svh]" />
          <motion.div style={{ opacity: lineOpacity, y: lineY }} className="mt-6 text-center lg:mt-0 lg:text-left">
            <h2 className="display text-balance text-display-2">A contact form loses clients.</h2>
            <p className="mx-auto mt-5 max-w-[34rem] text-pretty text-lead text-muted lg:mx-0">
              Long forms, phones that ring out, and requests lost in an inbox. We build the site and the system behind it: every
              booking request lands in one place for your team, and each client gets their own page.
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
