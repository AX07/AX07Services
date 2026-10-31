const FADES = {
  // Page tops: full strength at the top, melting into the page below
  bottom: '[mask-image:linear-gradient(to_bottom,black_55%,transparent)]',
  // Mid-page sections: melts in and out at both edges so there are no hard seams
  both: '[mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]',
};

/**
 * Silver glass waves behind the top of a page or section. Purely decorative: it sits behind the
 * content (the parent needs `relative isolate`) and fades into the page colour at the bottom.
 */
export function WaveBackdrop({
  className = 'top-0 h-[min(100svh,880px)]',
  fade = 'bottom',
  eager = false,
}: {
  className?: string;
  fade?: keyof typeof FADES;
  eager?: boolean;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 -z-10 overflow-hidden ${FADES[fade]} ${className}`}>
      <img
        src="/bg/waves-1376.webp"
        srcSet="/bg/waves-768.webp 768w, /bg/waves-1376.webp 1376w, /bg/waves-1920.webp 1920w"
        sizes="100vw"
        alt=""
        width={1376}
        height={768}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover opacity-80 dark:opacity-35 dark:invert dark:hue-rotate-180"
      />
    </div>
  );
}
