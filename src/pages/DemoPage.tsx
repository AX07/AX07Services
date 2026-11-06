import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'motion/react';
import { EASE_OUT } from '../components/Reveal';
import { linkProps } from '../lib/router';
import { SPRING } from '../lib/tokens';
import { ensureAbsoluteUrl, getClientBySlug } from '../lib/clients';

/**
 * Client preview: the staging site fills the screen under a floating ax07 bar with an
 * "Approve & launch" button. `?url=` overrides the target, so shared links work on any device.
 */
export function DemoPage({ slug }: { slug: string }) {
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(true);
  // Opened by a tap: stays until the visitor picks something or closes it
  const [pinned, setPinned] = useState(false);
  const [arrived, setArrived] = useState(false);
  // While the bubble is dragged the frame ignores the pointer, or it would swallow the moves
  const [dragging, setDragging] = useState(false);
  const timer = useRef(0);
  const bounds = useRef<HTMLDivElement>(null);
  // The bubble keeps the spot it was dragged to each time it comes back
  const bubbleX = useMotionValue(0);
  const bubbleY = useMotionValue(0);

  // Collapse after `ms`; any later show/hide replaces the pending one
  const hideSoon = useCallback((ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setExpanded(false), ms);
  }, []);
  const show = useCallback(
    (forMs?: number, pin = false) => {
      window.clearTimeout(timer.current);
      setExpanded(true);
      if (pin) setPinned(true);
      if (forMs) hideSoon(forMs);
    },
    [hideSoon],
  );
  const collapse = useCallback(() => {
    window.clearTimeout(timer.current);
    setPinned(false);
    setExpanded(false);
  }, []);

  useEffect(() => {
    hideSoon(3000);
    const t = window.setTimeout(() => setArrived(true), 1000);
    // Tapping into the site moves focus into the frame: an open bar gets out of the way
    const onBlur = () => window.setTimeout(() => document.activeElement?.tagName === 'IFRAME' && collapse(), 0);
    window.addEventListener('blur', onBlur);
    return () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(t);
      window.removeEventListener('blur', onBlur);
    };
  }, [hideSoon, collapse]);

  const client = useMemo(() => {
    const override = new URLSearchParams(window.location.search).get('url');
    const found = getClientBySlug(slug);
    const name = found?.name ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const url = override ? ensureAbsoluteUrl(override) : ensureAbsoluteUrl(found?.stagingUrl || `https://${slug}.vercel.app`);
    const phone = (found?.whatsappNumber || '+353894419127').replace(/[^0-9]/g, '');
    return { name, url, phone };
  }, [slug]);

  const host = client.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const approve = `https://wa.me/${client.phone}?text=${encodeURIComponent(
    `Hi Alex, I've reviewed the preview for ${client.name} at ax07.dev/demo/${slug} and I'd like to talk about launching it.`,
  )}`;

  return (
    <div className="fixed inset-0 bg-night">
      {/* Fallback underneath: shown if the site refuses to be framed or is still loading */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="max-w-sm text-center text-white">
          {!loaded && <div className="mx-auto mb-5 h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-white" />}
          <h1 className="font-display text-title font-semibold">{client.name}</h1>
          <p className="mt-2 text-[14px] text-white/55">If the preview doesn’t appear, open it directly.</p>
          <a href={client.url} target="_blank" rel="noopener noreferrer" className="btn btn-light mt-5">
            Open {host} ↗
          </a>
        </div>
      </div>

      <iframe
        src={client.url}
        title={`${client.name} preview`}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full border-0 ${dragging ? 'pointer-events-none' : ''}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />

      {/* Arrival: the full bar shows for 3s, then shrinks into a small bubble so the site has the whole
          screen. The bubble can be dragged anywhere, clear of the site's own menu and booking bar;
          tapping it brings the bar back until the visitor picks an action or closes it. */}
      <div ref={bounds} className="pointer-events-none fixed inset-0 z-10">
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="bar"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: arrived ? 0 : 0.3 } }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
              className="absolute inset-x-0 top-3 flex justify-center px-3 sm:top-4 sm:px-4"
            >
              <header
                onMouseEnter={() => show()}
                onMouseLeave={() => !pinned && hideSoon(1200)}
                className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-full border border-white/15 bg-night/85 py-1.5 pl-3 pr-1.5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:pl-4"
              >
                <a {...linkProps('/')} aria-label="Back to ax07.dev" className="flex shrink-0 items-center gap-2 py-1 text-[13px] font-medium text-white/80 hover:text-white">
                  <span aria-hidden="true">←</span>
                  <img src="/logo-mark.png" alt="" width={18} height={18} className="h-[18px] w-[18px] invert" />
                  <span className="hidden font-display sm:inline">ax07</span>
                </a>

                <div className="flex min-w-0 flex-1 items-center gap-2 text-[12px] text-white/70 sm:text-[13px]">
                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent-bright" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Preview for </span>
                    <strong className="font-medium text-white">{client.name}</strong>
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/80 hover:bg-white/10 hover:text-white sm:inline-block"
                  >
                    New tab ↗
                  </a>
                  <a href={approve} target="_blank" rel="noopener noreferrer" className="btn btn-light !min-h-0 !px-3.5 !py-1.5 !text-[12px] font-semibold sm:!px-4 sm:!text-[13px]">
                    Approve & launch
                  </a>
                  <button
                    type="button"
                    onClick={collapse}
                    aria-label="Hide the preview bar"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
              </header>
            </motion.div>
          ) : (
            <motion.button
              key="bubble"
              type="button"
              drag
              dragConstraints={bounds}
              dragMomentum={false}
              dragElastic={0.08}
              onPointerDown={() => {
                // From the first press, so a quick flick can't land its moves in the frame
                setDragging(true);
                window.addEventListener('pointerup', () => setDragging(false), { once: true });
              }}
              onTap={() => show(undefined, true)}
              aria-label={`Show the preview options for ${client.name}`}
              style={{ x: bubbleX, y: bubbleY }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1, transition: { ...SPRING, delay: 0.15 } }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.92 }}
              className="pointer-events-auto absolute bottom-24 left-3 flex h-11 w-11 cursor-pointer touch-none items-center justify-center rounded-full border border-white/20 bg-night/80 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:bottom-5 sm:left-5"
            >
              <img src="/logo-mark.png" alt="" width={18} height={18} draggable={false} className="h-[18px] w-[18px] invert" />
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full border border-night bg-accent-bright" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
