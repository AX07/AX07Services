import { useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';
import { Footer } from './Footer';

/**
 * Hard reveal: the footer waits, fully drawn, underneath the page, and the page slides up off it
 * like a panel opening. No fade: whatever is uncovered is already solid.
 *
 * The wrapper holds the footer's place in the page and clips the footer to it. Inside, the footer
 * is held still while it is being uncovered:
 *  - shorter than the screen: it stays pinned to the bottom of the screen until the page ends;
 *  - taller than the screen (phones): it stays pinned to the top while its top is uncovered, then
 *    scrolls up with the page so the rest of it can be read.
 */
export function FooterReveal() {
  const wrap = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const { scrollY } = useScroll();

  const place = () => {
    const el = wrap.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    // Where the footer rests on screen while it is uncovered: the bottom edge on the screen's bottom
    // when it fits, its top edge on the screen's top when it doesn't
    const rest = Math.max(0, window.innerHeight - el.offsetHeight);
    y.set(Math.max(0, top - rest) * -1);
  };

  useMotionValueEvent(scrollY, 'change', place);
  useLayoutEffect(() => {
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  });

  return (
    <div ref={wrap} className="relative z-10 overflow-hidden bg-ink [clip-path:inset(0)]">
      {/* The page's edge: a soft shadow along the top, as if the panel above lifts away */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.08),transparent)] dark:bg-[linear-gradient(to_bottom,rgb(0_0_0/0.5),transparent)]"
      />
      <motion.div style={{ y }} className="will-change-transform">
        <Footer />
      </motion.div>
    </div>
  );
}
