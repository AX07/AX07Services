import type { AnchorHTMLAttributes, ReactNode } from 'react';

/** A bento tile that is mostly the work itself: the looping media fills it, with the name and result over the bottom edge. */
export function WorkTile({
  kind,
  title,
  stat,
  art,
  className = '',
  ...link
}: { kind: string; title: string; stat: string; art: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...link}
      aria-label={`${title}: ${kind}, ${stat}`}
      className={`group relative block overflow-hidden rounded-[clamp(16px,2vw,28px)] border-4 border-surface bg-night shadow-[var(--shadow-card)] ${className}`}
    >
      {art}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 grid bg-gradient-to-t from-black/85 to-transparent px-3 pb-2.5 pt-10 text-white md:px-4 md:pb-3">
        <span className="hidden text-[11px] opacity-75 md:block">{kind}</span>
        <span className="display text-[15px] leading-tight md:text-[20px]">{title}</span>
        <span className="truncate text-[11px] text-emerald-300 md:text-[13px]">{stat}</span>
      </span>
    </a>
  );
}
