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
    theme = (typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'),
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
  renderer.domElement.style.touchAction = 'pan-y';
  container.style.touchAction = 'pan-y';
  container.appendChild(renderer.domElement);

  // 2. Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(5, 6, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
  fillLight.position.set(-5, 3, 4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
  rimLight.position.set(0, -5, -3);
  scene.add(rimLight);

  const cursorLight = new THREE.PointLight(0xffffff, 2.0, 6.0);
  cursorLight.position.set(0, 0, 2);
  scene.add(cursorLight);

  // 3. Hierarchy & Physics Arrays
  const logoGroup = new THREE.Group();
  scene.add(logoGroup);

  // Responsive scale & position:
  // Desktop: Prominent, elegant display size (1.30) filling the hero viewport with architectural luxury.
  // Mobile: Scaled down (~40% smaller) at 0.58, with Y-position shifted upward (+0.58) so the "X" shape sits higher
  // up behind the main headline, leaving the descriptive paragraph underneath completely clear.
  const isMobileInitial = typeof window !== 'undefined' && window.innerWidth < 768;
  const initialBaseScale = isMobileInitial ? 0.58 : 1.30;
  const initialBaseY = isMobileInitial ? 0.58 : 0.08;
  logoGroup.position.set(0, initialBaseY, 0);
  logoGroup.scale.set(initialBaseScale, initialBaseScale, initialBaseScale);

  let meshAsset = null;
  let pivot = null;
  let particles = null;
  let currentMode = mode || 'hybrid';
  let currentTheme = theme;
  let originalPositions = null;
  let currentPositions = null;
  let particleCount = 0;
  let positionAttribute = null;

  // Master opacity multiplier to allow smooth fade out to 0 on zoom-in
  const assetOpacity = { value: 1.0 };

  function updateAssetOpacities() {
    const isDark = currentTheme === 'dark';
    const baseMeshOp = isDark ? 0.20 : 0.16;
    const basePartOp = isDark ? 0.25 : 0.20;
    const currentVal = assetOpacity.value;

    if (meshAsset) {
      meshAsset.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.opacity = baseMeshOp * currentVal;
          child.visible = currentVal > 0.002;
        }
      });
    }

    if (particles && particles.material) {
      particles.material.opacity = basePartOp * currentVal;
      particles.visible = currentVal > 0.002;
    }
  }

  function applyTheme(isDark) {
    currentTheme = isDark ? 'dark' : 'light';
    // User request:
    // Color: Icy off-white / very soft blue-tinted gray (#E2E8F0 in light, #CBD5E1 in dark)
    const meshColor = new THREE.Color(isDark ? 0xcbd5e1 : 0xe2e8f0);

    if (meshAsset) {
      meshAsset.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.color = meshColor;
          child.material.transparent = true;
          child.material.metalness = isDark ? 0.45 : 0.10;
          child.material.roughness = isDark ? 0.35 : 0.55;
          child.material.depthWrite = false;
          child.material.needsUpdate = true;
        }
      });
    }

    if (particles && particles.material) {
      particles.material.transparent = true;
      particles.material.depthWrite = false;
      if (isDark) {
        particles.material.color = new THREE.Color(0xf1f5f9);
        particles.material.blending = THREE.AdditiveBlending;
        particles.material.size = 0.038;
      } else {
        // Soft stippled watermark with clean subtle visibility on bright canvas
        particles.material.color = new THREE.Color(0x64748b);
        particles.material.blending = THREE.NormalBlending;
        particles.material.size = 0.040;
      }
      particles.material.needsUpdate = true;
    }

    updateAssetOpacities();

    if (keyLight && fillLight && rimLight && ambientLight) {
      if (isDark) {
        ambientLight.intensity = 1.0;
        keyLight.color.setHex(0xffffff);
        fillLight.color.setHex(0x88ccee);
        keyLight.intensity = 2.2;
        fillLight.intensity = 1.4;
        rimLight.intensity = 1.8;
      } else {
        ambientLight.intensity = 1.4;
        keyLight.color.setHex(0xffffff);
        fillLight.color.setHex(0xe0f2fe);
        keyLight.intensity = 1.5;
        fillLight.intensity = 1.2;
        rimLight.intensity = 0.5;
      }
    }
  }

  let themeObserver = null;
  if (typeof window !== 'undefined' && window.MutationObserver) {
    themeObserver = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  }

  function updateModeVisibility(targetMode) {
    const showMesh = targetMode === 'hybrid' || targetMode === 'mesh';
    const showParticles = targetMode === 'hybrid' || targetMode === 'particles';
    if (meshAsset) {
      meshAsset.visible = showMesh;
      meshAsset.traverse((child) => {
        if (child.isMesh) child.visible = showMesh;
      });
    }
    if (pivot) pivot.visible = showMesh;
    if (particles) particles.visible = showParticles;
  }

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

  // Mobile Touch Finger Tracking
  function onTouchStart(e) {
    if (e.touches && e.touches[0]) {
      onPointerMove({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      });
    }
  }

  function onTouchMove(e) {
    if (e.touches && e.touches[0]) {
      onPointerMove({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      });
    }
  }

  function onTouchEnd() {
    onPointerLeave();
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  container.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });

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

    pivot = new THREE.Group();
    meshAsset.position.sub(center);
    pivot.add(meshAsset);
    pivot.scale.set(scale, scale, scale);
    logoGroup.add(pivot);

    // Apply materials: Invert/lighten asset to frosted glass icy off-white (#E2E8F0) and lower opacity to 0.16 subtle watermark
    const isDarkInit = currentTheme === 'dark';
    meshAsset.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = isDarkInit ? 0.20 : 0.16;
        child.material.depthWrite = false;
        child.material.color = new THREE.Color(isDarkInit ? 0xcbd5e1 : 0xe2e8f0);
        child.material.metalness = isDarkInit ? 0.45 : 0.10;
        child.material.roughness = isDarkInit ? 0.35 : 0.55;
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
      color: isDarkInit ? 0xf1f5f9 : 0x64748b,
      size: isDarkInit ? 0.038 : 0.040,
      map: createParticleTexture(),
      transparent: true,
      opacity: isDarkInit ? 0.25 : 0.20,
      blending: isDarkInit ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    particles = new THREE.Points(pGeo, pMat);
    logoGroup.add(particles);

    // Apply theme & mode visibility
    applyTheme(isDarkInit);
    updateModeVisibility(currentMode);

    // 7. ScrollTrigger Animation
    const activeGsap = _gsap || (typeof window !== 'undefined' && window.gsap);
    const activeScrollTrigger = _ScrollTrigger || (typeof window !== 'undefined' && window.ScrollTrigger);

    if (scrollTriggerEl && activeGsap && activeScrollTrigger) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      // On mobile, scrub: 0.15 makes the 3D model track swipe gestures immediately without delay
      const scrubSpeed = isMobile ? 0.15 : 0.4;

      const tl = activeGsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: scrubSpeed,
          invalidateOnRefresh: true,
        },
      });

      // Desktop: Prominent 1.30 base scale, shifts clearly to left (-1.65) during Beat 2
      // Mobile: Compact 0.58 scale, shifted up (+0.58) behind headline
      const baseScale = isMobile ? 0.58 : 1.30;
      const baseY = isMobile ? 0.58 : 0.08;
      const leftShiftX = isMobile ? 0 : -1.65;
      const shiftY = isMobile ? 0.88 : 0.0;
      const beat2Scale = isMobile ? 0.55 : 1.15;

      // Ensure starting position & scale & reset opacity
      logoGroup.position.set(0, baseY, 0);
      logoGroup.scale.set(baseScale, baseScale, baseScale);
      camera.position.set(0, 0, 4.5);
      assetOpacity.value = 1.0;
      updateAssetOpacities();

      // 1. Continuous smooth 360-degree rotation across 0% -> 100%
      tl.to(scrollRotation, { y: Math.PI * 2, duration: 1.0, ease: 'none' }, 0);

      // 2. Beat 2: Shift to the left on desktop (-1.65) between ~18% and ~34%
      // Ensures the 3D asset is already framing the left side when Beat 2 card fades in!
      tl.to(logoGroup.position, {
        x: leftShiftX,
        y: shiftY,
        duration: 0.16,
        ease: 'power2.inOut',
      }, 0.18)
      .to(logoGroup.scale, {
        x: beat2Scale,
        y: beat2Scale,
        z: beat2Scale,
        duration: 0.16,
        ease: 'power2.inOut',
      }, 0.18);

      // 3. Beat 3: Re-center & progressive zoom-in on each scroll until passing to next section
      // Smoothly re-center horizontally between 0.62 and 0.70
      tl.to(logoGroup.position, {
        x: 0,
        y: isMobile ? 0.18 : 0.0,
        duration: 0.08,
        ease: 'power1.inOut',
      }, 0.62);

      // Zoom in camera continuously through the logo on every scroll tick from 0.66 all the way to 1.00
      tl.to(camera.position, {
        z: 0.25,
        duration: 0.34,
        ease: 'none',
      }, 0.66);

      // Expand logo scale continuously on every scroll tick from 0.66 all the way to 1.00
      tl.to(logoGroup.scale, {
        x: isMobile ? 3.2 : 6.0,
        y: isMobile ? 3.2 : 6.0,
        z: isMobile ? 3.2 : 6.0,
        duration: 0.34,
        ease: 'none',
      }, 0.66);

      // Smoothly fade out to 0 at the very end of the zoom right as user scrolls into the next section (0.91 -> 1.00)
      tl.to(assetOpacity, {
        value: 0,
        duration: 0.09,
        ease: 'power2.in',
        onUpdate: () => {
          updateAssetOpacities();
        },
      }, 0.91);

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

  // Resize handler: ignore vertical address-bar jitter on mobile
  let lastResizeWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  function onResize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const widthChanged = Math.abs(w - lastResizeWidth) > 10;
    lastResizeWidth = w;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (widthChanged && window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }
  window.addEventListener('resize', onResize);

  return {
    destroy: () => {
      cancelAnimationFrame(animId);
      if (themeObserver) {
        themeObserver.disconnect();
      }
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
    setTheme: (newTheme) => {
      applyTheme(newTheme === 'dark');
    },
    setMode: (newMode) => {
      currentMode = newMode;
      updateModeVisibility(newMode);
    },
    logoGroup,
    camera,
    scene,
  };
}
