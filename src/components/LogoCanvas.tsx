import React, { useEffect, useRef, useState } from 'react';
import { init3DLogo } from '../google ai stuido export/logo3D.js';
import { Sparkles, Eye, Box, RotateCcw } from 'lucide-react';

export interface LogoCanvasProps {
  modelUrl?: string;
  scrollWrapperId?: string;
  defaultMode?: 'hybrid' | 'particles' | 'mesh';
  showControls?: boolean;
  showHint?: boolean;
  autoRotate?: boolean;
  canvasId?: string;
  className?: string;
}

export const LogoCanvas: React.FC<LogoCanvasProps> = ({
  modelUrl = '/logo.glb',
  scrollWrapperId,
  defaultMode = 'hybrid',
  showControls = true,
  showHint = true,
  autoRotate,
  canvasId = 'ax07-logo-canvas',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ReturnType<typeof init3DLogo> | null>(null);
  const [mode, setMode] = useState<'hybrid' | 'particles' | 'mesh'>(defaultMode);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;
    const scrollTriggerEl = scrollWrapperId ? document.getElementById(scrollWrapperId) : null;

    try {
      controllerRef.current = init3DLogo({
        container: containerRef.current,
        scrollTriggerEl,
        modelUrl,
        mode,
        autoRotate: autoRotate !== undefined ? autoRotate : !scrollTriggerEl,
        onLoad: () => {
          if (isMounted) setIsLoaded(true);
        },
      });
    } catch (err) {
      console.error('[ax07] Failed to initialize 3D Logo:', err);
    }

    return () => {
      isMounted = false;
      if (controllerRef.current) {
        controllerRef.current.destroy();
        controllerRef.current = null;
      }
    };
  }, [modelUrl, scrollWrapperId, autoRotate]);

  const handleModeChange = (newMode: 'hybrid' | 'particles' | 'mesh') => {
    setMode(newMode);
    if (controllerRef.current) {
      controllerRef.current.setMode(newMode);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        id={canvasId}
        className="w-full h-full cursor-crosshair"
      />

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase animate-pulse">
            Synthesizing 3D Geometry & Particles...
          </span>
        </div>
      )}

      {/* Floating Interactive 3D Mode Switcher (Bottom Right of Canvas) */}
      {showControls && isLoaded && (
        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-2 p-1.5 rounded-full border border-white/10 bg-[#070708]/80 backdrop-blur-xl shadow-2xl">
          <button
            id="mode-btn-hybrid"
            onClick={() => handleModeChange('hybrid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all ${
              mode === 'hybrid'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="3D Metallic Mesh + Kinetic Contour Particles"
          >
            <Sparkles className="w-3 h-3" />
            <span>Hybrid</span>
          </button>

          <button
            id="mode-btn-particles"
            onClick={() => handleModeChange('particles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all ${
              mode === 'particles'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Kinetic Contour Particles Only"
          >
            <Eye className="w-3 h-3" />
            <span>Particles</span>
          </button>

          <button
            id="mode-btn-mesh"
            onClick={() => handleModeChange('mesh')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all ${
              mode === 'mesh'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Metallic Reflective Geometry"
          >
            <Box className="w-3 h-3" />
            <span>Mesh</span>
          </button>
        </div>
      )}

      {/* Interactive HUD Hint (Bottom Left of Canvas) */}
      {showHint && isLoaded && (
        <div className="absolute bottom-8 left-8 z-30 hidden md:flex items-center gap-3 px-3.5 py-2 rounded-full border border-white/10 bg-[#070708]/70 backdrop-blur-md text-[11px] font-mono text-zinc-400 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Move cursor to blast particles &middot; Scroll down for 360&deg; rotation</span>
        </div>
      )}
    </div>
  );
};

export default LogoCanvas;
