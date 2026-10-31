import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { scene as store } from '../lib/scene-store';

const MODEL_URL = '/logo.glb';

// One decoder for the whole app, configured identically for preload and load
const draco = new DRACOLoader().setDecoderPath('/draco/');
const withDraco = (loader: GLTFLoader) => {
  loader.setDRACOLoader(draco);
};
useLoader.preload(GLTFLoader, MODEL_URL, withDraco);

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAssemble;
  uniform float uDisperse;
  uniform float uVelocity;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uPointer;
  uniform float uPointerOn;

  attribute vec3 aScatter;
  attribute float aSeed;

  varying float vGlow;
  varying float vSeed;
  varying float vFade;

  void main() {
    vec3 target = position;

    // Staggered assembly: each particle arrives at its own moment
    float a = clamp(uAssemble * 1.5 - aSeed * 0.5, 0.0, 1.0);
    a = 1.0 - pow(1.0 - a, 3.0);
    vec3 p = mix(target + aScatter, target, a);

    // Scroll-driven dispersal into an ambient field
    float d = uDisperse * (0.55 + aSeed * 0.9);
    p += aScatter * d * 1.6;
    p.y += d * (aSeed - 0.5) * 2.0;

    // Idle breathing so the logo is never frozen
    p.z += sin(uTime * 0.7 + target.x * 2.2 + aSeed * 6.2831) * 0.025;

    // Scroll velocity sends a ripple through the logo (the touch-device interaction)
    p.z += sin(target.y * 3.0 - uTime * 6.0) * uVelocity * 0.35;

    // Cursor pushes particles aside (fine pointers only)
    vec2 delta = p.xy - uPointer.xy;
    float dist = length(delta);
    float force = smoothstep(0.75, 0.0, dist) * uPointerOn;
    p.xy += normalize(delta + 1e-5) * force * 0.38;
    p.z += force * 0.35;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) / -mv.z;

    vGlow = force;
    vSeed = aSeed;
    // Past 1 the burst keeps expanding and thins out as it goes
    vFade = mix(1.0, 0.35, clamp(uDisperse, 0.0, 1.0)) * (1.0 - clamp(uDisperse - 1.0, 0.0, 1.0) * 0.6);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;

  varying float vGlow;
  varying float vSeed;
  varying float vFade;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, r);
    float accentMix = clamp(vGlow * 1.4 + step(0.93, vSeed) * 0.85, 0.0, 1.0);
    vec3 color = mix(uColor, uAccent, accentMix);
    gl_FragColor = vec4(color, alpha * uOpacity * vFade * (0.55 + vSeed * 0.45));
  }
`;

interface Props {
  count: number;
}

export function ParticleLogo({ count }: Props) {
  const gltf = useLoader(GLTFLoader, MODEL_URL, withDraco);
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { camera, gl } = useThree();
  const startTime = useRef<number | null>(null);
  // Replay: after leaving the hero, returning to the very top bursts the logo and reassembles it
  const leftHero = useRef(false);
  const replayStart = useRef<number | null>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // Sample the logo surface once into a GPU buffer
  const geometry = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
    });

    const totalVerts = meshes.reduce((n, m) => n + m.geometry.attributes.position.count, 0) || 1;
    const targets: number[] = [];
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    const normalMatrix = new THREE.Matrix3();

    for (const mesh of meshes) {
      const share = Math.max(1, Math.round((mesh.geometry.attributes.position.count / totalVerts) * count));
      const sampler = new MeshSurfaceSampler(mesh).build();
      normalMatrix.getNormalMatrix(mesh.matrixWorld);
      let placed = 0;
      let guard = 0;
      while (placed < share && guard < share * 4) {
        guard++;
        sampler.sample(p, n);
        n.applyMatrix3(normalMatrix).normalize();
        if (n.z < -0.35) continue; // skip the back plate: keeps the silhouette crisp from the front
        p.applyMatrix4(mesh.matrixWorld);
        targets.push(p.x, p.y, p.z);
        placed++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(targets, 3));
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const scale = 3 / Math.max(size.x, size.y);
    geo.translate(-center.x, -center.y, -center.z);
    geo.scale(scale, scale, scale);

    const total = targets.length / 3;
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
    geo.computeBoundingSphere();
    return geo;
  }, [gltf, count]);

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

  const plane = useMemo(() => new THREE.Plane(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);

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
    const vel = Math.min(1, Math.abs(store.velocity) / 40);
    u.uVelocity.value += (vel - u.uVelocity.value) * (1 - Math.pow(0.02, delta));

    // Choreography: rise to centre, turn a full revolution and grow across the hero;
    // settle smaller and higher behind the final call to action
    const isMobile = state.size.width < 768;
    const h = store.hero;
    const c = store.cta;
    const baseScale = store.heroSlotOn ? store.heroSlotScale : isMobile ? 0.82 : 1.05;
    const heroScale = baseScale * (1 + h * (store.heroSlotOn ? 0.9 : 0.45));
    // Starts low, peeking up beneath the hero copy, then rises to centre (product-reveal style)
    const heroY = (store.heroSlotOn ? store.heroSlotY : -2.6) * (1 - Math.min(1, h * 1.6));
    const targetScale = heroScale + (store.ctaScale - heroScale) * c;
    const targetY = heroY + (store.ctaY - heroY) * c;
    // Once settled in the CTA slot, lock to it exactly so the logo scrolls in step with the copy
    const follow = c >= 0.999 ? 1 : k;
    group.scale.setScalar(group.scale.x + (targetScale - group.scale.x) * follow);
    group.position.y += (targetY - group.position.y) * follow;

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
      }
      u.uPointerOn.value += (1 - u.uPointerOn.value) * 0.1;
    } else {
      u.uPointerOn.value += (0 - u.uPointerOn.value) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  );
}
