/**
 * Moments a section wants the progress rail to mark: the rail answers with a pulse at its head in
 * the moment's colour, and a short caption beside it. Sections fire these as their own story
 * unfolds (a page finishing loading, a step being reached), so the rail reads like a live log.
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
