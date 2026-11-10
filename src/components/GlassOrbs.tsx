/**
 * Big, soft clusters of particle dots behind a section's glass panels, in the same ink as the 3D
 * field with only a faint hint of green. Glass needs something behind it to frost: these give it
 * texture without bringing new colours onto the page. Decorative only; the parent needs
 * `relative isolate`.
 */
const LAYOUTS = {
  pair: [
    { className: '-left-[6%] top-[30%] h-[min(30rem,80vw)] w-[min(30rem,80vw)]', delay: '0s' },
    { className: 'right-[0%] top-[52%] h-[min(24rem,66vw)] w-[min(24rem,66vw)]', delay: '-7s' },
  ],
  spread: [
    { className: 'right-[4%] top-[16%] h-[min(28rem,76vw)] w-[min(28rem,76vw)]', delay: '-3s' },
    { className: '-left-[4%] bottom-[4%] h-[min(22rem,62vw)] w-[min(22rem,62vw)]', delay: '-10s' },
  ],
} as const;

export function GlassOrbs({ layout = 'pair', className = '' }: { layout?: keyof typeof LAYOUTS; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {LAYOUTS[layout].map((o, i) => (
        <span
          key={i}
          style={{ animationDelay: o.delay }}
          className={`particle-orb absolute animate-[orb-drift_18s_var(--ease-in-out)_infinite_alternate] ${o.className}`}
        />
      ))}
    </div>
  );
}
