import Lenis from 'lenis';
import { clamp01, scene, setSceneVisibility, traces } from './scene-store';
import { railPulse } from './rail';

let lenis: Lenis | null = null;

// Camera: fov 35° at z = 9 → the viewport spans 2 · 9 · tan(17.5°) world units vertically
const VISIBLE_WORLD_HEIGHT = 2 * 9 * Math.tan((35 / 2) * (Math.PI / 180));
// The particle logo is normalised to 3 world units across
const LOGO_WORLD_SIZE = 3;

/** Scroll to a section id through Lenis when it's running (keeps the eased feel), natively otherwise. */
export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    // Sections below the fold mount after first paint; make sure Lenis knows the page's full height
    lenis.resize();
    lenis.scrollTo(el, { offset: id === 'top' ? 0 : -24, duration: 1.4, immediate });
  }
  else el.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' });
}

/** Scroll to an absolute page offset, eased through Lenis when it's running. */
export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

/**
 * Converts section positions into the 3D story:
 * hero → logo rises, turns and bursts into a field that drifts through the lag race, then travels
 * the page, gathering around each chapter's target in turn; the logo reassembles for the final
 * call to action.
 */
function updateScene() {
  const vh = window.innerHeight;
  const hero = document.getElementById('hero');
  const lag = document.getElementById('lag');
  const cta = document.getElementById('final-cta');
  const layer = document.getElementById('scene-layer');

  // Page → world mapping, measured from the canvas itself: window.innerWidth includes a desktop
  // scrollbar and innerHeight moves with mobile browser bars, either of which nudges the logo off
  // the element it is meant to sit on
  const view = document.getElementById('scene-canvas')?.getBoundingClientRect();
  const viewH = view?.height || vh;
  const centreX = view ? view.left + view.width / 2 : document.documentElement.clientWidth / 2;
  const centreY = view ? view.top + viewH / 2 : vh / 2;
  const worldPerPx = VISIBLE_WORLD_HEIGHT / viewH;

  let heroProgress = 1;
  if (hero) {
    const r = hero.getBoundingClientRect();
    heroProgress = clamp01(-r.top / Math.max(1, r.height - vh));
  }
  scene.hero = heroProgress;

  let ctaProgress = 0;
  if (cta) {
    const r = cta.getBoundingClientRect();
    ctaProgress = clamp01((vh - r.top) / (vh * 0.85));
  }

  scene.cta = ctaProgress;

  // The CTA reserves a slot in the page for the logo; map that slot into world space every frame,
  // so the logo scrolls with the layout like an image and never collides with the copy.
  const heroSlot = document.getElementById('hero-logo-slot');
  const heroSlotRect = heroSlot?.getBoundingClientRect();
  scene.heroSlotOn = !!heroSlotRect && heroSlotRect.height > 0;
  if (heroSlotRect && scene.heroSlotOn) {
    scene.heroSlotY = (centreY - (heroSlotRect.top + heroSlotRect.height / 2)) * worldPerPx;
    scene.heroSlotScale = (heroSlotRect.height * worldPerPx * 0.95) / LOGO_WORLD_SIZE;
  }

  const beatSlot = document.getElementById('hero-beat-slot');
  const beatRect = beatSlot?.getBoundingClientRect();
  scene.beatOn = !!beatRect && beatRect.height > 0;
  if (beatRect && scene.beatOn) {
    scene.beatX = (beatRect.left + beatRect.width / 2 - centreX) * worldPerPx;
    scene.beatY = (centreY - (beatRect.top + beatRect.height / 2)) * worldPerPx;
    scene.beatScale = (Math.min(beatRect.height, beatRect.width) * worldPerPx * 0.82) / LOGO_WORLD_SIZE;
  }

  const slot = document.getElementById('cta-logo-slot');
  if (slot) {
    const r = slot.getBoundingClientRect();
    scene.ctaY = (centreY - (r.top + r.height / 2)) * worldPerPx;
    scene.ctaScale = (r.height * worldPerPx * 0.92) / LOGO_WORLD_SIZE;
  }
  // The burst keeps drifting outwards through the lag race (staying dense and on screen), then gathers into the showcase device
  let lagProgress = 0;
  if (lag) {
    const r = lag.getBoundingClientRect();
    lagProgress = clamp01((vh * 0.6 - r.top) / (r.height - vh * 0.4));
  }
  // Holds together while beat 2 is read, then bursts as the copy leaves
  const heroDisperse = clamp01((heroProgress - 0.78) / 0.22) + lagProgress * 0.3;
  scene.disperse = ctaProgress > 0 ? 1 - ctaProgress : heroDisperse;

  // From the showcase on, the scattered field is the thread through the page: it gathers around
  // whichever chapter target fills most of the screen (data-scene-target), lets go between them,
  // and the faint remainder drifts behind the copy until the logo reassembles at the end
  // Cards that share one view on wide screens (data-scene-step) take turns: their own scroll
  // hands the field from one to the next instead of all of them claiming it at once
  const wide = window.innerWidth >= 1024;
  let best: { el: HTMLElement; r: DOMRect; w: number } | null = null;
  document.querySelectorAll<HTMLElement>('[data-scene-target]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    // Held for as long as its section is on screen, so a shape only breaks once its chapter is
    // done, never while its card is still being read. The element itself just has to be in view
    // (a line only needs a sliver of it)
    const s = el.closest('section')?.getBoundingClientRect() ?? r;
    const present = smoothstep(0, 1, Math.min(clamp01((vh - s.top) / (vh * 0.5)), clamp01(s.bottom / (vh * 0.5))));
    const overlap = (Math.min(vh, r.bottom) - Math.max(0, r.top)) / Math.max(1, Math.min(vh * 0.6, r.height));
    const seen = el.dataset.sceneLine ? smoothstep(0.05, 0.25, overlap) : smoothstep(0.25, 0.55, overlap);
    let w = present * seen;
    const step = el.dataset.sceneStep;
    const group = step !== undefined && wide ? el.parentElement : null;
    if (group) {
      // Turns run while the cards' grid rises from two thirds of the way down the screen to the top
      const p = clamp01((vh * 0.7 - group.getBoundingClientRect().top) / (vh * 0.65));
      const steps = Number(el.dataset.sceneSteps ?? 1);
      if (Math.min(steps - 1, Math.floor(p * steps)) !== Number(step)) w = 0;
    }
    // Equally present (stacked cards both in view): the one nearer the middle of the screen
    const mid = Math.abs((r.top + r.bottom) / 2 - vh / 2);
    const prev = best as { r: DOMRect; w: number } | null;
    const closer = !!prev && Math.abs(w - prev.w) < 0.05 && mid < Math.abs((prev.r.top + prev.r.bottom) / 2 - vh / 2);
    if (w > 0 && (!prev || w > prev.w + 0.05 || closer)) best = { el, r, w };
  });

  // Leaving the showcase, the phone dissolves and the field bursts out of it, falling away into
  // the next chapter (Showcase fades the device on the same range)
  const showcaseEl = document.getElementById('showcase');
  const device = document.getElementById('showcase-device');
  let burst = 0;
  if (showcaseEl && device) {
    burst = clamp01((vh - showcaseEl.getBoundingClientRect().bottom) / (vh * SHOWCASE_EXIT));
    if (burst > 0 && burst < 1) best = { el: device, r: device.getBoundingClientRect(), w: 1 - smoothstep(0.5, 1, burst) };
  }
  scene.burst = burst < 1 ? burst : 0;
  if (!best || (best as { w: number }).w < 0.5) locked = '';
  const found = best as { el: HTMLElement; r: DOMRect; w: number } | null;
  scene.form = found ? found.w * (1 - ctaProgress) : 0;
  if (found) {
    const { el, r } = found;
    const d = el.dataset;
    const id = d.sceneTarget!;
    const pad = Number(d.scenePad ?? 10);
    scene.target = id;
    scene.share = Number(d.sceneShare ?? 0.45);
    scene.fill = d.sceneFill ? 1 : 0;
    scene.tint = Number(d.sceneTint ?? 0);
    scene.line = d.sceneLine ? 1 : 0;
    scene.trace = traces[id] ?? 1;
    // The field settling on a target is a moment the rail marks too (sections that already pulse
    // their own story leave it to them)
    if (found.w > 0.95 && locked !== id) {
      locked = id;
      if (id.startsWith('proof')) railPulse({ tone: 'accent', size: 'sm' });
      if (id === 'pricing') railPulse({ tone: 'accent', size: 'lg' });
    }
    // A card keeps its true outline as it scrolls in and out; only something taller than the
    // screen (the process line) is clipped to it, so it's traced where it's seen
    const clip = r.height > vh * 0.9;
    const top = clip ? Math.max(r.top - pad, -pad) : r.top - pad;
    const bottom = clip ? Math.min(r.bottom + pad, vh + pad) : r.bottom + pad;
    scene.frameX = (r.left + r.width / 2 - centreX) * worldPerPx;
    scene.frameY = (centreY - (top + bottom) / 2) * worldPerPx;
    scene.frameHalfW = (r.width / 2 + pad) * worldPerPx;
    scene.frameHalfH = (Math.max(0, bottom - top) / 2) * worldPerPx;
    scene.frameR = ((parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0) + pad) * worldPerPx;
  }

  const showcaseTop = document.getElementById('showcase')?.getBoundingClientRect().top ?? vh;
  scene.ambient = Math.max(1 - (1 - AMBIENT) * clamp01(-showcaseTop / (vh * 0.5)), ctaProgress);

  // The full-bleed work gallery owns the screen: the field steps aside (as the rail does)
  const work = document.getElementById('work')?.getBoundingClientRect();
  const workCover = work ? Math.min(clamp01((vh * 0.75 - work.top) / (vh * 0.5)), clamp01((work.bottom - vh * 0.25) / (vh * 0.5))) : 0;
  const visible = 1 - workCover;
  setSceneVisibility(visible);
  if (layer) layer.style.opacity = String(visible);
}

let locked = '';

/** Share of a screen the showcase's end scrolls through while the phone bursts (Showcase.tsx) */
export const SHOWCASE_EXIT = 0.7;

/** Brightness of the drifting field once the opening chapters are over */
const AMBIENT = 0.26;
const smoothstep = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};

export function initSmoothScroll() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let rafId = 0;

  if (!reduceMotion) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on('scroll', (e: Lenis) => {
      scene.velocity = e.velocity;
      updateScene();
    });
    const raf = (time: number) => {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
  }

  const onNativeScroll = () => {
    if (!lenis) updateScene();
  };
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    scene.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    scene.pointerY = -(e.clientY / window.innerHeight) * 2 + 1;
    scene.pointerActive = true;
    // Card spotlight: hand the pointer position to whichever card is under it
    const card = (e.target as Element | null)?.closest?.('.card') as HTMLElement | null;
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }
  };
  const onPointerLeave = () => {
    scene.pointerActive = false;
  };
  // Touch: a tap pushes the field aside where the finger lands (and on the logo, shatters it and
  // lets it rebuild itself: a small easter egg). Released shortly after, as there is no hover
  let touchTimer = 0;
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    scene.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    scene.pointerY = -(e.clientY / window.innerHeight) * 2 + 1;
    scene.pointerActive = true;
    scene.tap++;
    window.clearTimeout(touchTimer);
    touchTimer = window.setTimeout(() => (scene.pointerActive = false), 900);
  };

  window.addEventListener('scroll', onNativeScroll, { passive: true });
  window.addEventListener('resize', updateScene);
  if (finePointer) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
  }
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  updateScene();

  return () => {
    window.clearTimeout(touchTimer);
    window.removeEventListener('pointerdown', onPointerDown);
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
    window.removeEventListener('scroll', onNativeScroll);
    window.removeEventListener('resize', updateScene);
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
  };
}
