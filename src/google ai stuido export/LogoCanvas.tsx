import React, { useEffect, useRef } from 'react';
import { init3DLogo } from './logo3D.js';

export interface LogoCanvasProps {
  /**
   * The relative or absolute path to the .glb model
   * Defaults to './logo.glb'
   */
  modelUrl?: string;
  /**
   * DOM ID of the container that GSAP ScrollTrigger should track (e.g. a 200vh container)
   * Optional: if omitted, it stays stationary and interactive without scrolling.
   */
  scrollWrapperId?: string;
  /**
   * Visual display mode
   */
  mode?: 'hybrid' | 'particles' | 'mesh';
  /**
   * Additional Tailwind or CSS class names
   */
  className?: string;
}

/**
 * Drop-in React Component for ax07 3D Logo & Particle Physics
 */
export const LogoCanvas: React.FC<LogoCanvasProps> = ({
  modelUrl = '/logo.glb',
  scrollWrapperId,
  mode = 'hybrid',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ReturnType<typeof init3DLogo> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scrollTriggerEl = scrollWrapperId ? document.getElementById(scrollWrapperId) : null;

    controllerRef.current = init3DLogo({
      container: containerRef.current,
      scrollTriggerEl,
      modelUrl,
      mode,
    });

    return () => {
      if (controllerRef.current) {
        controllerRef.current.destroy();
      }
    };
  }, [modelUrl, scrollWrapperId]);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setMode(mode);
    }
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-screen pointer-events-auto ${className}`}
    />
  );
};

export default LogoCanvas;
