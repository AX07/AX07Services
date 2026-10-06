import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, Zap, Clock, Euro, MessageSquare, ChevronDown, Sparkles } from 'lucide-react';
import { LogoCanvas } from './LogoCanvas';
import { appleGestures } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';
import { CountryContent } from '../lib/content';
import { BrandLogo } from './BrandLogo';
import etherealBackdrop from '../assets/images/ethereal_hero_backdrop.jpg';

export interface HeroProps {
  countryContent?: CountryContent;
}

export function Hero({ countryContent }: HeroProps = {}) {
  const { t, lang } = useApp();

  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ["start start", "end end"]
  });

  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const [isScrolledPast5Percent, setIsScrolledPast5Percent] = useState(false);

  const handle3DLoaded = () => {
    setIs3DLoaded(true);
  };

  useEffect(() => {
    // Graceful fallback to guarantee hero content fades in even if WebGL is delayed
    const timer = setTimeout(() => {
      setIs3DLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleCheckScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;
      const thresholdPx = Math.max(window.innerHeight * 0.05, 45);
      setIsScrolledPast5Percent(scrollY > thresholdPx || scrollPercent > 0.05);
    };
    handleCheckScroll();
    window.addEventListener('scroll', handleCheckScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleCheckScroll);
  }, []);

  const heroSubtitle = countryContent?.heroSubtitle || t.hero.beat1.subtitle;
  const whatsappNumber = countryContent?.whatsappNumber || '353894419127';
  const badgeLocation = countryContent?.badgeLocation || t.hero.beat1.eyebrow;

  // Mobile Scroll Cue Indicator Transform (Fades out completely past 5% scroll)
  const mobileIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const mobileIndicatorY = useTransform(scrollYProgress, [0, 0.05], [0, -12]);
  const mobileIndicatorScale = useTransform(scrollYProgress, [0, 0.05], [1, 0.94]);
  const mobileIndicatorVisibility = useTransform(scrollYProgress, (v) => (v < 0.05 ? 'visible' : 'hidden'));

  // =========================================================================
  // THE 3-BEAT SCROLL CHOREOGRAPHY (Slower, More Graceful & Luxurious Pacing)
  // =========================================================================

  // [BEAT 1: 0% - 34%] Logo Centered, The Identity & Hook
  const beat1Opacity = useTransform(scrollYProgress, [0, 0.18, 0.34], [1, 1, 0]);
  const beat1Y = useTransform(scrollYProgress, [0, 0.34], [0, -45]);
  const beat1Scale = useTransform(scrollYProgress, [0, 0.34], [1, 0.94]);
  const beat1Visibility = useTransform(scrollYProgress, (v) => (v < 0.36 ? 'visible' : 'hidden'));

  // [BEAT 2: 24% - 72%] Logo Shifts Left (Desktop) or Up (Mobile), Text Slides Up Gracefully
  const beat2Opacity = useTransform(scrollYProgress, [0.24, 0.38, 0.58, 0.72], [0, 1, 1, 0]);
  const beat2Y = useTransform(scrollYProgress, [0.24, 0.38, 0.58, 0.72], [50, 0, 0, -45]);
  const beat2Visibility = useTransform(scrollYProgress, (v) => (v >= 0.22 && v < 0.74 ? 'visible' : 'hidden'));

  // [BEAT 3: 62% - 100%] Camera Zooms Through Particles, Business Value & CTA
  const beat3Opacity = useTransform(scrollYProgress, [0.62, 0.76, 1.0], [0, 1, 1]);
  const beat3Y = useTransform(scrollYProgress, [0.62, 0.76], [50, 0]);
  const beat3Visibility = useTransform(scrollYProgress, (v) => (v >= 0.60 ? 'visible' : 'hidden'));

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
      className="relative w-full h-[1800px] md:h-auto md:min-h-[340vh] bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300"
    >
      {/* Floating Translucent Glassmorphism Mobile Badge (< 768px) - Auto fades past 5% scroll */}
      {!isScrolledPast5Percent && (
        <motion.div
          style={{
            opacity: mobileIndicatorOpacity,
            y: mobileIndicatorY,
            scale: mobileIndicatorScale,
            visibility: mobileIndicatorVisibility,
          }}
          className="md:hidden fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-4 py-2 rounded-full border border-zinc-200/80 dark:border-white/20 bg-white/85 dark:bg-zinc-950/80 backdrop-blur-2xl text-zinc-900 dark:text-white shadow-[0_10px_35px_rgba(0,0,0,0.25)] pointer-events-none select-none transition-all"
        >
          {/* Animated Downward / Swipe-Up Indicator with Pulsing Ring */}
          <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-60" />
            <motion.div
              animate={{ y: [-1.5, 2, -1.5] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[2.5]" />
            </motion.div>
          </div>
          <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-zinc-900 dark:text-white/95 whitespace-nowrap">
            Swipe up to explore 3D
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shrink-0" />
        </motion.div>
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
                className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 w-[94vw] max-w-2xl h-[380px] sm:h-[440px] rounded-full backdrop-blur-md bg-[radial-gradient(circle,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.30)_40%,transparent_75%)] dark:bg-[radial-gradient(circle,rgba(10,10,12,0.75)_0%,rgba(10,10,12,0.40)_40%,transparent_75%)] [mask-image:radial-gradient(circle,black_55%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle,black_55%,transparent_100%)] pointer-events-none -z-10 select-none"
              />

              {/* Atmospheric subtle color glow behind the blur shield */}
              <div
                aria-hidden="true"
                className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 w-[85vw] max-w-xl h-[340px] sm:h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,rgba(16,185,129,0.08)_40%,transparent_75%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18)_0%,rgba(16,185,129,0.10)_40%,transparent_75%)] blur-3xl pointer-events-none -z-20 select-none"
              />

              {/* Glass Capsule Eyebrow with SF Symbols */}
              <div className="mb-4 sm:mb-6 flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl text-xs font-mono tracking-widest text-zinc-700 dark:text-white/70 shadow-sm drop-shadow-sm pointer-events-auto">
                <BrandLogo imgClassName="w-4 h-4 object-contain" className="flex items-center" />
                <span className="text-zinc-950 dark:text-white font-semibold">ax07.dev</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-600 dark:text-white/50">{badgeLocation}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-zinc-950 dark:text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] mb-4 sm:mb-6 leading-[1.12]">
                {t.hero.beat1.titlePart1}{' '}
                <span className="text-zinc-600 dark:text-zinc-300 font-serif italic block sm:inline drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {t.hero.beat1.titlePart2}
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg font-medium text-zinc-700 dark:text-zinc-200 drop-shadow-sm max-w-xl sm:max-w-2xl font-sans mb-8 sm:mb-10 leading-relaxed">
                {heroSubtitle}
              </p>

              <div className="flex items-center gap-2 text-xs font-mono tracking-widest font-semibold text-zinc-700 dark:text-zinc-300 uppercase pointer-events-auto drop-shadow-sm">
                <span className="drop-shadow-sm">{t.hero.beat1.scrollHint}</span>
                <ChevronDown className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-bounce stroke-[2] drop-shadow-sm" />
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

                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-zinc-500 dark:text-white/40 uppercase tracking-wider">
                  <ArrowDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
                  <span>{lang === 'pt' ? 'Continue a deslizar para o zoom 3D' : 'Keep scrolling to enter 3D zoom-through'}</span>
                </div>
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

