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
