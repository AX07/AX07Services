import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronDown, ChevronUp, MessageSquare, Sparkles } from 'lucide-react';
import { LogoCanvas } from './LogoCanvas';
import { appleGestures } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';
import { CountryContent } from '../lib/content';
import { BrandLogo } from './BrandLogo';
import etherealBackdrop from '../assets/images/ethereal_hero_backdrop.jpg';

export interface HeroProps {
  countryContent?: CountryContent;
}

// 5 Discrete Narrative Mobile Beat States
const MOBILE_BEAT_STATES = [
  { id: 0, progress: 0.00, label: '01 Identity' },
  { id: 1, progress: 0.22, label: '02 Motion & Top Bar' },
  { id: 2, progress: 0.50, label: '03 Invisible 180°' },
  { id: 3, progress: 0.78, label: '04 Zoom In & Conversion' },
  { id: 4, progress: 1.00, label: '05 Brands & Tools Banner' },
] as const;

export function Hero({ countryContent }: HeroProps = {}) {
  const { t, lang } = useApp();

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ["start start", "end end"]
  });

  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const [activeMobileState, setActiveMobileState] = useState<number>(0);
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(false);
  const [isWithinHero, setIsWithinHero] = useState<boolean>(true);

  const isAnimatingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchSwipedRef = useRef(false);

  const handle3DLoaded = () => {
    setIs3DLoaded(true);
  };

  useEffect(() => {
    // Graceful fallback to guarantee hero content fades in reliably after initial 3D load phase
    const timer = setTimeout(() => {
      setIs3DLoaded(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const heroSubtitle = countryContent?.heroSubtitle || t.hero.beat1.subtitle;
  const whatsappNumber = countryContent?.whatsappNumber || '353894419127';
  const badgeLocation = countryContent?.badgeLocation || t.hero.beat1.eyebrow;

  // Calculate target scroll coordinate for a specific mobile beat state
  const getTargetYForState = (stateIdx: number) => {
    if (!scrollTrackRef.current) return 0;
    const track = scrollTrackRef.current;
    const trackTop = track.offsetTop;
    const maxScroll = Math.max(track.offsetHeight - window.innerHeight, 100);
    const clamped = Math.max(0, Math.min(stateIdx, 4));

    if (clamped === 4) {
      // Settle where the hero section ends and the BrandTicker banner rests in view at the bottom (Screenshot 3)
      const bannerOffset = typeof window !== 'undefined' && window.innerWidth < 768 ? 165 : 185;
      return trackTop + maxScroll + bannerOffset;
    }
    return trackTop + MOBILE_BEAT_STATES[clamped].progress * maxScroll;
  };

  // Luxury Apple-style smooth scroll animator with easeInOutCubic physics
  const smoothScrollToTarget = (targetY: number, duration: number = 1100) => {
    if (typeof window === 'undefined') return;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    isAnimatingRef.current = true;
    const startTime = performance.now();

    // Gentle easeInOutCubic: soft start, steady rotational scrub, graceful landing
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      const currentY = startY + distance * eased;

      window.scrollTo(0, currentY);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        isAnimatingRef.current = false;
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  const goToMobileState = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx > 4) return;
    setShowSwipeHint(false);
    const targetY = getTargetYForState(targetIdx);
    smoothScrollToTarget(targetY, 1100);
    setActiveMobileState(targetIdx);
  };

  // Sync active mobile state with native or animated scroll progress
  useEffect(() => {
    const handleScrollSync = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (!scrollTrackRef.current) return;
      const track = scrollTrackRef.current;
      const trackTop = track.offsetTop;
      const maxScroll = Math.max(track.offsetHeight - window.innerHeight, 100);
      const bannerOffset = typeof window !== 'undefined' && window.innerWidth < 768 ? 165 : 185;

      const inside = scrollY >= trackTop - 30 && scrollY <= trackTop + maxScroll + bannerOffset + 40;
      setIsWithinHero(inside);

      if (inside) {
        if (scrollY >= trackTop + maxScroll + 50) {
          setActiveMobileState(4);
        } else {
          const progress = Math.max(0, Math.min(1, (scrollY - trackTop) / maxScroll));
          let closest = 0;
          let minDiff = 999;
          MOBILE_BEAT_STATES.forEach((beat) => {
            const diff = Math.abs(progress - beat.progress);
            if (diff < minDiff) {
              minDiff = diff;
              closest = beat.id;
            }
          });
          setActiveMobileState(closest);
        }
      }
    };

    handleScrollSync();
    window.addEventListener('scroll', handleScrollSync, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSync);
  }, []);

  // Show "Swipe up to explore 3D" gesture indicator after 3 seconds of inactivity at State 0
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const scrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset) : 0;

    if (activeMobileState === 0 && scrollY < 40) {
      timer = setTimeout(() => {
        setShowSwipeHint(true);
      }, 3000);
    } else {
      setShowSwipeHint(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [activeMobileState]);

  // Touch Swipe Gesture Listener for Mobile (< 768px)
  useEffect(() => {
    const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth < 768;

    const handleTouchStart = (e: TouchEvent) => {
      if (!isMobileViewport()) return;
      if (e.touches && e.touches[0]) {
        touchStartY.current = e.touches[0].clientY;
        touchStartX.current = e.touches[0].clientX;
        touchSwipedRef.current = false;
        setShowSwipeHint(false);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMobileViewport()) return;
      if (!e.touches || !e.touches[0]) return;
      if (touchSwipedRef.current || isAnimatingRef.current) return;

      const track = scrollTrackRef.current;
      if (!track) return;
      const trackTop = track.offsetTop;
      const maxScroll = Math.max(track.offsetHeight - window.innerHeight, 100);
      const scrollY = window.scrollY || window.pageYOffset;
      const bannerOffset = window.innerWidth < 768 ? 165 : 185;

      const inside = scrollY >= trackTop - 25 && scrollY <= trackTop + maxScroll + bannerOffset + 35;
      if (!inside) return;

      const dy = e.touches[0].clientY - touchStartY.current;
      const dx = e.touches[0].clientX - touchStartX.current;

      // Detect intentional vertical swipe (> 35px threshold and dominant vertical motion)
      if (Math.abs(dy) > 35 && Math.abs(dy) > Math.abs(dx * 1.25)) {
        if (dy < 0) {
          // Swipe UP (finger moves bottom to top => wants to advance scroll DOWN)
          if (activeMobileState < 4) {
            touchSwipedRef.current = true;
            if (e.cancelable) e.preventDefault();
            goToMobileState(activeMobileState + 1);
          } else if (activeMobileState === 4) {
            // At the end of hero, scroll past into next section
            touchSwipedRef.current = true;
            const nextTarget = trackTop + maxScroll + Math.min(window.innerHeight * 0.45, 300);
            smoothScrollToTarget(nextTarget, 850);
          }
        } else if (dy > 0) {
          // Swipe DOWN (finger moves top to bottom => wants to go back UP)
          if (activeMobileState > 0) {
            touchSwipedRef.current = true;
            if (e.cancelable) e.preventDefault();
            goToMobileState(activeMobileState - 1);
          }
        }
      }
    };

    const handleTouchEnd = () => {
      touchSwipedRef.current = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [activeMobileState]);

  // Trackpad / Wheel listener for responsive mobile emulation
  useEffect(() => {
    const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth < 768;
    let wheelCooldown: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (!isMobileViewport()) return;
      if (isAnimatingRef.current) return;

      const track = scrollTrackRef.current;
      if (!track) return;
      const trackTop = track.offsetTop;
      const maxScroll = Math.max(track.offsetHeight - window.innerHeight, 100);
      const scrollY = window.scrollY || window.pageYOffset;
      const bannerOffset = window.innerWidth < 768 ? 165 : 185;

      const inside = scrollY >= trackTop - 25 && scrollY <= trackTop + maxScroll + bannerOffset + 35;
      if (!inside) return;

      if (Math.abs(e.deltaY) > 30) {
        if (wheelCooldown) return;
        wheelCooldown = setTimeout(() => {
          wheelCooldown = null;
        }, 650);

        if (e.deltaY > 0) {
          if (activeMobileState < 4) {
            if (e.cancelable) e.preventDefault();
            goToMobileState(activeMobileState + 1);
          }
        } else {
          if (activeMobileState > 0) {
            if (e.cancelable) e.preventDefault();
            goToMobileState(activeMobileState - 1);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      if (wheelCooldown) clearTimeout(wheelCooldown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeMobileState]);

  // =========================================================================
  // THE SCROLL CHOREOGRAPHY TRANSFORMS
  // =========================================================================

  // [BEAT 1: 0% - 34%] Logo Centered, The Identity & Hook
  const beat1Opacity = useTransform(scrollYProgress, [0, 0.22, 0.36], [1, 1, 0]);
  const beat1Y = useTransform(scrollYProgress, [0, 0.36], [0, -40]);
  const beat1Scale = useTransform(scrollYProgress, [0, 0.36], [1, 0.95]);
  const beat1Visibility = useTransform(scrollYProgress, (v) => (v < 0.38 ? 'visible' : 'hidden'));

  // [BEAT 2: 26% - 74%] Logo Shifts / 180° Rotation, Value Card Slides Up
  const beat2Opacity = useTransform(scrollYProgress, [0.26, 0.38, 0.62, 0.74], [0, 1, 1, 0]);
  const beat2Y = useTransform(scrollYProgress, [0.26, 0.38, 0.62, 0.74], [48, 0, 0, -40]);
  const beat2Visibility = useTransform(scrollYProgress, (v) => (v >= 0.24 && v < 0.76 ? 'visible' : 'hidden'));

  // [BEAT 3: 66% - 100%] Camera Zooms Through Particles, Business Value & Conversion
  // At the end (0.90 -> 0.98), the text card fully disappears with 0 opacity and lifts away
  const beat3Opacity = useTransform(scrollYProgress, [0.66, 0.78, 0.90, 0.98], [0, 1, 1, 0]);
  const beat3Y = useTransform(scrollYProgress, [0.66, 0.78, 0.90, 0.98], [48, 0, 0, -48]);
  const beat3Scale = useTransform(scrollYProgress, [0.66, 0.78, 0.90, 0.98], [0.95, 1, 1, 0.92]);
  const beat3Visibility = useTransform(scrollYProgress, (v) => (v >= 0.64 && v < 0.98 ? 'visible' : 'hidden'));

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const whatsappMessage =
    lang === 'pt'
      ? 'Olá AX07, gostaria de pedir o meu protótipo 3D gratuito em 48 horas.'
      : 'Hello AX07, I would like to request the free 48h 3D spec preview.';

  return (
    <section
      ref={scrollTrackRef}
      id="hero-scroll-track"
      className="relative w-full h-[2400px] md:h-auto md:min-h-[420vh] bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300"
    >
      {/* Mobile 3-Second Inactivity Swipe-Up Gesture Guide */}
      <AnimatePresence>
        {showSwipeHint && activeMobileState === 0 && (
          <motion.button
            type="button"
            onClick={() => goToMobileState(1)}
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="md:hidden fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-zinc-200/90 dark:border-white/20 bg-white/90 dark:bg-zinc-950/85 backdrop-blur-2xl text-zinc-900 dark:text-white shadow-[0_12px_36px_rgba(0,0,0,0.25)] cursor-pointer select-none transition-transform active:scale-95"
            aria-label="Swipe up to explore 3D"
          >
            {/* Animated Upward Swipe Track & Icon */}
            <motion.div
              animate={{ y: [3, -5, 3] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="relative flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 shrink-0"
            >
              <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-60" />
              <motion.div
                animate={{ y: [2, -3, 2], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              >
                <ChevronUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400 stroke-[2.5]" />
              </motion.div>
            </motion.div>

            {/* Label with gentle upward motion cue */}
            <motion.span
              animate={{ y: [0, -1.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="text-[11px] font-mono tracking-wider uppercase font-semibold text-zinc-900 dark:text-white/95 whitespace-nowrap"
            >
              {lang === 'pt' ? 'Deslize para cima para explorar 3D' : 'Swipe up to explore 3D'}
            </motion.span>

            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Tactile Mobile Beat Pagination Dots (Pinned Right Edge) */}
      {isWithinHero && (
        <div className="md:hidden fixed right-2.5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-auto bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-1.5 rounded-full border border-zinc-200/60 dark:border-white/10 shadow-lg">
          {MOBILE_BEAT_STATES.map((beat) => {
            const isActive = activeMobileState === beat.id;
            return (
              <button
                key={beat.id}
                type="button"
                onClick={() => goToMobileState(beat.id)}
                className={`transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'w-1.5 h-5 bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                    : 'w-1.5 h-1.5 bg-zinc-400/50 dark:bg-white/25 hover:bg-zinc-600 dark:hover:bg-white/50'
                }`}
                aria-label={`Beat ${beat.id + 1}: ${beat.label}`}
              />
            );
          })}
        </div>
      )}

      {/* Sticky Viewport Canvas Container: 100vh pinned while user scrubs through the 3-beat track */}
      <div
        id="hero-sticky-viewport"
        className="canvas-container sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between z-0"
        style={{ position: 'sticky', top: 0, height: '100dvh', zIndex: 0 }}
      >
        {/* Subtle Ethereal Abstract 3D Backdrop with Soft Blur Filter */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <img
            src={etherealBackdrop}
            alt="Ethereal abstract 3D backdrop"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30 dark:opacity-20 blur-2xl scale-110 transition-opacity duration-700"
          />
          {/* Subtle luminous glow & gradient scrims ensuring pristine typography readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/75 via-zinc-50/30 to-zinc-50/85 dark:from-zinc-950/75 dark:via-zinc-950/30 dark:to-zinc-950/85" />
          <div 
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-500/10 dark:bg-blue-500/15 blur-[140px] rounded-full" 
          />
        </div>

        {/* 3D WebGL Canvas Layer (Fixed in background across entire track) */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none touch-pan-y">
          <LogoCanvas
            modelUrl="/logo.glb"
            scrollWrapperId="hero-scroll-track"
            defaultMode="particles"
            showControls={true}
            onLoad={handle3DLoaded}
            className="w-full h-full touch-pan-y"
          />
        </div>

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-zinc-900/[0.02] to-zinc-900/[0.06] dark:via-zinc-950/20 dark:to-zinc-950/70 pointer-events-none z-5" />

        {/* Content Overlay Layer: High-Contrast Sliding Glass Cards */}
        <div
          className="content-overlay relative w-full h-full z-10 pointer-events-none"
          style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}
        >
          {/* ========================================================================= */}
          {/* BEAT 1: The Identity & Hook (0% - 34%) - Logo Centered (Slower Pacing)     */}
          {/* ========================================================================= */}
          <motion.div
            style={{
              opacity: beat1Opacity,
              y: beat1Y,
              scale: beat1Scale,
              visibility: beat1Visibility,
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 max-w-4xl mx-auto text-center pointer-events-none"
          >
            {/* Elegant Hero Fade-In Occurs AFTER Initial 3D Load Phase */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              animate={is3DLoaded ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 24, filter: 'blur(10px)' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="w-full flex flex-col items-center relative"
            >
              {/* Centered Backdrop Blur Shield (Radial Glass Overlay with Organic Dissolving Mask) */}
              <div
                aria-hidden="true"
                className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 w-[95vw] max-w-3xl h-[400px] sm:h-[460px] rounded-full backdrop-blur-xl bg-[radial-gradient(circle,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.45)_45%,transparent_80%)] dark:bg-[radial-gradient(circle,rgba(10,10,12,0.92)_0%,rgba(10,10,12,0.55)_45%,transparent_80%)] [mask-image:radial-gradient(circle,black_60%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle,black_60%,transparent_100%)] pointer-events-none -z-10 select-none"
              />

              {/* Atmospheric subtle color glow behind the blur shield */}
              <div
                aria-hidden="true"
                className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 w-[85vw] max-w-xl h-[340px] sm:h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18)_0%,rgba(16,185,129,0.10)_40%,transparent_75%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.22)_0%,rgba(16,185,129,0.12)_40%,transparent_75%)] blur-3xl pointer-events-none -z-20 select-none"
              />

              {/* Glass Capsule Eyebrow with SF Symbols */}
              <div className="mb-4 sm:mb-6 flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-zinc-200/90 dark:border-white/15 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl text-xs font-mono tracking-widest text-zinc-800 dark:text-white/80 shadow-sm drop-shadow-sm pointer-events-auto">
                <BrandLogo imgClassName="w-4 h-4 object-contain" className="flex items-center" />
                <span className="text-zinc-950 dark:text-white font-semibold">ax07.dev</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-700 dark:text-white/60">{badgeLocation}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-zinc-950 dark:text-white drop-shadow-[0_2px_14px_rgba(255,255,255,1)] dark:drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] mb-4 sm:mb-6 leading-[1.12]">
                {t.hero.beat1.titlePart1}{' '}
                <span className="text-zinc-700 dark:text-zinc-200 font-serif italic block sm:inline drop-shadow-[0_2px_10px_rgba(255,255,255,0.85)] dark:drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
                  {t.hero.beat1.titlePart2}
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg font-medium text-zinc-800 dark:text-zinc-100 drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_1px_10px_rgba(0,0,0,0.95)] max-w-xl sm:max-w-2xl font-sans mb-8 sm:mb-10 leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Desktop Scroll Hint */}
              <div className="hidden md:flex items-center gap-2 text-xs font-mono tracking-widest font-semibold text-zinc-700 dark:text-zinc-300 uppercase pointer-events-auto drop-shadow-sm">
                <span className="drop-shadow-sm">{t.hero.beat1.scrollHint}</span>
                <ChevronDown className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-bounce stroke-[2] drop-shadow-sm" />
              </div>

              {/* Mobile Dynamic State Prompts */}
              <div className="md:hidden flex flex-col items-center gap-2 pointer-events-auto">
                {activeMobileState === 0 ? (
                  <button
                    type="button"
                    onClick={() => goToMobileState(1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200/90 dark:border-white/15 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-[11px] font-mono tracking-wider uppercase font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer active:scale-95 transition-all shadow-sm"
                  >
                    <span>{t.hero.beat1.scrollHint}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-500 animate-bounce stroke-[2.5]" />
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono tracking-tight">
                      <Sparkles className="w-3 h-3 stroke-[2]" />
                      <span>{lang === 'pt' ? 'Menu Ativo • 3D em Movimento' : 'Top Bar Active • 3D in Motion'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToMobileState(2)}
                      className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase font-semibold text-zinc-600 dark:text-zinc-300 cursor-pointer active:scale-95 transition-colors"
                    >
                      <span>{lang === 'pt' ? 'Deslize para ver o comparativo' : 'Swipe again for benchmark'}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5] animate-bounce" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* ========================================================================= */}
          {/* BEAT 2: Value Proposition & Comparison (28% - 68%) - Logo Left/Up, Glass Card Slides Up */}
          {/* ========================================================================= */}
          <motion.div
            style={{
              opacity: beat2Opacity,
              y: beat2Y,
              visibility: beat2Visibility,
            }}
            className="absolute inset-0 z-20 flex items-end md:items-center pointer-events-none px-4 sm:px-6 md:px-16 pb-8 sm:pb-12 md:pb-0"
          >
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
              {/* Left Spacer: Preserves open space for the 3D logo shifted to the left on desktop, or above on mobile */}
              <div className="hidden md:block w-full md:w-1/2 pointer-events-none" />

              {/* Right Column: High-Contrast Sliding Glass Card Over Lower Third */}
              <motion.div 
                whileHover={appleGestures.cardHover}
                className="w-full md:max-w-xl pointer-events-auto rounded-[24px] sm:rounded-[32px] bg-white/90 dark:bg-zinc-950/85 backdrop-blur-2xl border border-zinc-200/80 dark:border-white/15 p-5 sm:p-8 shadow-2xl transition-colors"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-white/60 text-xs font-mono tracking-tight uppercase mb-4">
                  <span>{t.hero.beat2.badge}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-zinc-950 dark:text-white mb-3 sm:mb-4 leading-[1.18]">
                  {t.hero.beat2.title}
                </h2>

                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-base leading-relaxed mb-5 sm:mb-6 font-sans">
                  {t.hero.beat2.desc}
                </p>

                {/* Key Bullet Tags */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                  <div className="flex flex-col p-2.5 sm:p-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04]">
                    <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-mono">{t.hero.beat2.stat1Value}</span>
                    <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-white/50">{t.hero.beat2.stat1Label}</span>
                  </div>
                  <div className="flex flex-col p-2.5 sm:p-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04]">
                    <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">{t.hero.beat2.stat2Value}</span>
                    <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-white/50">{t.hero.beat2.stat2Label}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToMobileState(3)}
                  className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-zinc-500 dark:text-white/40 uppercase tracking-wider cursor-pointer active:scale-95 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
                  <span>{lang === 'pt' ? 'Continue a deslizar para o zoom 3D' : 'Swipe to enter 3D zoom-through'}</span>
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* BEAT 3: Conversion & Business ROI (68% - 100%) - Camera Zooms Through Core */}
          {/* ========================================================================= */}
          <motion.div
            style={{
              opacity: beat3Opacity,
              y: beat3Y,
              scale: beat3Scale,
              visibility: beat3Visibility,
            }}
            className="absolute inset-0 z-20 flex items-end sm:items-center justify-center pointer-events-none px-4 sm:px-6 pb-8 sm:pb-0"
          >
            {/* Apple HIG Squircle Glass Container */}
            <motion.div 
              whileHover={appleGestures.cardHover}
              className="w-full max-w-3xl mx-auto flex flex-col items-center text-center pointer-events-auto rounded-[24px] sm:rounded-[32px] bg-white/90 dark:bg-zinc-950/85 backdrop-blur-2xl border border-zinc-200/80 dark:border-white/15 p-6 sm:p-12 shadow-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono tracking-tight uppercase mb-4 sm:mb-5">
                <MessageSquare className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{t.hero.beat3.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-zinc-950 dark:text-white mb-3 sm:mb-5 leading-[1.12]">
                {t.hero.beat3.title}
              </h2>

              <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-base md:text-lg max-w-xl mb-6 sm:mb-8 leading-relaxed font-sans">
                {t.hero.beat3.desc}
              </p>

              {/* Action CTAs: Apple Capsule Action Button + Glass System Control */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                {/* Primary Capsule Action Button */}
                <motion.button
                  whileHover={appleGestures.primaryButton.hover}
                  whileTap={appleGestures.primaryButton.tap}
                  onClick={() => {
                    const pricingEl = document.getElementById('pricing');
                    if (pricingEl) {
                      pricingEl.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                    }
                  }}
                  className="w-full sm:w-auto rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs sm:text-sm px-6 py-3 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all"
                >
                  <Sparkles className="w-4 h-4 stroke-[2]" />
                  <span>{t.hero.beat3.cta}</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2]" />
                </motion.button>

                {/* Glass System Control (Secondary CTA) */}
                <motion.button
                  whileHover={appleGestures.secondaryButton.hover}
                  whileTap={appleGestures.secondaryButton.tap}
                  onClick={() => scrollToSection('project-showcase')}
                  className="w-full sm:w-auto rounded-full bg-zinc-100 dark:bg-white/10 backdrop-blur-md border border-zinc-300 dark:border-white/15 text-zinc-800 dark:text-white px-5 py-2.5 text-xs sm:text-sm font-medium hover:bg-zinc-200 dark:hover:bg-white/20 hover:border-zinc-400 dark:hover:border-white/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>{t.portfolio.viewCaseReview}</span>
                  <ArrowDown className="w-4 h-4 stroke-[1.75]" />
                </motion.button>
              </div>

              {/* Mobile Cue to Complete Zoom-Through into Next Section */}
              <button
                type="button"
                onClick={() => goToMobileState(4)}
                className="md:hidden mt-4 flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 dark:text-white/40 uppercase tracking-wider cursor-pointer active:scale-95 transition-opacity"
              >
                <ArrowDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
                <span>{lang === 'pt' ? 'Deslize para concluir o zoom 3D' : 'Swipe to complete 3D zoom'}</span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Empty layout spacer */}
        <div className="w-full h-1 pointer-events-none" />
      </div>
    </section>
  );
}

export default Hero;

