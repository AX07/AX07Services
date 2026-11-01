import { useEffect, useRef, useState } from 'react';
import { scrollToId } from '../lib/smooth-scroll';
import { usePath } from '../lib/router';
import { onRailPulse, railPulse, type RailPulse } from '../lib/rail';

/** Home page chapters, in page order. Missing ids (other pages) are simply skipped. */
const CHAPTERS = [
  { id: 'hero', label: 'Intro' },
  { id: 'lag', label: 'The cost of lag' },
  { id: 'showcase', label: 'Your industry' },
  { id: 'features', label: 'Built in' },
  { id: 'proof', label: 'Speed test' },
  { id: 'process', label: 'How it works' },
  { id: 'work', label: 'Work' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'Questions' },
  { id: 'final-cta', label: 'Start' },
];

// Rail geometry inside its SVG (px): a straight vertical line at X
const X = 24;
const PAD = 8;

const TONE_COLOR = {
  accent: 'var(--color-accent-bright)',
  danger: 'var(--color-danger)',
  warn: 'var(--color-warn)',
} as const;

interface Node {
  id: string;
  label: string;
  at: number; // 0..1 down the page
}

interface LivePulse extends RailPulse {
  id: number;
}

/**
 * A thin rail on the left edge tracking progress through the page. Chapter dots sit on it and
 * light up as they are passed. Sections also talk to it (lib/rail.ts): when something happens in
 * the story, such as a build finishing loading, a visitor giving up or a step being reached, the
 * head pulses in that moment's colour with a short caption. Dots are clickable.
 */
export function ProgressRail() {
  const path = usePath();
  const svgRef = useRef<SVGSVGElement>(null);
  const fillRef = useRef<SVGLineElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [active, setActive] = useState(-1);
  const [height, setHeight] = useState(0);
  const [pulses, setPulses] = useState<LivePulse[]>([]);
  const [caption, setCaption] = useState<LivePulse | null>(null);

  // Where each chapter starts, as a fraction of the scrollable page
  useEffect(() => {
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const found: Node[] = [];
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        found.push({ ...c, at: Math.min(1, Math.max(0, top / max)) });
      }
      setNodes((prev) =>
        prev.length === found.length && prev.every((n, i) => n.id === found[i].id && Math.abs(n.at - found[i].at) < 0.001)
          ? prev
          : found,
      );
      setHeight(svgRef.current?.clientHeight ?? 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [path]);

  // Pulses from the sections: rings at the head, plus the latest caption
  useEffect(() => {
    let id = 0;
    let captionTimer = 0;
    const off = onRailPulse((p) => {
      const pulse = { ...p, id: ++id };
      setPulses((list) => [...list.slice(-5), pulse]);
      window.setTimeout(() => setPulses((list) => list.filter((x) => x.id !== pulse.id)), 1400);
      if (p.label) {
        setCaption(pulse);
        window.clearTimeout(captionTimer);
        captionTimer = window.setTimeout(() => setCaption(null), 2200);
      }
    });
    return () => {
      off();
      window.clearTimeout(captionTimer);
    };
  }, []);

  // Head position follows scroll; written straight to the SVG, no React renders while scrolling
  useEffect(() => {
    let raf = 0;
    let shown = -2;
    let lastProgress = -1;
    const frame = () => {
      const svg = svgRef.current;
      if (svg) {
        const h = svg.clientHeight;
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, window.scrollY / max));
        if (progress !== lastProgress) {
          lastProgress = progress;
          const headY = PAD + (h - 2 * PAD) * progress;
          fillRef.current?.setAttribute('y2', String(headY));
          headRef.current?.setAttribute('transform', `translate(${X} ${headY})`);
          if (captionRef.current) captionRef.current.style.transform = `translateY(${headY}px)`;

          const nodeEls = svg.querySelectorAll<SVGGElement>('[data-at]');
          let current = -1;
          nodeEls.forEach((el, i) => {
            if (progress + 0.0005 >= Number(el.dataset.at)) current = i;
          });
          if (current !== shown) {
            const forward = shown >= -1 && current > shown;
            shown = current;
            setActive(current);
            // Arriving at the final chapter: the whole journey lands in one big pulse
            if (forward && current === nodeEls.length - 1 && current > 0) {
              railPulse({ tone: 'accent', size: 'lg', label: 'Let’s build yours' });
            }
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const y0 = PAD;
  const y1 = Math.max(y0, height - PAD);
  const latest = pulses[pulses.length - 1];

  return (
    // Decorative: the menu bar carries the same section links for assistive tech. On phones and
    // tablets the rail hugs the screen edge, clear of the content gutter.
    <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 z-40 w-12 py-[max(88px,12svh)] max-lg:-translate-x-[18px]">
      <svg ref={svgRef} className="h-full w-full overflow-visible" role="presentation">
        <line x1={X} x2={X} y1={y0} y2={y1} stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
        <line ref={fillRef} x1={X} x2={X} y1={y0} y2={y0} stroke="var(--color-accent-bright)" strokeWidth="2.5" strokeLinecap="round" />

        {nodes.map((n, i) => {
          const cy = y0 + (y1 - y0) * n.at;
          const passed = i <= active;
          const current = i === active;
          return (
            <g key={n.id} data-at={n.at} className="pointer-events-auto cursor-pointer" onClick={() => scrollToId(n.id)}>
              <title>{n.label}</title>
              <circle cx={X} cy={cy} r="12" fill="transparent" />
              <circle
                cx={X}
                cy={cy}
                r="3.5"
                fill={passed ? 'var(--color-accent-bright)' : 'var(--color-ink)'}
                stroke={passed ? 'var(--color-accent-bright)' : 'var(--color-line-strong)'}
                strokeWidth="1.5"
                className={`origin-center transition-[fill,stroke,scale] duration-500 ease-[var(--ease-out)] [transform-box:fill-box] ${current ? 'scale-150' : ''}`}
              />
            </g>
          );
        })}

        {/* Head: rings radiate from here whenever a section reports a moment */}
        <g ref={headRef} transform={`translate(${X} ${y0})`}>
          {pulses.map((p) => (
            <g key={p.id} style={{ color: TONE_COLOR[p.tone ?? 'accent'] }}>
              <circle
                r="5"
                fill="none"
                stroke="currentColor"
                strokeWidth={p.size === 'lg' ? 2.5 : 1.5}
                className={`origin-center [transform-box:fill-box] ${
                  p.size === 'lg' ? 'animate-[rail-ripple-lg_1.3s_var(--ease-out)_forwards]' : 'animate-[rail-ripple_0.9s_var(--ease-out)_forwards]'
                }`}
              />
              {p.size === 'lg' && (
                <circle
                  r="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="origin-center animate-[rail-ripple-lg_1.3s_var(--ease-out)_0.18s_both] [transform-box:fill-box]"
                />
              )}
            </g>
          ))}
          <circle
            r={latest ? (latest.size === 'lg' ? 6 : 4.5) : 3}
            fill={latest ? TONE_COLOR[latest.tone ?? 'accent'] : 'var(--color-fg)'}
            className="transition-[fill] duration-300"
          />
        </g>
      </svg>

      {/* Caption for the latest moment, riding beside the head (larger screens) */}
      <div ref={captionRef} className="absolute left-11 top-[max(88px,12svh)] hidden lg:block">
        {caption && (
          <span
            key={caption.id}
            className="eyebrow block animate-[rail-label_0.5s_var(--ease-out)_both] whitespace-nowrap rounded-full border border-line bg-surface/85 px-2.5 py-1 shadow-xs backdrop-blur-md"
            style={{ color: TONE_COLOR[caption.tone ?? 'accent'] }}
          >
            {caption.label}
          </span>
        )}
      </div>
    </div>
  );
}
