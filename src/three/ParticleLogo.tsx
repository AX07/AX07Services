import { use, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scene as store } from '../lib/scene-store';
import { onRailPulse, type RailTone } from '../lib/rail';

// The logo's surface, pre-sampled at build time (scripts/bake-logo-points.mjs): Int16 x, y, z per
// point over ±POINTS_RANGE, shuffled so any prefix is an even sample. index.html preloads it.
const POINTS_URL = '/logo-points.bin';
const POINTS_RANGE = 2;
const pointsRequest = fetch(POINTS_URL)
  .then((r) => {
    if (!r.ok) throw new Error(`${POINTS_URL}: ${r.status}`);
    return r.arrayBuffer();
  })
  .then((buf) => new Int16Array(buf));

// Particle ink per theme (switched instantly so the theme reveal shows the new colour)
// Light theme: near-black, drawn more opaque and a little larger, so the field reads as strongly on
// the pale page as the glowing one does on night
const INK_LIGHT = new THREE.Color('#0c0d10');
const INK_DARK = new THREE.Color('#e8e8ed');
// Seconds for one shape to break apart and the pieces to rebuild the next
const SWITCH_TIME = 1.3;

// Rail moments flash the field in the same colours the rail uses
const KICK_COLOR: Record<RailTone, THREE.Color> = {
  accent: new THREE.Color('#10b981'),
  danger: new THREE.Color('#dc2626'),
  warn: new THREE.Color('#d97706'),
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAssemble;
  uniform float uDisperse;
  uniform float uVelocity;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uPointer;
  uniform float uPointerOn;
  uniform vec2 uPointerWorld;
  uniform float uForm;
  uniform vec2 uFrameCenter;
  uniform vec2 uFrameHalf;
  uniform float uFrameR;
  uniform float uShare;
  uniform float uTrace;
  uniform float uFill;
  uniform float uLine;
  uniform float uKick;
  uniform float uBurst;
  uniform float uSwitch;

  attribute vec3 aScatter;
  attribute float aSeed;
  attribute vec3 aFrame;

  // A point at fraction t along the outline of a rounded rectangle (clockwise from the top edge)
  vec2 roundedRect(float t, vec2 h, float r) {
    r = min(r, min(h.x, h.y));
    float sx = 2.0 * (h.x - r);
    float sy = 2.0 * (h.y - r);
    float arc = 1.5707963 * r;
    float d = t * (2.0 * sx + 2.0 * sy + 4.0 * arc);
    if (d < sx) return vec2(-h.x + r + d, h.y);
    d -= sx;
    if (d < arc) { float a = d / max(r, 1e-4); return vec2(h.x - r, h.y - r) + r * vec2(sin(a), cos(a)); }
    d -= arc;
    if (d < sy) return vec2(h.x, h.y - r - d);
    d -= sy;
    if (d < arc) { float a = d / max(r, 1e-4); return vec2(h.x - r, -h.y + r) + r * vec2(cos(a), -sin(a)); }
    d -= arc;
    if (d < sx) return vec2(h.x - r - d, -h.y);
    d -= sx;
    if (d < arc) { float a = d / max(r, 1e-4); return vec2(-h.x + r, -h.y + r) + r * vec2(-sin(a), -cos(a)); }
    d -= arc;
    if (d < sy) return vec2(-h.x, -h.y + r + d);
    d -= sy;
    float a = d / max(r, 1e-4);
    return vec2(-h.x + r, h.y - r) + r * vec2(-cos(a), sin(a));
  }

  varying float vGlow;
  varying float vSeed;
  varying float vFade;
  varying float vForm;

  void main() {
    vec3 target = position;

    // Staggered assembly: each particle arrives at its own moment
    float a = clamp(uAssemble * 1.5 - aSeed * 0.5, 0.0, 1.0);
    a = 1.0 - pow(1.0 - a, 3.0);
    vec3 p = mix(target + aScatter, target, a);

    // Scroll-driven dispersal into an ambient field
    // Kept within roughly a screen's width so the cloud stays visible through the next chapter
    float d = uDisperse * (0.55 + aSeed * 0.9);
    p += aScatter * d * 0.6;
    p.y += d * (aSeed - 0.5) * 1.0;
    // Once scattered, the cloud keeps drifting so the explosion still feels in motion
    p += aScatter * min(d, 1.0) * 0.12 * sin(uTime * 0.35 + aSeed * 6.2831);

    // Idle breathing so the logo is never frozen
    p.z += sin(uTime * 0.7 + target.x * 2.2 + aSeed * 6.2831) * 0.025;

    // Scroll velocity sends a ripple through the logo (the touch-device interaction)
    p.z += sin(target.y * 3.0 - uTime * 6.0) * uVelocity * 0.35;

    // Cursor (or a tap) pushes particles aside
    vec2 delta = p.xy - uPointer.xy;
    float dist = length(delta);
    float force = smoothstep(0.75, 0.0, dist) * uPointerOn;
    p.xy += normalize(delta + 1e-5) * force * 0.5;
    p.z += force * 0.35;

    // Gather around the current chapter's target (in world space): a share of the particles trace
    // its outline, as far as the section has got (uTrace); in the showcase the rest fill it in faint
    // rows; everything else keeps drifting as the ambient field
    vec4 world = modelMatrix * vec4(p, 1.0);
    bool outline = aFrame.z < uShare;
    float eligible = outline ? smoothstep(uTrace + 0.02, uTrace - 0.02, aFrame.x) : (aFrame.z >= 0.72 ? uFill : 0.0);
    float f = clamp(uForm * eligible * 1.6 - aSeed * 0.6, 0.0, 1.0);
    f = f * f * (3.0 - 2.0 * f);
    vec2 jitter = (vec2(aFrame.y, fract(aFrame.y * 7.31)) - 0.5) * 0.04;
    vec2 fp;
    if (outline) {
      vec2 box = roundedRect(aFrame.x, uFrameHalf, uFrameR);
      vec2 seg = vec2(0.0, mix(uFrameHalf.y, -uFrameHalf.y, aFrame.x)) + vec2(uFrameHalf.x * (aFrame.y - 0.5) * 2.0, 0.0);
      fp = mix(box, seg, uLine) + jitter;
    } else {
      float rows = 14.0;
      float row = floor(aFrame.y * rows);
      fp = vec2((aFrame.x * 2.0 - 1.0) * (uFrameHalf.x - uFrameR * 0.6) * mix(0.55, 0.9, fract(row * 0.37)),
                uFrameHalf.y - (row + 0.75) / rows * uFrameHalf.y * 2.0);
    }
    vec3 formed = vec3(uFrameCenter + fp, 0.0);
    // Every moment the rail marks ripples through the formed shape too
    formed.xy += normalize(fp + 1e-5) * uKick * (0.04 + aSeed * 0.08);
    // Break and rebuild: a shape shatters as the field lets go of it (uForm falling) or hands over
    // to the next target (uSwitch), and the same pieces fly back in to build the next one. Leaving
    // the showcase it bursts on the scroll itself (uBurst), thrown outwards and tumbling down
    float shatter = clamp(max(uSwitch, 1.0 - uForm) * 1.15, 0.0, 1.0);
    shatter = shatter * shatter * (3.0 - 2.0 * shatter);
    float b = uBurst * uBurst * (3.0 - 2.0 * uBurst);
    // A handover stays a tight cloud around the shape, so it reads as the same pieces regrouping;
    // the showcase exit is the big one
    float reach = b * 1.6 + shatter * 0.55;
    formed += (vec3(normalize(fp + 1e-5) * reach, 0.0) + aScatter * (b * 0.45 + shatter * 0.12)) * (0.45 + aSeed * 1.1);
    formed.y -= b * b * (0.6 + aSeed) * 1.2;
    world.xyz = mix(world.xyz, formed, f);

    // Shapes the field has formed answer the cursor (or a tap) too, parting around it
    vec2 away = world.xy - uPointerWorld;
    float near = smoothstep(0.9, 0.0, length(away)) * uPointerOn * f;
    world.xy += normalize(away + 1e-5) * near * 0.32;
    force = max(force, near);

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) / -mv.z * mix(1.0, 0.7, f);

    vGlow = force;
    vSeed = aSeed;
    // Past 1 the burst keeps expanding and thins out as it goes
    vFade = mix(1.0, 0.75, clamp(uDisperse, 0.0, 1.0)) * (1.0 - clamp(uDisperse - 1.0, 0.0, 1.0) * 0.25);
    vFade = mix(vFade, outline ? 1.0 : 0.45, f);
    vForm = f;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;
  uniform float uAmbient;
  uniform float uForm;
  uniform float uTint;
  uniform float uKick;
  uniform vec3 uKickColor;

  varying float vGlow;
  varying float vSeed;
  varying float vFade;
  varying float vForm;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, r);
    float accentMix = clamp(vGlow * 1.4 + step(0.93, vSeed) * 0.85, 0.0, 1.0);
    vec3 color = mix(uColor, uAccent, max(accentMix, uTint * vForm));
    color = mix(color, uKickColor, uKick * (0.35 + 0.65 * vForm));
    // While the field is gathered on a target only the gathered particles show: no second layer
    // drifting behind it
    float presence = mix(uAmbient * (1.0 - uForm), 1.0, vForm);
    gl_FragColor = vec4(color, alpha * uOpacity * vFade * presence * (0.55 + vSeed * 0.45));
  }
`;

interface Props {
  count: number;
}

export function ParticleLogo({ count }: Props) {
  const baked = use(pointsRequest);
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { camera, gl } = useThree();
  const startTime = useRef<number | null>(null);
  // Replay: after leaving the hero, returning to the very top bursts the logo and reassembles it
  const leftHero = useRef(false);
  const replayStart = useRef<number | null>(null);
  const tilt = useRef({ x: 0, y: 0 });
  // Gliding from one chapter target to the next: where the outline was when the target changed
  const glide = useRef({ target: '', from: [0, 0, 1, 1, 0.1], t: 1 });
  const kick = useRef(0);
  const lastTap = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // The baked logo surface into a GPU buffer, plus each particle's scatter, seed and frame slot
  const geometry = useMemo(() => {
    const total = Math.min(count, baked.length / 3);
    const targets = new Float32Array(total * 3);
    for (let i = 0; i < targets.length; i++) targets[i] = (baked[i] / 32767) * POINTS_RANGE;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(targets, 3));
    const scatter = new Float32Array(total * 3);
    const seeds = new Float32Array(total);
    for (let i = 0; i < total; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 3.5;
      scatter[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      scatter[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      scatter[i * 3 + 2] = r * Math.cos(phi);
      seeds[i] = Math.random();
    }
    geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const frame = new Float32Array(total * 3);
    for (let i = 0; i < frame.length; i++) frame[i] = Math.random();
    geo.setAttribute('aFrame', new THREE.BufferAttribute(frame, 3));
    geo.computeBoundingSphere();
    return geo;
  }, [baked, count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uAssemble: { value: reduceMotion ? 1 : 0 },
          uDisperse: { value: 0 },
          uVelocity: { value: 0 },
          uSize: { value: 24 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
          uPointer: { value: new THREE.Vector3(99, 99, 0) },
          uPointerOn: { value: 0 },
          uPointerWorld: { value: new THREE.Vector2(99, 99) },
          uForm: { value: 0 },
          uFrameCenter: { value: new THREE.Vector2() },
          uFrameHalf: { value: new THREE.Vector2(1, 1) },
          uFrameR: { value: 0.1 },
          uShare: { value: 0.72 },
          uTrace: { value: 1 },
          uFill: { value: 1 },
          uLine: { value: 0 },
          uKick: { value: 0 },
          uBurst: { value: 0 },
          uSwitch: { value: 0 },
          uKickColor: { value: new THREE.Color('#10b981') },
          uAmbient: { value: 1 },
          uTint: { value: 0 },
          uColor: { value: new THREE.Color('#1d1d1f') },
          uAccent: { value: new THREE.Color('#10b981') },
          uOpacity: { value: 0.78 },
        },
      }),
    [reduceMotion],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useEffect(() => {
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
  }, [gl, material]);

  // One conductor: every story moment a section marks (lib/rail.ts) ripples the field
  useEffect(
    () =>
      onRailPulse((p) => {
        kick.current = Math.max(kick.current, p.size === 'lg' ? 1 : 0.55);
        (material.uniforms.uKickColor.value as THREE.Color).copy(KICK_COLOR[p.tone ?? 'accent']);
      }),
    [material],
  );

  const plane = useMemo(() => new THREE.Plane(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const flat = useMemo(() => new THREE.Vector2(), []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const points = pointsRef.current;
    if (!group || !points) return;
    const u = material.uniforms;
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;

    u.uTime.value = t;
    if (store.hero > 0.25) leftHero.current = true;
    if (leftHero.current && store.hero < 0.01 && replayStart.current === null && !reduceMotion) {
      leftHero.current = false;
      replayStart.current = t;
    }
    if (!reduceMotion) {
      let assemble = Math.min(1, (t - startTime.current) / 2.4);
      if (replayStart.current !== null) {
        const r = t - replayStart.current;
        const BURST = 0.45;
        if (r < BURST) {
          // Burst outwards (ease-out), then the same staggered reassembly as on first load
          const p = r / BURST;
          assemble = 1 - (1 - Math.pow(1 - p, 3));
        } else {
          assemble = Math.min(1, (r - BURST) / 2.2);
          if (assemble >= 1) replayStart.current = null;
        }
      }
      u.uAssemble.value = assemble;
    }

    // Smooth toward scroll-derived targets so fast flicks still feel weighted
    const k = 1 - Math.pow(0.001, delta);
    u.uDisperse.value += (store.disperse - u.uDisperse.value) * k;
    u.uForm.value += (store.form - u.uForm.value) * k;
    (u.uColor.value as THREE.Color).copy(store.dark ? INK_DARK : INK_LIGHT);
    u.uOpacity.value = store.dark ? 0.78 : 0.95;
    u.uSize.value = store.dark ? 24 : 27;
    // Same target: the outline follows it exactly as it scrolls. New target: glide across to it
    const g = glide.current;
    const frame = [store.frameX, store.frameY, store.frameHalfW, store.frameHalfH, store.frameR];
    if (store.target !== g.target) {
      const c = u.uFrameCenter.value as THREE.Vector2;
      const hh = u.uFrameHalf.value as THREE.Vector2;
      // The very first target is formed from the scattered field, with nothing to break first
      g.t = g.target ? 0 : 1;
      g.from = g.target ? [c.x, c.y, hh.x, hh.y, u.uFrameR.value] : frame;
      g.target = store.target;
    }
    // The old shape breaks apart, the frame moves across while the pieces are in the air, and they
    // land on the new one
    g.t = Math.min(1, g.t + delta / SWITCH_TIME);
    const e = THREE.MathUtils.smoothstep(g.t, 0.35, 0.65);
    u.uSwitch.value = reduceMotion ? 0 : Math.sin(Math.PI * g.t);
    const at = (i: number) => g.from[i] + (frame[i] - g.from[i]) * e;
    (u.uFrameCenter.value as THREE.Vector2).set(at(0), at(1));
    (u.uFrameHalf.value as THREE.Vector2).set(at(2), at(3));
    u.uFrameR.value = at(4);
    const soft = 1 - Math.pow(0.02, delta);
    u.uShare.value += (store.share - u.uShare.value) * soft;
    u.uFill.value += (store.fill - u.uFill.value) * soft;
    u.uLine.value += (store.line - u.uLine.value) * soft;
    u.uTint.value += (store.tint - u.uTint.value) * soft;
    u.uTrace.value += (store.trace - u.uTrace.value) * k;
    u.uAmbient.value += (store.ambient - u.uAmbient.value) * k;
    u.uBurst.value += (store.burst - u.uBurst.value) * k;
    kick.current *= Math.pow(0.04, delta);
    u.uKick.value = reduceMotion ? 0 : kick.current;
    const vel = Math.min(1, Math.abs(store.velocity) / 40);
    u.uVelocity.value += (vel - u.uVelocity.value) * (1 - Math.pow(0.02, delta));

    // Choreography: rise to centre, turn a full revolution and grow across the hero;
    // settle smaller and higher behind the final call to action
    const isMobile = state.size.width < 768;
    const h = store.hero;
    const c = store.cta;
    const baseScale = store.heroSlotOn ? store.heroSlotScale : isMobile ? 0.82 : 1.05;
    let heroScale = baseScale * (1 + h * (store.heroSlotOn ? 0.9 : 0.45));
    // Starts low, peeking up beneath the hero copy, then rises to centre (product-reveal style)
    let heroY = (store.heroSlotOn ? store.heroSlotY : -2.6) * (1 - Math.min(1, h * 1.6));
    let heroX = 0;
    if (store.beatOn) {
      // Beat 2: glide from above the headline into its own half of the screen beside the copy
      const b = THREE.MathUtils.smoothstep(h, 0.1, 0.32);
      const introY = store.heroSlotOn ? store.heroSlotY : -2.6;
      heroScale = THREE.MathUtils.lerp(baseScale, store.beatScale, b) * (1 + Math.max(0, h - 0.78) * 0.8);
      // Centre the cloud as it bursts, so it fills the screen behind the next chapter (the beat
      // slot itself scrolls away with the hero, so it can't anchor the cloud past this point)
      const burst = THREE.MathUtils.smoothstep(h, 0.78, 1);
      heroY = THREE.MathUtils.lerp(introY, store.beatY, b) * (1 - burst);
      heroX = store.beatX * b * (1 - burst);
    }
    const targetScale = heroScale + (store.ctaScale - heroScale) * c;
    const targetY = heroY + (store.ctaY - heroY) * c;
    const targetX = heroX * (1 - c);
    // Once settled in the CTA slot, lock to it exactly so the logo scrolls in step with the copy
    const follow = c >= 0.999 ? 1 : k;
    group.scale.setScalar(group.scale.x + (targetScale - group.scale.x) * follow);
    group.position.y += (targetY - group.position.y) * follow;
    group.position.x += (targetX - group.position.x) * follow;

    const pointerTiltX = store.pointerActive ? store.pointerY * 0.18 : 0;
    const pointerTiltY = store.pointerActive ? store.pointerX * 0.28 : 0;
    tilt.current.x += (pointerTiltX - tilt.current.x) * k * 0.6;
    tilt.current.y += (pointerTiltY - tilt.current.y) * k * 0.6;
    const idleSway = reduceMotion ? 0 : Math.sin(t * 0.25) * 0.12;
    group.rotation.x = -tilt.current.x;
    group.rotation.y = h * Math.PI * 2 + tilt.current.y + idleSway;

    // Cursor → local space of the points, so the push lands exactly under the pointer
    if (store.pointerActive) {
      ndc.set(store.pointerX, store.pointerY);
      raycaster.setFromCamera(ndc, camera);
      normal.set(0, 0, 1).applyQuaternion(group.quaternion);
      plane.setFromNormalAndCoplanarPoint(normal, group.position);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        points.worldToLocal(hit);
        (u.uPointer.value as THREE.Vector3).lerp(hit, 0.35);
        // A tap on the assembled logo shatters it and it rebuilds itself
        if (store.tap !== lastTap.current) {
          lastTap.current = store.tap;
          const onLogo = Math.hypot(hit.x, hit.y) < 1.7 && u.uForm.value < 0.1 && u.uDisperse.value < 0.3;
          if (onLogo && replayStart.current === null && !reduceMotion) {
            replayStart.current = t;
            kick.current = 1;
            (u.uKickColor.value as THREE.Color).copy(KICK_COLOR.accent);
          }
        }
      }
      // The same point on the page plane, for the shapes the field forms there
      plane.set(normal.set(0, 0, 1), 0);
      if (raycaster.ray.intersectPlane(plane, hit)) (u.uPointerWorld.value as THREE.Vector2).lerp(flat.set(hit.x, hit.y), 0.35);
      u.uPointerOn.value += (1 - u.uPointerOn.value) * 0.1;
    } else {
      u.uPointerOn.value += (0 - u.uPointerOn.value) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Never culled: while forming the device the particles leave the logo's bounds */}
      <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
