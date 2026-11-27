import { useReducedMotion } from 'motion/react';

/** A silent decorative loop filling its tile; with reduced motion only the poster shows. */
export function LoopVideo({ src, poster }: { src: string; poster: string }) {
  const reduce = useReducedMotion();
  return <video src={reduce ? undefined : src} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />;
}
