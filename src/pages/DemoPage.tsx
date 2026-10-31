import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { EASE_OUT } from '../components/Reveal';
import { linkProps } from '../lib/router';
import { ensureAbsoluteUrl, getClientBySlug } from '../lib/clients';

/**
 * Client preview: the staging site fills the screen under a floating ax07 bar with an
 * "Approve & launch" button. `?url=` overrides the target, so shared links work on any device.
 */
export function DemoPage({ slug }: { slug: string }) {
  const [loaded, setLoaded] = useState(false);

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
          <a href={client.url} target="_blank" rel="noopener noreferrer" className="btn mt-5 bg-white text-fg hover:bg-white/90">
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

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.3 }}
        className="fixed left-1/2 top-3 z-10 w-[min(96vw,64rem)] -translate-x-1/2 sm:top-4"
      >
        <div className="flex items-center justify-between gap-2 rounded-full border border-white/15 bg-night/85 py-1.5 pl-3 pr-1.5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:pl-4">
          <a {...linkProps('/')} className="flex shrink-0 items-center gap-2 text-[13px] font-medium text-white/80 hover:text-white">
            <span aria-hidden="true">←</span>
            <img src="/logo-mark.png" alt="" width={18} height={18} className="h-[18px] w-[18px] invert" />
            <span className="hidden font-display sm:inline">ax07</span>
          </a>

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
            <a href={approve} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-fg hover:bg-white/90 sm:px-4 sm:text-[13px]">
              Approve & launch
            </a>
          </div>
        </div>
      </motion.header>
    </div>
  );
}
