import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * A client site's screen recording (public/work/reels/<id>.mp4), silent and looping. It loads and plays only
 * while it's on screen; with reduced motion it stays the still screenshot.
 */
export function ReelVideo({ id, shot, title, className = '' }: { id: string; shot: string; title: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.01, rootMargin: "0px 300px" });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <video
      ref={ref}
      src={reduce ? undefined : `/work/reels/${id}.mp4`}
      poster={`${shot}-1280.webp`}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={`${title} website, scrolling`}
      className={`h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] ${className}`}
    />
  );
}
