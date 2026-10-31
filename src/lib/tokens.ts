/**
 * Motion tokens for Framer Motion, mirroring the CSS ones in index.css.
 * Anything that animates in JS takes its curve and timing from here.
 */

/** Everything entering the screen (Emil Kowalski's ease-out) */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** Things already on screen moving to a new place */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export const DURATION = {
  fast: 0.16,
  base: 0.3,
  slow: 0.5,
  reveal: 0.9,
} as const;

/** Shared-layout indicators (nav pill, tabs, filters): one spring so they all feel related */
export const SPRING = { type: 'spring', duration: 0.5, bounce: 0.15 } as const;

/** Stagger between siblings in a revealed group */
export const STAGGER = 0.08;
