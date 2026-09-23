import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, Zap, Clock, Euro, MessageSquare, ChevronDown, Sparkles } from 'lucide-react';
import { LogoCanvas } from './LogoCanvas';
import { appleGestures } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';
import { CountryContent } from '../lib/content';
import etherealBackdrop from '../assets/images/ethereal_hero_backdrop_1790087265626.jpg';

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

  const heroSubtitle = countryContent?.heroSubtitle || t.hero.beat1.subtitle;
  const whatsappNumber = countryContent?.whatsappNumber || '351912345678';
  const badgeLocation = countryContent?.badgeLocation || t.hero.beat1.eyebrow;

  // =========================================================================
  // THE 3-BEAT SCROLL CHOREOGRAPHY (Strictly Independent & Non-Overlapping)
  // =========================================================================

  // [BEAT 1: 0% - 28%] Logo Centered, The Identity & Hook
  const beat1Opacity = useTransform(scrollYProgress, [0, 0.16, 0.26], [1, 1, 0]);
  const beat1Y = useTransform(scrollYProgress, [0, 0.26], [0, -35]);
  const beat1Scale = useTransform(scrollYProgress, [0, 0.26], [1, 0.96]);
  const beat1Visibility = useTransform(scrollYProgress, (v) => (v < 0.28 ? 'visible' : 'hidden'));

  // [BEAT 2: 28% - 68%] Logo Shifts Left (Desktop) or Up (Mobile), Text on Right/Bottom
  const beat2Opacity = useTransform(scrollYProgress, [0.26, 0.34, 0.58, 0.66], [0, 1, 1, 0]);
  const beat2Y = useTransform(scrollYProgress, [0.26, 0.34, 0.58, 0.66], [35, 0, 0, -35]);
  const beat2Visibility = useTransform(scrollYProgress, (v) => (v >= 0.24 && v < 0.68 ? 'visible' : 'hidden'));

  // [BEAT 3: 68% - 100%] Camera Zooms Through Particles, Business Value & CTA
  const beat3Opacity = useTransform(scrollYProgress, [0.66, 0.74, 1.0], [0, 1, 1]);
  const beat3Y = useTransform(scrollYProgress, [0.66, 0.74], [35, 0]);
  const beat3Visibility = useTransform(scrollYProgress, (v) => (v >= 0.65 ? 'visible' : 'hidden'));

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
      className="relative w-full min-h-[260vh] bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300"
    >
      {/* Sticky Viewport Container: 100vh pinned while user scrubs through the 3-beat track */}
      <div
        id="hero-sticky-viewport"
        className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between"
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

        {/* 3D WebGL Canvas Layer (Active throughout the entire track) */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none touch-pan-y">
          <LogoCanvas
            modelUrl="/logo.glb"
            scrollWrapperId="hero-scroll-track"
            defaultMode="particles"
            showControls={true}
            className="w-full h-full touch-pan-y"
          />
        </div>

        {/* Ambient Subtle Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-zinc-900/[0.02] to-zinc-900/[0.06] dark:via-zinc-950/20 dark:to-zinc-950/70 pointer-events-none z-15" />

        {/* ========================================================================= */}
        {/* BEAT 1: The Identity & Hook (0% - 28%) - Logo Centered                     */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: beat1Opacity,
            y: beat1Y,
            scale: beat1Scale,
            visibility: beat1Visibility,
          }}
          className="relative absolute inset-0 z-20 flex flex-col items-center justify-start pt-24 sm:pt-32 md:pt-36 px-6 max-w-4xl mx-auto text-center pointer-events-none"
        >
          {/* Gentle luminous glow behind text ensuring readability while letting the large 3D asset shine through */}
          <div
            aria-hidden="true"
            className="absolute top-12 sm:top-16 left-1/2 -translate-x-1/2 w-[95vw] max-w-3xl h-[420px] sm:h-[480px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.15)_45%,rgba(255,255,255,0)_75%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.45)_0%,rgba(9,9,11,0.15)_45%,rgba(9,9,11,0)_75%)] blur-3xl pointer-events-none -z-10"
          />

          {/* Glass Capsule Eyebrow with SF Symbols */}
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl text-xs font-mono tracking-widest text-zinc-600 dark:text-white/60 shadow-sm pointer-events-auto">
            <span className="text-zinc-900 dark:text-white font-semibold">AX07 SERVICES</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-500 dark:text-white/40">{badgeLocation}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white mb-6 leading-[1.08] font-display">
            {t.hero.beat1.titlePart1}{' '}
            <span className="text-zinc-500 dark:text-white/60 block sm:inline">{t.hero.beat1.titlePart2}</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-white/60 max-w-2xl font-sans mb-8 leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 dark:text-white/40 uppercase">
            <span>{t.hero.beat1.scrollHint}</span>
            <ChevronDown className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-bounce stroke-[1.75]" />
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* BEAT 2: Value Proposition & Comparison (28% - 68%) - Logo Left, Copy Right */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: beat2Opacity,
            y: beat2Y,
            visibility: beat2Visibility,
          }}
          className="absolute inset-0 z-20 flex items-end md:items-center pointer-events-none px-4 sm:px-6 md:px-16 pb-12 sm:pb-16 md:pb-0"
        >
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
            {/* Left Spacer: Preserves open space for the 3D logo shifted to the left */}
            <div className="hidden md:block w-full md:w-1/2 pointer-events-none" />

            {/* Right Column: Apple Squircle Glass Card */}
            <motion.div 
              whileHover={appleGestures.cardHover}
              className="w-full md:max-w-xl pointer-events-auto rounded-[28px] sm:rounded-[32px] bg-white/85 dark:bg-white/[0.04] backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 p-6 sm:p-8 shadow-2xl transition-colors"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-white/60 text-xs font-mono tracking-tight uppercase mb-4">
                <span>{t.hero.beat2.badge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-4 font-display leading-[1.18]">
                {t.hero.beat2.title}
              </h2>

              <p className="text-zinc-600 dark:text-white/60 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                {t.hero.beat2.desc}
              </p>

              {/* Key Bullet Tags */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex flex-col p-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04]">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">{t.hero.beat2.stat1Value}</span>
                  <span className="text-xs text-zinc-500 dark:text-white/50">{t.hero.beat2.stat1Label}</span>
                </div>
                <div className="flex flex-col p-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04]">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">{t.hero.beat2.stat2Value}</span>
                  <span className="text-xs text-zinc-500 dark:text-white/50">{t.hero.beat2.stat2Label}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-white/40 uppercase tracking-wider">
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
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6"
        >
          {/* Apple HIG Squircle Container */}
          <motion.div 
            whileHover={appleGestures.cardHover}
            className="w-full max-w-3xl mx-auto flex flex-col items-center text-center pointer-events-auto rounded-[32px] bg-white/85 dark:bg-white/[0.04] backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 p-8 sm:p-12 shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono tracking-tight uppercase mb-5">
              <MessageSquare className="w-3.5 h-3.5 stroke-[1.75]" />
              <span>{t.hero.beat3.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white mb-5 font-display leading-[1.12]">
              {t.hero.beat3.title}
            </h2>

            <p className="text-zinc-600 dark:text-white/60 text-sm sm:text-base md:text-lg max-w-xl mb-8 leading-relaxed font-sans">
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
                className="w-full sm:w-auto rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-sm px-6 py-3 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all"
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
                className="w-full sm:w-auto rounded-full bg-zinc-100 dark:bg-white/10 backdrop-blur-md border border-zinc-300 dark:border-white/15 text-zinc-800 dark:text-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-white/20 hover:border-zinc-400 dark:hover:border-white/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>{t.portfolio.viewCaseReview}</span>
                <ArrowDown className="w-4 h-4 stroke-[1.75]" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Empty layout spacer */}
        <div className="w-full h-1 pointer-events-none" />
      </div>
    </section>
  );
}

export default Hero;

