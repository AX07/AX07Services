/**
 * Shared, mutable scene state. The scroll driver writes it, the WebGL scene reads it inside
 * useFrame. Nothing here triggers React renders (per-frame values never go through setState).
 */
export const scene = {
  /** 0 → 1 across the pinned hero */
  hero: 0,
  /** 0 → 1 as the final call to action scrolls in (logo reassembles there) */
  cta: 0,
  /** Mobile hero slot (logo above the headline); heroSlotOn is false when the slot is hidden */
  heroSlotOn: false,
  heroSlotY: 0,
  heroSlotScale: 1,
  /** World-space centre and scale of the logo slot in the final CTA (it tracks the layout) */
  ctaY: 0,
  ctaScale: 1,
  /** 0 = logo assembled, 1 = particles scattered into an ambient field */
  disperse: 0,
  /** canvas opacity, 0 hides the scene and pauses rendering */
  visible: 1,
  /** smoothed scroll velocity from Lenis (px/frame) */
  velocity: 0,
  /** pointer in normalized device coords (fine pointers only) */
  pointerX: 0,
  pointerY: 0,
  pointerActive: false,
};

type Listener = (visible: boolean) => void;
const listeners = new Set<Listener>();
let wasVisible = true;

/** Notify the canvas only when visibility crosses the threshold, so it can pause its frame loop. */
export function setSceneVisibility(value: number) {
  scene.visible = value;
  const isVisible = value > 0.01;
  if (isVisible !== wasVisible) {
    wasVisible = isVisible;
    listeners.forEach((fn) => fn(isVisible));
  }
}

export function onSceneVisibility(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
