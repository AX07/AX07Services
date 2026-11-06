/**
 * Story moments: sections fire these as their own story unfolds (a page finishing loading, a
 * visitor giving up, a step being reached, a new site in the showcase) and the 3D field answers
 * each with a ripple in the moment's colour, so the whole page moves to one beat.
 */
export type RailTone = 'accent' | 'danger' | 'warn';

export interface RailPulse {
  tone?: RailTone;
  /** 'lg' for turning points (a new chapter's view, a result), 'sm' for beats along the way */
  size?: 'sm' | 'lg';
  label?: string;
}

const listeners = new Set<(pulse: RailPulse) => void>();

export function railPulse(pulse: RailPulse) {
  listeners.forEach((fn) => fn(pulse));
}

export function onRailPulse(fn: (pulse: RailPulse) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Fire `pulse` when `value` crosses `threshold` going forwards (scrolling down), never backwards. */
export function crossedForward(prev: number, next: number, threshold: number) {
  return prev < threshold && next >= threshold;
}
