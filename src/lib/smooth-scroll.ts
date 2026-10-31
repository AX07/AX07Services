import Lenis from 'lenis';
import { clamp01, scene, setSceneVisibility } from './scene-store';

let lenis: Lenis | null = null;

// Camera: fov 35° at z = 9 → the viewport spans 2 · 9 · tan(17.5°) world units vertically
const VISIBLE_WORLD_HEIGHT = 2 * 9 * Math.tan((35 / 2) * (Math.PI / 180));
// The particle logo is normalised to 3 world units across
const LOGO_WORLD_SIZE = 3;

/** Scroll to a section id through Lenis when it's running (keeps the eased feel), natively otherwise. */
export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: id === 'top' ? 0 : -24, duration: 1.4, immediate });
  else el.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' });
}

/** Scroll to an absolute page offset, eased through Lenis when it's running. */
export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

/**
 * Converts section positions into the 3D story:
 * hero → logo rises, turns and scatters into an ambient field that keeps drifting through the lag
 * race and clears as it ends; the logo reassembles for the final call to action.
 */
function updateScene() {
  const vh = window.innerHeight;
  const hero = document.getElementById('hero');
  const lag = document.getElementById('lag');
  const cta = document.getElementById('final-cta');
  const layer = document.getElementById('scene-layer');

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
    const worldPerPx = VISIBLE_WORLD_HEIGHT / vh;
    scene.heroSlotY = (vh / 2 - (heroSlotRect.top + heroSlotRect.height / 2)) * worldPerPx;
    scene.heroSlotScale = (heroSlotRect.height * worldPerPx * 0.95) / LOGO_WORLD_SIZE;
  }

  const slot = document.getElementById('cta-logo-slot');
  if (slot) {
    const r = slot.getBoundingClientRect();
    const worldPerPx = VISIBLE_WORLD_HEIGHT / vh;
    scene.ctaY = (vh / 2 - (r.top + r.height / 2)) * worldPerPx;
    scene.ctaScale = (r.height * worldPerPx * 0.92) / LOGO_WORLD_SIZE;
  }
  // The burst keeps expanding through the lag race and has fully cleared by the time the section ends
  let lagProgress = 0;
  if (lag) {
    const r = lag.getBoundingClientRect();
    lagProgress = clamp01((vh * 0.6 - r.top) / (r.height - vh * 0.4));
  }
  const heroDisperse = clamp01((heroProgress - 0.55) / 0.45) + lagProgress * 0.9;
  scene.disperse = ctaProgress > 0 ? 1 - ctaProgress : heroDisperse;

  let visible = 1 - clamp01((lagProgress - 0.55) / 0.45);
  visible = Math.max(visible, ctaProgress);
  setSceneVisibility(visible);
  if (layer) layer.style.opacity = String(visible);
}

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

  window.addEventListener('scroll', onNativeScroll, { passive: true });
  window.addEventListener('resize', updateScene);
  if (finePointer) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
  }
  updateScene();

  return () => {
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis = null;
    window.removeEventListener('scroll', onNativeScroll);
    window.removeEventListener('resize', updateScene);
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
  };
}
