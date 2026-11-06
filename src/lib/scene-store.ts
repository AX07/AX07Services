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
  /** Hero beat 2 slot (logo beside the copy on desktop, above it on phones) */
  beatOn: false,
  beatX: 0,
  beatY: 0,
  beatScale: 1,
  /** World-space centre and scale of the logo slot in the final CTA (it tracks the layout) */
  ctaY: 0,
  ctaScale: 1,
  /**
   * 0 → 1 as the field gathers around the current chapter's target (an element marked
   * data-scene-target: the showcase phone, the features build, the speed test, the process line,
   * the featured price). `target` names it, so the scene can glide from one to the next.
   */
  form: 0,
  target: '',
  /** Share of particles that trace the outline, how much of it is traced (0..1), whether the rest
   *  fill the inside in rows, accent tint, and 1 when the target is a line rather than a box */
  share: 0.72,
  trace: 1,
  fill: 1,
  tint: 0,
  line: 0,
  /** 0 → 1 as the showcase phone bursts apart on the way out */
  burst: 0,
  /** Brightness of particles not on a target: 1 in the opening chapters, faint behind later copy */
  ambient: 1,
  /** That outline in world space: centre, half-size and corner radius */
  frameX: 0,
  frameY: 0,
  frameHalfW: 1,
  frameHalfH: 1,
  frameR: 0.1,
  /** Dark theme: particles switch to a light ink */
  dark: typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark',
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
  /** Counts touch taps, so the scene can answer each one */
  tap: 0,
};

/** Per-target progress written by sections (e.g. how much of the features site is built). */
export const traces: Record<string, number> = {};

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
