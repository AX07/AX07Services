import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LogoCanvas } from './LogoCanvas';
import { useApp } from '../context/ThemeLanguageContext';
import etherealBackdrop from '../assets/images/ethereal_hero_backdrop.jpg';

export interface LockscreenProps {
  onUnlock: () => void;
}

// 0.5s minimum to reject accidental taps/mistakes, 3.0s maximum for auto-unlock
const MIN_INTERACTION_MS = 500;
const MAX_INTERACTION_MS = 3000;

export function Lockscreen({ onUnlock }: LockscreenProps) {
  const { lang, theme } = useApp();
  const isPt = lang === 'pt';

  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const [sessionMs, setSessionMs] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showTooShortAlert, setShowTooShortAlert] = useState(false);

  const isPointerDownRef = useRef(false);
  const isHoverMovingRef = useRef(false);
  const interactionStartRef = useRef<number>(0);
  const hoverCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const isUnlockingRef = useRef(false);

  // Suggestion Animation & 3D Interactive Driving Refs
  const suggestionFingerRef = useRef<HTMLDivElement>(null);
  const suggestionRippleRef = useRef<HTMLDivElement>(null);
  const suggestionRafRef = useRef<number | null>(null);
  const [suggestionPathData, setSuggestionPathData] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    ctrlX: 0,
    ctrlY: 0,
    pathString: '',
  });

  // Lock body scroll while lockscreen is mounted
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (hoverCheckTimeoutRef.current) clearTimeout(hoverCheckTimeoutRef.current);
      if (suggestionRafRef.current) cancelAnimationFrame(suggestionRafRef.current);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ax07-simulated-pointer', { detail: { active: false } }));
      }
    };
  }, []);

  // When 3D asset finishes loading, show the suggestion after a gentle settling buffer
  const handle3DLoad = () => {
    setIs3DLoaded(true);
    setTimeout(() => {
      if (!isUnlockingRef.current && interactionStartRef.current === 0) {
        setShowSuggestion(true);
      }
    }, 400);
  };

  // Graceful fallback to guarantee 3D loaded state if onLoad takes longer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIs3DLoaded((prev) => {
        if (!prev) {
          setTimeout(() => {
            if (!isUnlockingRef.current && interactionStartRef.current === 0) {
              setShowSuggestion(true);
            }
          }, 400);
          return true;
        }
        return prev;
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const triggerUnlock = () => {
    if (isUnlockingRef.current) return;
    isUnlockingRef.current = true;
    setIsUnlocking(true);
    setShowSuggestion(false);
    setSessionMs(MAX_INTERACTION_MS);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ax07-explode-3d', { detail: { intensity: 1.5 } }));
    }

    setTimeout(() => {
      onUnlock();
    }, 950);
  };

  // Called whenever the user starts or is actively performing an interaction
  const handleUserActivity = () => {
    if (isUnlockingRef.current) return;

    // Immediately hide the suggestion upon real user interaction
    setShowSuggestion(false);

    // Cancel pending idle suggestion timer while user is active
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  // Called whenever user interaction ceases without unlocking: starts 3s idle timer
  const scheduleSuggestionAfterIdle = () => {
    if (isUnlockingRef.current) return;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // After 3 seconds of no interaction, the suggestion appears again!
    idleTimerRef.current = setTimeout(() => {
      if (!isUnlockingRef.current && interactionStartRef.current === 0) {
        setShowSuggestion(true);
      }
    }, 3000);
  };

  const startInteraction = () => {
    if (isUnlockingRef.current) return;
    handleUserActivity();
    setIsInteracting(true);
    setShowTooShortAlert(false);

    if (interactionStartRef.current === 0) {
      interactionStartRef.current = performance.now();
    }
  };

  const endInteraction = () => {
    if (isUnlockingRef.current) return;
    setIsInteracting(false);
    isPointerDownRef.current = false;
    isHoverMovingRef.current = false;

    if (interactionStartRef.current === 0) {
      scheduleSuggestionAfterIdle();
      return;
    }

    const duration = performance.now() - interactionStartRef.current;
    interactionStartRef.current = 0;

    if (duration >= MIN_INTERACTION_MS) {
      // Satisfied >= 0.5s requirement -> UNLOCK!
      triggerUnlock();
    } else {
      // Shorter than 0.5s -> Accidental tap or brush blocked!
      setShowTooShortAlert(true);
      setSessionMs(0);
      setTimeout(() => {
        setShowTooShortAlert(false);
      }, 1800);

      // Start the 3-second countdown to show the suggestion again
      scheduleSuggestionAfterIdle();
    }
  };

  // Active interaction tick loop
  useEffect(() => {
    const tick = () => {
      if (isUnlockingRef.current) return;

      if ((isPointerDownRef.current || isHoverMovingRef.current) && interactionStartRef.current > 0) {
        const elapsed = performance.now() - interactionStartRef.current;
        setSessionMs(Math.min(elapsed, MAX_INTERACTION_MS));

        // Auto-unlock immediately upon reaching maximum 3.0s threshold
        if (elapsed >= MAX_INTERACTION_MS) {
          triggerUnlock();
          return;
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Desktop hover tracking: continuous mouse scrubs over 3D model also count
  const handlePointerMove = () => {
    if (isUnlockingRef.current) return;
    handleUserActivity();

    if (isPointerDownRef.current) {
      // Pointer is pressed down, continuous hold loop is handling it
      return;
    }

    // Moving mouse over the canvas without holding button
    isHoverMovingRef.current = true;
    startInteraction();

    if (hoverCheckTimeoutRef.current) {
      clearTimeout(hoverCheckTimeoutRef.current);
    }

    // If mouse becomes stationary for > 380ms, evaluate interaction
    hoverCheckTimeoutRef.current = setTimeout(() => {
      if (!isPointerDownRef.current) {
        endInteraction();
      }
    }, 380);
  };

  // Active Suggestion Loop: Drives simulated user interaction with real 3D particles & tilt
  useEffect(() => {
    if (!showSuggestion || !is3DLoaded || isUnlocking) {
      if (suggestionRafRef.current) {
        cancelAnimationFrame(suggestionRafRef.current);
        suggestionRafRef.current = null;
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ax07-simulated-pointer', { detail: { active: false } }));
      }
      return;
    }

    const calcGeometry = () => {
      const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const cX = W / 2;
      // In logo3D.js: logoGroup.position.set(0, isMobile ? 0.42 : 0.08, 0)
      const cY = H / 2 - (isMobileScreen ? H * 0.09 : H * 0.02);

      const rx = isMobileScreen ? Math.min(105, W * 0.28) : 135;
      const ry = isMobileScreen ? Math.min(90, H * 0.16) : 115;

      const sX = cX - rx;
      const sY = cY + ry;
      const eX = cX + rx;
      const eY = cY - ry;
      const ctlX = cX - rx * 0.15;
      const ctlY = cY - ry * 0.10;

      return {
        isMobileScreen,
        W,
        H,
        cX,
        cY,
        startX: sX,
        startY: sY,
        endX: eX,
        endY: eY,
        ctrlX: ctlX,
        ctrlY: ctlY,
        pathString: `M ${sX} ${sY} Q ${ctlX} ${ctlY} ${eX} ${eY}`,
      };
    };

    const geom = calcGeometry();
    setSuggestionPathData(geom);

    let startTime = performance.now();
    let wasActive = false;

    const animateSuggestion = (now: number) => {
      const elapsed = now - startTime;
      const CYCLE_MS = 2500;
      const cycleProgress = (elapsed % CYCLE_MS) / CYCLE_MS;

      const currentGeom = calcGeometry();
      const { startX, startY, endX, endY, ctrlX, ctrlY, isMobileScreen } = currentGeom;

      let fingerX = startX;
      let fingerY = startY;
      let fingerOpacity = 0;
      let fingerScale = 0.8;
      let rippleScale = 0.6;
      let rippleOpacity = 0;
      let isActivePointer = false;

      // Phase 1: Touchdown on 3D asset (0.00 to 0.15, ~375ms)
      if (cycleProgress < 0.15) {
        const p1 = cycleProgress / 0.15;
        fingerX = startX;
        fingerY = startY;
        fingerOpacity = Math.min(1, p1 * 2.2);
        fingerScale = 0.8 + 0.22 * p1;
        rippleScale = 0.6 + p1 * 1.5;
        rippleOpacity = Math.max(0, (1 - p1) * 0.95);
        isActivePointer = p1 > 0.35;
      }
      // Phase 2: Active Drag across 3D model contours (0.15 to 0.72, ~1425ms)
      else if (cycleProgress < 0.72) {
        const p2 = (cycleProgress - 0.15) / (0.72 - 0.15);
        // Smooth ease-in-out quadratic curve
        const t = p2 < 0.5 ? 2 * p2 * p2 : -1 + (4 - 2 * p2) * p2;
        fingerX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX;
        fingerY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY;
        fingerOpacity = 1;
        fingerScale = 1.0;
        rippleOpacity = 0;
        isActivePointer = true;
      }
      // Phase 3: Lift-off and fade (0.72 to 0.85, ~325ms)
      else if (cycleProgress < 0.85) {
        const p3 = (cycleProgress - 0.72) / (0.85 - 0.72);
        fingerX = endX;
        fingerY = endY;
        fingerOpacity = Math.max(0, 1 - p3);
        fingerScale = 1.0 - 0.2 * p3;
        rippleOpacity = 0;
        isActivePointer = false;
      }
      // Phase 4: Rest pause before next cycle (0.85 to 1.00, ~375ms)
      else {
        fingerOpacity = 0;
        isActivePointer = false;
      }

      // Update simulated finger DOM elements with buttery GPU transforms
      if (suggestionFingerRef.current) {
        suggestionFingerRef.current.style.transform = `translate3d(${fingerX}px, ${fingerY}px, 0px) scale(${fingerScale})`;
        suggestionFingerRef.current.style.opacity = `${fingerOpacity}`;
      }
      if (suggestionRippleRef.current) {
        suggestionRippleRef.current.style.transform = `translate3d(${startX}px, ${startY}px, 0px) scale(${rippleScale})`;
        suggestionRippleRef.current.style.opacity = `${rippleOpacity}`;
      }

      // Dispatch simulated pointer coordinates to the 3D engine so particles & lights interact
      if (typeof window !== 'undefined') {
        if (isActivePointer) {
          wasActive = true;
          window.dispatchEvent(
            new CustomEvent('ax07-simulated-pointer', {
              detail: {
                active: true,
                clientX: fingerX,
                clientY: fingerY,
                radius: isMobileScreen ? 0.95 : 0.60,
              },
            })
          );
        } else if (wasActive) {
          wasActive = false;
          window.dispatchEvent(new CustomEvent('ax07-simulated-pointer', { detail: { active: false } }));
        }
      }

      suggestionRafRef.current = requestAnimationFrame(animateSuggestion);
    };

    suggestionRafRef.current = requestAnimationFrame(animateSuggestion);

    return () => {
      if (suggestionRafRef.current) {
        cancelAnimationFrame(suggestionRafRef.current);
        suggestionRafRef.current = null;
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ax07-simulated-pointer', { detail: { active: false } }));
      }
    };
  }, [showSuggestion, is3DLoaded, isUnlocking]);

  const progressPct = Math.min(100, (sessionMs / MAX_INTERACTION_MS) * 100);
  const minThresholdPct = (MIN_INTERACTION_MS / MAX_INTERACTION_MS) * 100; // 33.3%
  const isReadyToUnlock = sessionMs >= MIN_INTERACTION_MS;
  const currentSecondsFormatted = (Math.min(sessionMs, MAX_INTERACTION_MS) / 1000).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={
        isUnlocking
          ? { opacity: 0, scale: 1.08, filter: 'blur(20px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(24px)' }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 w-screen h-screen h-[100dvh] overflow-hidden bg-zinc-50 dark:bg-[#070709] text-zinc-900 dark:text-white flex flex-col justify-between items-center select-none transition-colors duration-300"
      onPointerDown={() => {
        isPointerDownRef.current = true;
        startInteraction();
      }}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
      onPointerMove={handlePointerMove}
      onTouchStart={() => {
        isPointerDownRef.current = true;
        startInteraction();
      }}
      onTouchEnd={endInteraction}
      onTouchCancel={endInteraction}
      onTouchMove={startInteraction}
    >
      {/* Ambient Abstract Ethereal Glow Backdrop */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src={etherealBackdrop}
          alt="Ethereal Lockscreen Backdrop"
          className="w-full h-full object-cover object-center opacity-65 dark:opacity-30 blur-xl scale-105 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/75 via-zinc-50/25 to-zinc-50/85 dark:from-[#070709]/80 dark:via-[#070709]/40 dark:to-[#070709]/90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Standalone Interactive 3D Logo Canvas (Pristine, non-disrupted physics) */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto touch-none">
        <LogoCanvas
          modelUrl="/logo.glb"
          defaultMode="particles"
          showControls={false}
          autoRotate={false}
          onLoad={handle3DLoad}
          onInteract={startInteraction}
          className="w-full h-full"
        />
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* REALISTIC USER TOUCH SUGGESTION WITH LIVE 3D ASSET INTERACTION         */}
      {/* Appears after 3D loads, disappears on interaction, reappears after 3s   */}
      {/* ----------------------------------------------------------------------- */}
      <AnimatePresence>
        {is3DLoaded && showSuggestion && !isUnlocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 z-25 pointer-events-none select-none overflow-hidden"
          >
            {/* Fullscreen SVG with Curved Guide Path */}
            {suggestionPathData.pathString && (
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="touchGuideGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                    <stop offset="40%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="75%" stopColor="#0284c7" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="touchGuideGradientDark" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="45%" stopColor="#10b981" stopOpacity="0.6" />
                    <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Subtle dashed curved arc */}
                <path
                  d={suggestionPathData.pathString}
                  fill="none"
                  stroke="currentColor"
                  className="text-zinc-400/40 dark:text-white/20"
                  strokeWidth="2"
                  strokeDasharray="5 7"
                />

                {/* Animated glowing stream */}
                <motion.path
                  d={suggestionPathData.pathString}
                  fill="none"
                  stroke={theme === 'dark' ? "url(#touchGuideGradientDark)" : "url(#touchGuideGradient)"}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 1],
                    pathOffset: [0, 0, 1],
                    opacity: [0, 0.95, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: [0.22, 1, 0.36, 1],
                    repeat: Infinity,
                  }}
                />
              </svg>
            )}

            {/* Pulsing Touchdown Pressure Ring at Start Point */}
            <div
              ref={suggestionRippleRef}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-emerald-500/70 dark:border-emerald-400/80 bg-emerald-500/20 pointer-events-none will-change-transform"
              style={{ opacity: 0 }}
            />

            {/* Simulated Tactile Finger sweeping across the 3D model */}
            <div
              ref={suggestionFingerRef}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 will-change-transform flex items-center justify-center"
              style={{ opacity: 0 }}
            >
              {/* Tactile Frosted Glass Touch Disc */}
              <div className="relative w-12 h-12 rounded-full border border-zinc-300/80 dark:border-white/60 bg-white/80 dark:bg-white/20 backdrop-blur-md shadow-[0_4px_20px_rgba(16,185,129,0.35)] dark:shadow-[0_0_25px_rgba(56,189,248,0.75)] flex items-center justify-center">
                {/* Glowing center contact dot */}
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_12px_#10b981] dark:shadow-[0_0_12px_#34d399]" />

                {/* Stylized realistic human index finger silhouette */}
                <div className="absolute -bottom-9 -right-6 pointer-events-none opacity-85 rotate-[15deg]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-zinc-800 dark:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                    <path
                      d="M14.5 10.5V5.5C14.5 4.12 13.38 3 12 3C10.62 3 9.5 4.12 9.5 5.5V12L8.2 11.1C7.3 10.4 6 10.6 5.3 11.5C4.7 12.3 4.8 13.4 5.6 14.1L10.5 19C11.5 20 12.8 20.5 14.2 20.5H16.5C18.4 20.5 20 18.9 20 17V13.5C20 12.1 18.9 11 17.5 11C17.1 11 16.7 11.1 16.4 11.3V10.5C16.4 9.1 15.3 8 13.9 8C13.4 8 13 8.1 12.7 8.4V5.5"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="currentColor"
                      className="fill-zinc-800/15 dark:fill-white/20"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Informative Micro-Badge positioned under the 3D model */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-[26%] sm:bottom-[28%] px-4 py-1.5 rounded-full border border-zinc-200/90 dark:border-white/10 bg-white/90 dark:bg-black/65 backdrop-blur-xl text-[10px] font-mono tracking-widest uppercase text-zinc-700 dark:text-white/85 flex items-center gap-2 shadow-lg dark:shadow-2xl"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>{isPt ? 'Toque e arraste o modelo 3D' : 'Touch and drag the 3D model'}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP: Ax07 Studio Title & Lock Status */}
      <div className="relative z-20 pt-10 sm:pt-14 px-6 flex flex-col items-center pointer-events-none select-none">
        {/* Status Pill */}
        <motion.div
          animate={
            isUnlocking 
              ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } 
              : isReadyToUnlock
                ? { scale: [1, 1.05, 1] }
                : {}
          }
          transition={{ duration: 0.5 }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-2xl shadow-lg dark:shadow-xl pointer-events-auto transition-colors duration-300 ${
            isReadyToUnlock
              ? 'border-emerald-500/60 bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'border-zinc-200/90 dark:border-white/15 bg-white/85 dark:bg-black/60 text-zinc-800 dark:text-white'
          }`}
        >
          {isUnlocking || isReadyToUnlock ? (
            <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.4]" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-zinc-700 dark:text-white/80 stroke-[2]" />
          )}
          <span className="text-[11px] font-mono tracking-widest uppercase font-semibold">
            {isUnlocking
              ? (isPt ? 'DESBLOQUEADO' : 'UNLOCKED')
              : isReadyToUnlock
                ? (isPt ? 'PRONTO • SOLTE PARA DESBLOQUEAR' : 'READY • RELEASE TO UNLOCK')
                : isInteracting
                  ? (isPt ? 'CONTINUE A INTERAGIR (MÍN 0.5s)' : 'KEEP INTERACTING (0.5s MIN)')
                  : (isPt ? 'INTERAJA 0.5s - 3s PARA ENTRAR' : 'INTERACT 0.5s - 3s TO UNLOCK')}
          </span>
        </motion.div>

        {/* Primary Title: Ax07 Studio */}
        <div className="mt-5 sm:mt-7 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-display drop-shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)]">
            Ax07 Studio
          </h1>
          <p className="mt-2 text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400 font-medium">
            {isPt ? 'Laboratório Digital & Design 3D' : 'Creative Tech & 3D Engineering'}
          </p>
        </div>
      </div>

      {/* CENTER: Explosive shockwave ring upon unlocking */}
      <AnimatePresence>
        {isUnlocking && (
          <motion.div
            initial={{ scale: 0.25, opacity: 1 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-emerald-500/80 bg-emerald-500/20 dark:border-emerald-400/90 dark:bg-emerald-500/25 blur-sm pointer-events-none z-20"
          />
        )}
      </AnimatePresence>

      {/* BOTTOM: Interaction Gauge (0.5s min, 3s max) & Guidance */}
      <div className="relative z-20 pb-10 sm:pb-14 px-6 w-full max-w-md flex flex-col items-center gap-3.5 pointer-events-none">
        
        {/* Accidental Tap Alert (Too short < 0.5s) */}
        <AnimatePresence>
          {showTooShortAlert && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              className="px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 backdrop-blur-xl text-amber-800 dark:text-amber-300 text-[11px] font-mono flex items-center gap-2 shadow-lg"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isPt ? 'Toque muito rápido • Mantenha por no mín. 0.5s' : 'Tap too quick • Hold & drag for at least 0.5s'}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dual-Zone Progress Gauge (0.5s Minimum Mark + 3.0s Auto-Unlock) */}
        <div className="w-full bg-white/85 dark:bg-black/75 backdrop-blur-2xl border border-zinc-200/90 dark:border-white/15 rounded-full p-2 sm:p-2.5 shadow-xl dark:shadow-2xl flex items-center gap-3 pointer-events-auto transition-colors duration-300">
          {/* Progress bar with 0.5s divider */}
          <div className="relative flex-1 h-3.5 sm:h-4 bg-zinc-200/80 dark:bg-white/10 rounded-full overflow-hidden mx-1.5 flex items-center">
            {/* 0.5s Threshold Tick Mark */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-zinc-400/70 dark:bg-white/40 z-10 pointer-events-none"
              style={{ left: `${minThresholdPct}%` }}
              title="0.5s minimum threshold"
            />

            {/* Dynamic Progress Fill */}
            <motion.div
              className={`h-full rounded-full transition-colors duration-200 ${
                isReadyToUnlock
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.7)]'
                  : 'bg-gradient-to-r from-zinc-400 to-zinc-600 dark:from-zinc-300 dark:to-white/90 shadow-[0_0_8px_rgba(0,0,0,0.15)] dark:shadow-[0_0_10px_rgba(255,255,255,0.4)]'
              }`}
              style={{ width: `${progressPct}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>

          {/* Time & State Counter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-mono font-bold min-w-[70px] text-right transition-colors ${
              isReadyToUnlock ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'
            }`}>
              {currentSecondsFormatted}s / {isReadyToUnlock ? '3.0s' : '0.5s'}
            </span>

            {/* Instant Skip button for accessibility */}
            <button
              type="button"
              onClick={triggerUnlock}
              className="px-3 py-1.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-bold text-[11px] font-mono uppercase tracking-wider active:scale-95 transition-all shadow-md cursor-pointer flex items-center gap-1"
              title="Skip lockscreen"
            >
              <Sparkles className="w-3 h-3 text-emerald-400 dark:text-emerald-600" />
              <span>{isPt ? 'Pular' : 'Skip'}</span>
            </button>
          </div>
        </div>

        {/* Tactile guidance prompts */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-zinc-600 dark:text-white/80 uppercase font-medium text-center">
          {isReadyToUnlock ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {isPt ? 'Pronto! Solte para desbloquear ou explore até 3s' : 'Ready! Release to unlock, or explore up to 3s'}
              </span>
            </>
          ) : isInteracting ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping shrink-0" />
              <span className="text-zinc-700 dark:text-white/90">{isPt ? 'A interagir... (mínimo de 0.5s)' : 'Interacting... (0.5s minimum)'}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 dark:bg-emerald-400/80 shrink-0" />
              <span>{isPt ? 'Interaja por 0.5s para desbloquear (máx 3s)' : 'Interact for 0.5s to unlock (max 3s)'}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Lockscreen;
