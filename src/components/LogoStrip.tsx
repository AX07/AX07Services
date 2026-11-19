// Logos from Simple Icons (simpleicons.org, CC0), one exact version; each logo belongs to its brand
const LOGO = (slug: string) => `https://cdn.jsdelivr.net/npm/simple-icons@16.38.0/icons/${slug}.svg`;

/**
 * A slow, endless strip of logos with names under a small label (two copies of the list, so the loop has no seam).
 * Pauses on hover; with reduced motion it's a still, wrapped row.
 */
export function LogoStrip({ label, items, className = '' }: { label: string; items: readonly { name: string; slug: string }[]; className?: string }) {
  return (
    <div className={`group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] ${className}`}>
      <p className="mb-4 text-center text-[13px] text-subtle">{label}</p>
      <ul className="flex w-max animate-[tech-marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-6">
        {[...items, ...items].map((t, i) => (
          <li
            key={`${t.slug}-${i}`}
            aria-hidden={i >= items.length || undefined}
            className={`flex shrink-0 items-center gap-2.5 pr-10 text-fg/70 motion-reduce:pr-0 ${i >= items.length ? 'motion-reduce:hidden' : ''}`}
          >
            {t.slug ? (
              <img src={LOGO(t.slug)} alt="" width={22} height={22} loading="lazy" decoding="async" className="h-[22px] w-[22px] opacity-70 dark:invert" />
            ) : (
              // No logo available: a plain four-point sparkle in the text colour
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[20px] w-[20px] fill-current opacity-70">
                <path d="M12 2c.6 4.6 2.4 7.4 10 10-7.6 2.6-9.4 5.4-10 10-.6-4.6-2.4-7.4-10-10 7.6-2.6 9.4-5.4 10-10z" />
              </svg>
            )}
            <span className="whitespace-nowrap text-[15px] font-medium">{t.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
