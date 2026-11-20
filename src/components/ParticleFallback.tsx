import { useEffect, useRef } from 'react';

/**
 * The particle field in its scattered state, drawn on a plain 2D canvas from the first paint, so the hero is never
 * empty while three.js and the baked logo points download. When the 3D scene has drawn its first frame (it dispatches
 * "ax07:scene-ready", see three/Scene.tsx) this fades out and the real particles take over, forming the logo.
 */
export function ParticleFallback() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = window.innerWidth < 768 ? 700 : 1400;
    // A scattered sphere around where the logo forms (the hero's logo slot), like the 3D field's scatter
    const dots = Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.25 + Math.random() * 0.75;
      return { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.sin(phi) * Math.sin(theta), z: Math.cos(phi), s: Math.random() };
    });
    let raf = 0;
    let done = false;
    const draw = (t: number) => {
      const w = window.innerWidth, h = window.innerHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const slot = document.getElementById('hero-logo-slot')?.getBoundingClientRect();
      const cx = slot ? slot.left + slot.width / 2 : w / 2;
      const cy = slot ? slot.top + slot.height / 2 : h * 0.35;
      const R = Math.max(w, h) * 0.55;
      const dark = document.documentElement.dataset.theme === 'dark';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = dark ? 'rgba(232,232,237,0.55)' : 'rgba(12,13,16,0.55)';
      const drift = reduce ? 0 : t / 9000;
      for (const d of dots) {
        const a = drift * (0.4 + d.s);
        const x = d.x * Math.cos(a) - d.z * Math.sin(a) * 0.3;
        const size = 0.6 + d.s * 1.1;
        ctx.fillRect(cx + x * R, cy + d.y * R * 0.8, size, size);
      }
      if (!done && !reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const ready = () => {
      canvas.style.opacity = '0';
      window.setTimeout(() => {
        done = true;
        cancelAnimationFrame(raf);
        canvas.remove();
      }, 1200);
    };
    window.addEventListener('ax07:scene-ready', ready, { once: true });
    return () => {
      done = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('ax07:scene-ready', ready);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full transition-opacity duration-1000 ease-[var(--ease-out)]"
    />
  );
}
