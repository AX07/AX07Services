import { WaveBackdrop } from '../components/WaveBackdrop';
import { lazy, startTransition, Suspense, useEffect, useState } from 'react';
import { Hero } from '../sections/Hero';
import { LagRace } from '../sections/LagRace';
import { initSmoothScroll, scrollToId } from '../lib/smooth-scroll';

// three.js downloads straight away, in parallel with first paint, but only mounts once the page
// has loaded, so type and layout are on screen first
const sceneChunk = import('../three/Scene');
const Scene = lazy(() => sceneChunk);

// The rest of the page is its own chunk: fetched straight away, in parallel with first paint,
// and rendered in a transition so React can yield to the browser while it builds it
const restChunk = import('./HomeRest');
const HomeRest = lazy(() => restChunk);

/** True once the page has loaded: the 3D scene waits for this. */
function useAfterLoad() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let t = 0;
    // A timeout, not a frame or idle callback: lets the load event's own work finish first
    const go = () => {
      t = window.setTimeout(() => setReady(true), 0);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      window.clearTimeout(t);
    };
  }, []);
  return ready;
}

export function HomePage() {
  // Text, layout and booking buttons come first; three.js loads once they are interactive
  const show3d = useAfterLoad();
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    // A timeout, not a frame callback: frames never fire in background tabs
    const t = window.setTimeout(() => startTransition(() => setShowRest(true)), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const cleanup = initSmoothScroll();
    // Arriving from another page via a section link (/#pricing): wait for that section to exist,
    // jump straight there, then once more after pinned sections have measured themselves
    const id = window.location.hash.slice(1);
    const timers: number[] = [];
    const jump = (attempt: number) => {
      if (document.getElementById(id)) {
        scrollToId(id, true);
        timers.push(
          window.setTimeout(() => {
            scrollToId(id, true);
            window.history.replaceState({}, '', '/');
          }, 550),
        );
      } else if (attempt < 50) {
        timers.push(window.setTimeout(() => jump(attempt + 1), 100));
      }
    };
    if (id) timers.push(window.setTimeout(() => jump(0), 150));
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      cleanup?.();
    };
  }, []);

  return (
    <>
      {/* Hero backdrop: the silver waves from pricing, pinned for the length of the hero. Below the
          particle layer, so the logo assembles over the glass rather than behind it */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[260vh]">
        <div className="sticky top-0 isolate h-[100svh]">
          <WaveBackdrop eager className="inset-y-0" />
        </div>
      </div>

      {/* The scroll driver sets this layer's opacity as chapters change */}
      <div id="scene-layer" className="fixed inset-0 z-0 pointer-events-none">
        {show3d && (
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        )}
      </div>

      <main className="relative z-10">
        <Hero />
        <LagRace />
        {showRest && (
          <Suspense fallback={null}>
            <HomeRest />
          </Suspense>
        )}
      </main>
    </>
  );
}
