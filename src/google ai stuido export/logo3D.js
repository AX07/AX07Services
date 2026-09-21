import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  try {
    if (!window.THREE) {
      window.THREE = THREE;
    }
    if (!window.GLTFLoader) {
      window.GLTFLoader = GLTFLoader;
    }
    if (!window.gsap) {
      window.gsap = gsap;
    }
    if (!window.ScrollTrigger) {
      window.ScrollTrigger = ScrollTrigger;
    }
    gsap.registerPlugin(ScrollTrigger);
  } catch (e) {
    // Ignore environment restrictions
  }
}

/**
 * ax07 services - 3D Logo & Particle Physics Engine
 * 
 * Includes:
 * - 3D Mesh loading & auto-centering
 * - Contour particle extraction with gap filtering (backplate vertices excluded)
 * - 3D Cursor tilt & specular glint tracking
 * - Kinetic particle dispersal on hover & smooth 0.05 restorative lerp
 * - GSAP ScrollTrigger timeline (pin, lateral slide, zoom-through)
 */

export function init3DLogo(options = {}) {
  const {
    container = document.body,
    scrollTriggerEl = null,
    modelUrl = '/logo.glb',
    mode = 'hybrid', // 'hybrid' | 'particles' | 'mesh'
    dispersalRadius = 1.2,
    returnLerp = 0.05,
    autoRotate = !scrollTriggerEl,
    onLoad = () => {},
  } = options;

  // Resolve THREE & GSAP from window or module imports
  const _THREE = (typeof window !== 'undefined' && window.THREE) || THREE;
  const _gsap = (typeof window !== 'undefined' && window.gsap) || gsap;
  const _ScrollTrigger = (typeof window !== 'undefined' && window.ScrollTrigger) || ScrollTrigger;

  if (!_THREE) {
    console.error('[ax07] Three.js is required. Ensure Three.js is loaded.');
    return;
  }

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 0, 4.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  if ('outputColorSpace' in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  } else if ('outputEncoding' in renderer) {
    renderer.outputEncoding = THREE.sRGBEncoding || 3001;
  }
  renderer.toneMapping = THREE.ACESFilmicToneMapping || 4;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  // 2. Studio Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(5, 6, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x88ccee, 1.4);
  fillLight.position.set(-5, 3, 4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
  rimLight.position.set(0, -5, -3);
  scene.add(rimLight);

  const cursorLight = new THREE.PointLight(0xffffff, 2.5, 6.0);
  cursorLight.position.set(0, 0, 2);
  scene.add(cursorLight);

  // 3. Hierarchy & Physics Arrays
  const logoGroup = new THREE.Group();
  scene.add(logoGroup);

  let meshAsset = null;
  let particles = null;
  let originalPositions = null;
  let currentPositions = null;
  let particleCount = 0;
  let positionAttribute = null;

  // 4. Mouse Tracking, Dynamic Velocity Radius & Raycasting
  const mouse3D = new THREE.Vector3(9999, 9999, 0);
  const raycaster = new THREE.Raycaster();
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const pointer = new THREE.Vector2();
  let targetRotX = 0;
  let targetRotY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  // Velocity-based radius: small cursor-sized (~0.18) when slow, expanding up to 1.15 on fast movement
  const baseDispersalRadius = 0.18;
  const maxDispersalRadius = 1.15;
  let targetDispersalRadius = baseDispersalRadius;
  let currentDispersalRadius = baseDispersalRadius;
  let lastPointerTime = performance.now();
  let lastClientX = 0;
  let lastClientY = 0;

  // Scroll rotation (0 to 360 degrees / Math.PI * 2)
  const scrollRotation = { y: 0 };

  function onPointerMove(e) {
    const now = performance.now();
    const dt = Math.max(now - lastPointerTime, 8);
    const dx = e.clientX - lastClientX;
    const dy = e.clientY - lastClientY;
    const speedPxPerMs = Math.hypot(dx, dy) / dt;

    lastClientX = e.clientX;
    lastClientY = e.clientY;
    lastPointerTime = now;

    // Velocity boost
    const velocityBoost = Math.min(Math.max((speedPxPerMs - 0.15) * 0.48, 0), maxDispersalRadius - baseDispersalRadius);
    targetDispersalRadius = baseDispersalRadius + velocityBoost;

    const rect = container.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    targetRotY = pointer.x * 0.38;
    targetRotX = -pointer.y * 0.38;

    raycaster.setFromCamera(pointer, camera);
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, intersect);
    if (intersect) {
      cursorLight.position.set(intersect.x, intersect.y, 1.5);
      cursorLight.distance = Math.max(currentDispersalRadius * 4.5, 3.0);
      mouse3D.x = intersect.x - logoGroup.position.x;
      mouse3D.y = intersect.y - logoGroup.position.y;
      mouse3D.z = intersect.z - logoGroup.position.z;
    }
  }

  function onPointerLeave() {
    mouse3D.set(9999, 9999, 0);
    targetRotX = 0;
    targetRotY = 0;
    targetDispersalRadius = baseDispersalRadius;
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  container.addEventListener('pointerleave', onPointerLeave);

  // 5. Circular Particle Glow Texture
  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.5, 'rgba(210, 230, 255, 0.45)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  // 6. Load GLTF & Extract Contours
  const LoaderConstructor = GLTFLoader || (typeof window !== 'undefined' && (window.GLTFLoader || (window.THREE && window.THREE.GLTFLoader)));
  if (!LoaderConstructor) {
    console.error('[ax07] THREE.GLTFLoader not found. Include GLTFLoader script.');
    return;
  }

  const loader = new LoaderConstructor();
  loader.load(modelUrl, (gltf) => {
    meshAsset = gltf.scene;

    // Center & scale 3D asset
    const bbox = new THREE.Box3().setFromObject(meshAsset);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
    const scale = 2.8 / maxDim;

    const pivot = new THREE.Group();
    meshAsset.position.sub(center);
    pivot.add(meshAsset);
    pivot.scale.set(scale, scale, scale);
    logoGroup.add(pivot);

    // Apply materials
    meshAsset.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.metalness = 0.88;
        child.material.roughness = 0.22;
      }
    });

    // Extract contour points while excluding backplate (Normal Z < -0.05) to keep gaps hollow
    const points = [];
    meshAsset.traverse((child) => {
      if (child.isMesh && child.geometry && child.geometry.attributes.position) {
        child.updateMatrixWorld(true);
        const pos = child.geometry.attributes.position;
        const norm = child.geometry.attributes.normal;
        const matrix = child.matrixWorld;
        const v = new THREE.Vector3();
        const stride = pos.count > 50000 ? Math.ceil(pos.count / 45000) : 1;

        for (let i = 0; i < pos.count; i += stride) {
          if (norm && norm.getZ(i) < -0.05) continue; // skip backplate
          v.fromBufferAttribute(pos, i).applyMatrix4(matrix);
          points.push(v.x, v.y, v.z);
        }
      }
    });

    particleCount = points.length / 3;
    const rawGeo = new THREE.BufferGeometry();
    rawGeo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    rawGeo.computeBoundingBox();
    rawGeo.center();

    const pBbox = rawGeo.boundingBox;
    const pScale = 2.8 / Math.max(pBbox.max.x - pBbox.min.x, pBbox.max.y - pBbox.min.y);
    rawGeo.scale(pScale, pScale, pScale);

    const centeredArr = rawGeo.attributes.position.array;
    originalPositions = new Float32Array(centeredArr.length);
    currentPositions = new Float32Array(centeredArr.length);

    for (let i = 0; i < centeredArr.length; i += 3) {
      originalPositions[i] = centeredArr[i];
      originalPositions[i + 1] = centeredArr[i + 1];
      originalPositions[i + 2] = centeredArr[i + 2] + 0.02; // hover slightly on front face
      currentPositions[i] = originalPositions[i];
      currentPositions[i + 1] = originalPositions[i + 1];
      currentPositions[i + 2] = originalPositions[i + 2];
    }

    const pGeo = new THREE.BufferGeometry();
    positionAttribute = new THREE.BufferAttribute(currentPositions, 3);
    pGeo.setAttribute('position', positionAttribute);

    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.038,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    particles = new THREE.Points(pGeo, pMat);
    logoGroup.add(particles);

    // Apply mode visibility
    if (mode === 'particles') {
      meshAsset.visible = false;
    } else if (mode === 'mesh') {
      particles.visible = false;
    }

    // 7. ScrollTrigger Animation
    const activeGsap = _gsap || (typeof window !== 'undefined' && window.gsap);
    const activeScrollTrigger = _ScrollTrigger || (typeof window !== 'undefined' && window.ScrollTrigger);

    if (scrollTriggerEl && activeGsap && activeScrollTrigger) {
      const tl = activeGsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.0,
          invalidateOnRefresh: true,
        },
      });

      // The 3-Beat Motion Choreography:
      // Beat 1 (0% - 30%): Logo Centered, 360 rotation begins
      // Beat 2 (30% - 70%): Logo shifts LEFT (x: -1.15), leaves space for copy on the right
      // Beat 3 (70% - 100%): Logo re-centers, camera zooms through particles (z: 0.9)
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
      const leftShiftX = isDesktop ? -1.15 : -0.25;

      // 1. Continuous smooth 360-degree rotation across 0% -> 100%
      tl.to(scrollRotation, { y: Math.PI * 2, duration: 1.0, ease: 'none' }, 0);

      // 2. Beat 2: Shift to left side at ~28%-32%
      tl.to(logoGroup.position, {
        x: leftShiftX,
        y: 0,
        duration: 0.22,
        ease: 'power2.inOut',
      }, 0.28);

      // 3. Beat 3: Re-center & Camera zoom-through at ~68%-100%
      tl.to(logoGroup.position, {
        x: 0,
        y: 0,
        duration: 0.22,
        ease: 'power2.inOut',
      }, 0.68)
      .to(camera.position, {
        z: 0.9,
        duration: 0.30,
        ease: 'power2.in',
      }, 0.70);

      activeScrollTrigger.refresh();
    }

    onLoad({ meshAsset, particles, logoGroup, camera, scene });
  });

  // 8. Physics & Render Loop
  let animId = null;

  function animate() {
    animId = requestAnimationFrame(animate);

    // Decay target radius back to small cursor size if stationary
    const timeSinceMove = performance.now() - lastPointerTime;
    if (timeSinceMove > 50) {
      targetDispersalRadius += (baseDispersalRadius - targetDispersalRadius) * 0.08;
    }

    // Smoothly interpolate current dispersal radius
    currentDispersalRadius += (targetDispersalRadius - currentDispersalRadius) * 0.12;
    const dynamicRadiusSq = currentDispersalRadius * currentDispersalRadius;

    // Smooth tilt
    currentTiltY += (targetRotY - currentTiltY) * 0.08;
    currentTiltX += (targetRotX - currentTiltX) * 0.08;

    // Continuous smooth rotation if autoRotate is true and no scrollTrigger
    if (autoRotate && !scrollTriggerEl) {
      scrollRotation.y += 0.006;
    }

    // Combine 360-degree scroll rotation with mouse tilt
    logoGroup.rotation.y = scrollRotation.y + currentTiltY;
    logoGroup.rotation.x = currentTiltX;

    // Dispersal and smooth lerp return
    if (particles && particles.visible && positionAttribute) {
      const mx = mouse3D.x, my = mouse3D.y, mz = mouse3D.z;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const px = currentPositions[idx];
        const py = currentPositions[idx + 1];
        const pz = currentPositions[idx + 2];

        const dx = px - mx, dy = py - my, dz = pz - mz;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < dynamicRadiusSq && distSq > 0.00001) {
          const dist = Math.sqrt(distSq);
          const force = (currentDispersalRadius - dist) / currentDispersalRadius;
          const push = force * (0.12 + (currentDispersalRadius / maxDispersalRadius) * 0.10);
          currentPositions[idx] += (dx / dist) * push;
          currentPositions[idx + 1] += (dy / dist) * push;
          currentPositions[idx + 2] += (dz / dist) * push;
        } else {
          currentPositions[idx] += (originalPositions[idx] - px) * returnLerp;
          currentPositions[idx + 1] += (originalPositions[idx + 1] - py) * returnLerp;
          currentPositions[idx + 2] += (originalPositions[idx + 2] - pz) * returnLerp;
        }
      }
      positionAttribute.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  function onResize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  window.addEventListener('resize', onResize);

  return {
    destroy: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
    setMode: (newMode) => {
      if (meshAsset) meshAsset.visible = newMode !== 'particles';
      if (particles) particles.visible = newMode !== 'mesh';
    },
    logoGroup,
    camera,
    scene,
  };
}
