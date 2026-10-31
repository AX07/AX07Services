import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  const timer = useRef(0);

  // Collapse after `ms`; any later show/hide replaces the pending one
  const hideSoon = useCallback((ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setExpanded(false), ms);
  }, []);
  const show = useCallback(
    (forMs?: number) => {
      window.clearTimeout(timer.current);
      setExpanded(true);
      if (forMs) hideSoon(forMs);
    },
    [hideSoon],
  );

  useEffect(() => {
    hideSoon(3000);
    return () => window.clearTimeout(timer.current);
  }, [hideSoon]);

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
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />

      {/* Floating bar: fully shown on arrival, then after 3s it glides into a small back-to-ax07 pill
          in the bottom-left corner (clear of the site's own logo and menu) so the site has the whole
          screen. Hover, or the dots, brings the full bar back. */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.3 }}
        className={`pointer-events-none fixed inset-x-0 z-10 flex px-3 sm:px-4 ${
          expanded ? 'top-3 justify-center sm:top-4' : 'bottom-3 justify-start sm:bottom-4'
        }`}
      >
        <motion.header
          layout
          transition={SPRING}
          onMouseEnter={() => show()}
          onMouseLeave={() => hideSoon(1200)}
          style={{ borderRadius: 999 }}
          className={`pointer-events-auto flex items-center gap-2 border border-white/15 bg-night/85 py-1.5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl ${
            expanded ? 'w-full max-w-5xl justify-between pl-3 pr-1.5 sm:pl-4' : 'pl-3 pr-1.5'
          }`}
        >
          <motion.a layout="position" {...linkProps('/')} aria-label="Back to ax07.dev" className="flex shrink-0 items-center gap-2 py-1 text-[13px] font-medium text-white/80 hover:text-white">
            <span aria-hidden="true">←</span>
            <img src="/logo-mark.png" alt="" width={18} height={18} className="h-[18px] w-[18px] invert" />
            {expanded && <span className="hidden font-display sm:inline">ax07</span>}
          </motion.a>

          <AnimatePresence initial={false} mode="popLayout">
            {expanded ? (
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="flex min-w-0 flex-1 items-center justify-between gap-2"
              >
                <div className="flex min-w-0 items-center gap-2 text-[12px] text-white/70 sm:text-[13px]">
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
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="mini"
                type="button"
                onClick={() => show(4000)}
                aria-label="Show the preview bar"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.3 } }}
                exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <circle cx="3" cy="8" r="1.4" />
                  <circle cx="8" cy="8" r="1.4" />
                  <circle cx="13" cy="8" r="1.4" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.header>
      </motion.div>
    </div>
  );
}
