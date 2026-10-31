import { lazy, Suspense, useEffect } from 'react';
import { Hero } from '../sections/Hero';
import { LagRace } from '../sections/LagRace';
import { Showcase } from '../sections/Showcase';
import { Features } from '../sections/Features';
import { Proof } from '../sections/Proof';
import { Process } from '../sections/Process';
import { Work } from '../sections/Work';
import { Pricing } from '../sections/Pricing';
import { Faq } from '../sections/Faq';
import { FinalCta } from '../sections/FinalCta';
import { initSmoothScroll, scrollToId } from '../lib/smooth-scroll';

// three.js + the model load after first paint, so type and layout are on screen instantly
const Scene = lazy(() => import('../three/Scene'));

export function HomePage() {
  useEffect(() => {
    const cleanup = initSmoothScroll();
    // Arriving from another page via a section link (/#pricing)
    const id = window.location.hash.slice(1);
    // Jump straight there, then once more after pinned sections have measured themselves
    const timers = id
      ? [150, 700].map((ms) =>
          window.setTimeout(() => {
            scrollToId(id, true);
            window.history.replaceState({}, '', '/');
          }, ms),
        )
      : [];
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      cleanup?.();
    };
  }, []);

  return (
    <>
      {/* The scroll driver sets this layer's opacity as chapters change */}
      <div id="scene-layer" className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      <main className="relative z-10">
        <Hero />
        <LagRace />
        <Showcase />
        <div className="relative bg-ink">
          <Features />
          <Proof />
          <Process />
        </div>
        <div className="relative bg-ink">
          <Work />
        </div>
        <div className="relative bg-ink">
          <Pricing />
          <Faq />
        </div>
        <FinalCta />
      </main>
    </>
  );
}
