import { useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';
import { Footer } from './Footer';

/**
 * Hard reveal: the footer waits, fully drawn, underneath the page, and the page slides up off it
 * like a panel opening. No fade: whatever is uncovered is already solid.
 *
 * The wrapper holds the footer's place in the page and clips the footer to it. Inside, the footer
 * moves up at half the page's speed while it is uncovered, then sits in its normal place: the
 * page appears to slide off it, and its top is never left hidden, however tall it is.
 */
// 0 = footer scrolls with the page, 1 = it stays still while uncovered
const PARALLAX = 0.5;

export function FooterReveal() {
  const wrap = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const { scrollY } = useScroll();

  const place = () => {
    const el = wrap.current;
    if (!el) return;
    // Where the footer's top ends up once fully in view: the top of the screen for a tall footer,
    // or wherever the page ends for one that fits
    const rest = Math.max(0, window.innerHeight - el.offsetHeight);
    // While the page lifts off it, the footer rises at half the page's speed: it starts half a
    // gap higher (under the page) and catches up exactly as it lands, so its top is always in
    // full view by the time the reveal ends
    y.set(-Math.max(0, el.getBoundingClientRect().top - rest) * PARALLAX);
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
