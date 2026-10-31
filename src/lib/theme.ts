import { useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { scene } from './scene-store';

/**
 * Light / dark theme. The choice lives on <html data-theme> (set before first paint by the inline
 * script in index.html), is remembered per visitor, and follows the system setting until they pick.
 */
export type Theme = 'light' | 'dark';

const KEY = 'ax07-theme';
const listeners = new Set<() => void>();

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0a0c' : '#fbfbfd');
  scene.dark = theme === 'dark';
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode: the choice just isn't remembered
  }
  listeners.forEach((fn) => fn());
}

export function useTheme() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getTheme,
    () => 'light' as Theme,
  );
}

/**
 * Switch theme with a reveal: the new theme sweeps out in a circle from the toggle while the old
 * page blurs and sinks back. Falls back to an instant swap without View Transitions or when the
 * visitor prefers reduced motion.
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) {
    apply(next);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 32;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const root = document.documentElement;
  root.classList.add('theme-switching');

  // Everything (including React-rendered icons) must be in its new state when the snapshot is taken
  const transition = document.startViewTransition(() => flushSync(() => apply(next)));
  transition.ready.then(() => {
    const ease = 'cubic-bezier(0.76, 0, 0.24, 1)';
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 1100, easing: ease, pseudoElement: '::view-transition-new(root)' },
    );
    root.animate(
      { transform: ['scale(1)', 'scale(0.92)'], filter: ['blur(0px) brightness(1)', `blur(8px) brightness(${next === 'dark' ? 0.6 : 1.3})`] },
      { duration: 1100, easing: ease, pseudoElement: '::view-transition-old(root)' },
    );
  });
  transition.finished.finally(() => root.classList.remove('theme-switching'));
}
