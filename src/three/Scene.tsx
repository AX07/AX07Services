import { Component, Suspense, useEffect, useRef, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ParticleLogo } from './ParticleLogo';
import { onSceneVisibility } from '../lib/scene-store';

/** Pauses the render loop entirely while the scene is scrolled out of view. */
function FrameloopGate() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => onSceneVisibility((visible) => setFrameloop(visible ? 'always' : 'never')), [setFrameloop]);
  return null;
}

/** Suspense doesn't catch failed loads: if the model can't load, the page simply carries on without it. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('[ax07] 3D scene unavailable:', error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Scene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Fade the canvas in once its first frame is ready (no spinner, no layout shift)
  const handleCreated = () => {
    requestAnimationFrame(() => wrapperRef.current?.classList.add('opacity-100'));
  };

  return (
    <div
      ref={wrapperRef}
      id="scene-canvas"
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-1000 ease-[var(--ease-out)]"
    >
      <SceneErrorBoundary>
        <Canvas
          dpr={[1, isMobile ? 1.5 : 1.75]}
          camera={{ position: [0, 0, 9], fov: 35 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          onCreated={handleCreated}
        >
          <FrameloopGate />
          <Suspense fallback={null}>
            <ParticleLogo count={isMobile ? 11000 : 22000} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
