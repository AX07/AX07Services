import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Renders a full-size page (at `virtualWidth` px) scaled down to fit its frame, then plays it
 * like a screen recording: hold at the top, glide down the page, pause, jump back, repeat.
 * The loop is a CSS animation (compositor thread; switched off by the reduced-motion rule).
 */
export function AutoScrollFrame({ virtualWidth, children }: { virtualWidth: number; children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [travel, setTravel] = useState(0);

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

  return (
    <div ref={frameRef} className="relative h-full w-full overflow-hidden">
      <div
        className={travel ? 'animate-[site-recording_13s_infinite]' : undefined}
        style={{ '--travel': `${travel}px` } as CSSProperties}
      >
        <div
          ref={pageRef}
          style={{ width: virtualWidth, transform: `scale(${scale})`, transformOrigin: 'top left', opacity: scale ? 1 : 0 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
