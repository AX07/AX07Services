import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const PHONE = '(max-width: 767px)';
// These were re-recorded in English under a new name, so cached copies of the old ones aren't reused
const ENGLISH = ['digital-dentistry', 'albania', 'la-kafeteria', 'la-pantera-rosa'];

/** True on phone-width screens, right from the first render (so only one recording is ever requested). */
function usePhone() {
  const [phone, setPhone] = useState(() => window.matchMedia(PHONE).matches);
  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const set = () => setPhone(mq.matches);
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return phone;
}

/**
 * A site's screen recording, silent and looping: the phone recording (public/work/reels/<id>-m.mp4) on phones, the
 * desktop one otherwise. It loads and plays only while on screen; with reduced motion it stays the still frame.
 */
export function ReelVideo({ id, shot, title, className = '' }: { id: string; shot?: string; title: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const phone = usePhone();
  // The real estate showcase has no desktop reel of its own: it reuses the one on /realestate
  const wide = id === 'realestate' ? '/realestate/media/hero-beach' : `/work/reels/${id}${ENGLISH.includes(id) ? '-en' : ''}`;
  const src = phone ? `/work/reels/${id}-m.mp4` : `${wide}.mp4`;
  const poster = phone ? `/work/reels/${id}-m.jpg` : shot ? `${shot}-1280.webp` : `${wide}.jpg`;

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.01, rootMargin: '0px 300px' });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, src]);

  return (
    <video
      ref={ref}
      src={reduce ? undefined : src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={`${title} website, scrolling`}
      className={`h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] ${className}`}
    />
  );
}
