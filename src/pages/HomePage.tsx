import { lazy, startTransition, Suspense, useEffect, useState } from 'react';
import { Hero } from '../sections/Hero';
import { LagRace } from '../sections/LagRace';
import { initSmoothScroll, scrollToId } from '../lib/smooth-scroll';

// three.js + the model load after the page is interactive, so type and layout are on screen instantly
const Scene = lazy(() => import('../three/Scene'));

// The rest of the page is its own chunk: fetched straight away, in parallel with first paint,
// and rendered in a transition so React can yield to the browser while it builds it
const restChunk = import('./HomeRest');
const HomeRest = lazy(() => restChunk);

/** True once the page has loaded and the browser is idle: the 3D scene waits for this. */
function useAfterLoad() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idle = 0;
    const go = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setReady(true), { timeout: 1500 })
        : window.setTimeout(() => setReady(true), 200);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
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
