import React, { useEffect, useRef, useState } from 'react';
import { init3DLogo } from '../google ai stuido export/logo3D.js';
import { Sparkles, Eye, Box, RotateCcw } from 'lucide-react';
import { useApp } from '../context/ThemeLanguageContext';

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
  const { theme } = useApp();
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
        theme,
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

  useEffect(() => {
    if (controllerRef.current && (controllerRef.current as any).setTheme) {
      (controllerRef.current as any).setTheme(theme);
    }
  }, [theme]);

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
        className="w-full h-full cursor-crosshair touch-pan-y select-none pointer-events-auto"
      />

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full border-2 border-zinc-400 dark:border-white/20 border-t-zinc-900 dark:border-t-white animate-spin mb-4" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-500 dark:text-zinc-400 uppercase animate-pulse">
            Synthesizing 3D Geometry &amp; Particles...
          </span>
        </div>
      )}

      {/* Floating Interactive 3D Mode Switcher (Bottom Right of Canvas) */}
      {showControls && isLoaded && (
        <div className="flex absolute bottom-5 right-4 sm:bottom-8 sm:right-8 z-40 items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl shadow-xl dark:shadow-2xl pointer-events-auto transition-colors duration-300">
          <button
            type="button"
            id="mode-btn-hybrid"
            onClick={(e) => {
              e.stopPropagation();
              handleModeChange('hybrid');
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider uppercase transition-all cursor-pointer select-none ${
              mode === 'hybrid'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10'
            }`}
            title="3D Metallic Mesh + Kinetic Contour Particles"
          >
            <Sparkles className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
            <span>Hybrid</span>
          </button>

          <button
            type="button"
            id="mode-btn-particles"
            onClick={(e) => {
              e.stopPropagation();
              handleModeChange('particles');
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider uppercase transition-all cursor-pointer select-none ${
              mode === 'particles'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10'
            }`}
            title="Kinetic Contour Particles Only"
          >
            <Eye className="w-3 h-3 text-sky-500 dark:text-sky-400" />
            <span>Particles</span>
          </button>

          <button
            type="button"
            id="mode-btn-mesh"
            onClick={(e) => {
              e.stopPropagation();
              handleModeChange('mesh');
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider uppercase transition-all cursor-pointer select-none ${
              mode === 'mesh'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10'
            }`}
            title="Metallic Reflective Geometry"
          >
            <Box className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span>Mesh</span>
          </button>
        </div>
      )}

      {/* Interactive HUD Hint (Bottom Left of Canvas) */}
      {showHint && isLoaded && (
        <div className="absolute bottom-8 left-8 z-30 hidden md:flex items-center gap-3 px-3.5 py-2 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-[#070708]/70 backdrop-blur-md text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pointer-events-none shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Move cursor to disperse particles &middot; Scroll down for 360&deg; spec</span>
        </div>
      )}
    </div>
  );
};

export default LogoCanvas;
