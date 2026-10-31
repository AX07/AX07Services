import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';

/**
 * Renders a full-size page (at `virtualWidth` px) scaled down to fit its frame.
 *
 * Without `progress` it plays like a screen recording: hold at the top, glide down the page,
 * pause, jump back, repeat (a CSS animation on the compositor; off under reduced motion).
 * With `progress` (0..1) the page scrolls in step with the visitor's own scroll instead, with a
 * slim scrollbar so it reads as a real phone being scrolled.
 */
export function AutoScrollFrame({
  virtualWidth,
  progress,
  children,
}: {
  virtualWidth: number;
  progress?: MotionValue<number>;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [travel, setTravel] = useState(0);

  const fallback = useMotionValue(0);
  const source = progress ?? fallback;
  const travelMV = useMotionValue(0);
  const y = useTransform(() => -source.get() * travelMV.get());
  const thumbY = useTransform(source, [0, 1], ['0%', '300%']);

  useEffect(() => travelMV.set(travel), [travel, travelMV]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const page = pageRef.current;
    if (!frame || !page) return;
    const measure = () => {
      const s = frame.clientWidth / virtualWidth;
      setScale(s);
      setTravel(Math.max(0, Math.round(page.offsetHeight * s - frame.clientHeight)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    ro.observe(page);
    return () => ro.disconnect();
  }, [virtualWidth]);

  const page = (
    <div
      ref={pageRef}
      style={{ width: virtualWidth, transform: `scale(${scale})`, transformOrigin: 'top left', opacity: scale ? 1 : 0 }}
    >
      {children}
    </div>
  );

  return (
    <div ref={frameRef} className="relative h-full w-full overflow-hidden">
      {progress ? (
        <>
          <motion.div style={{ y }}>{page}</motion.div>
          {/* Scrollbar: a quarter-height thumb travelling down the right edge */}
          <div aria-hidden="true" className="absolute inset-y-2 right-1 w-[3px]">
            <motion.div style={{ y: thumbY }} className="h-1/4 w-full rounded-full bg-black/35" />
          </div>
        </>
      ) : (
        <div
          className={travel ? 'animate-[site-recording_13s_infinite]' : undefined}
          style={{ '--travel': `${travel}px` } as CSSProperties}
        >
          {page}
        </div>
      )}
    </div>
  );
}
