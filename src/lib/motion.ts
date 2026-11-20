import { useEffect, useState } from 'react';
import { transform, useTransform, type MotionValue } from 'motion/react';

/**
 * Scroll-linked mapping that always runs on the JS frame loop.
 * Motion hardware-accelerates plain `useTransform(value, input, output)` for opacity using
 * native ScrollTimeline, which mis-reads the range on pinned (sticky) sections; a function
 * mapping opts out of that and stays exact.
 */
export function useRange<T extends number | string>(value: MotionValue<number>, input: number[], output: T[]) {
  return useTransform(value, (v) => transform(v, input, output));
}

/** True on screens at least `px` wide (where the pinned, scroll-stepped sections run), and it follows resizes. */
export function useMinWidth(px: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const set = () => setOn(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, [px]);
  return on;
}
