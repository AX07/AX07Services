/**
 * Where a pinned section is: one segment per step, filled as the scroll plays them, and a hint to keep scrolling.
 * `active` is -1 before the first step.
 */
export function StepBar({ steps, active, className = '' }: { steps: number; active: number; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-label={`Step ${active + 1} of ${steps}`}>
      <div className="flex gap-1.5">
        {Array.from({ length: steps }, (_, i) => (
          <span key={i} className="h-1 w-8 overflow-hidden rounded-full bg-line-strong sm:w-10">
            <span
              className={`block h-full origin-left rounded-full bg-accent-bright transition-transform duration-500 ease-out ${i <= active ? 'scale-x-100' : 'scale-x-0'}`}
            />
          </span>
        ))}
      </div>
      <span className="text-[12px] tabular-nums text-subtle">{active >= steps - 1 ? 'Scroll to continue' : `${active + 1}/${steps} · scroll`}</span>
    </div>
  );
}
