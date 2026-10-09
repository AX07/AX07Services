import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'motion/react';
import { Clock, ShieldCheck, Rocket, ArrowRight, CheckCircle2, ChevronDown, MousePointer, Sparkles } from 'lucide-react';
import { useApp } from '../context/ThemeLanguageContext';
import { CountryContent } from '../lib/content';

const stepIcons = [Clock, ShieldCheck, Rocket];

export interface ProcessProps {
  countryContent?: CountryContent;
}

export function Process({ countryContent }: ProcessProps = {}) {
  const { t, lang } = useApp();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const pricingUpfront = countryContent?.pricingUpfront || (lang === 'pt' ? '€500' : '€1,800');
  const pricingRetainer = countryContent?.pricingRetainer || (lang === 'pt' ? '€25/mo' : '€49/mo');

  // Extended scroll runway so cards lift smoothly with physical weight
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Track active step based on scroll depth
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.35) {
      setActiveIndex(0);
    } else if (latest < 0.68) {
      setActiveIndex(1);
    } else {
      setActiveIndex(2);
    }
  });

  const steps = (t.process?.steps || []).map((st, idx) => {
    if (idx === 2) {
      return {
        ...st,
        desc:
          lang === 'pt'
            ? 'Pague apenas após aprovar. Terá uma subscrição de 1 ano para alojamento edge ultrarrápido na Vercel, certificados SSL contínuos e atualizações de conteúdo a pedido.'
            : 'Only pay once approved, you will have a 1-year subscription for ultra-fast Vercel edge hosting, continuous SSL certificates and on-demand content updates.',
        highlights:
          lang === 'pt'
            ? [
                'Conexão do seu domínio em 1 clique',
                'Alojamento Edge Vercel e SSL contínuo',
                'Subscrição de 1 ano com atualizações a pedido',
              ]
            : [
                '1-click DNS domain attach',
                'Ultra-fast Vercel Edge hosting & continuous SSL',
                '1-year subscription with on-demand content updates',
              ],
        icon: stepIcons[idx] || stepIcons[0],
      };
    }
    return {
      ...st,
      icon: stepIcons[idx] || stepIcons[0],
      highlights: st.highlights || [],
    };
  });

  // Silky smooth programmatic scroll interpolation with cubic easing
  const isScrollingRef = useRef(false);

  const smoothScrollToTarget = (targetY: number, duration = 950) => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    const startY = window.scrollY || document.documentElement.scrollTop;
    const distance = targetY - startY;
    if (Math.abs(distance) < 5) {
      isScrollingRef.current = false;
      return;
    }

    const startTime = performance.now();

    // Apple-grade cubic easing for butter-smooth deceleration
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        isScrollingRef.current = false;
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Smooth navigation to smoothly scroll and trigger card lift
  const handleStepClick = (index: number) => {
    setActiveIndex(index);
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const sectionTop = rect.top + scrollTop;
      const totalScrollable = sectionRef.current.offsetHeight - window.innerHeight;
      const stepScrollFractions = [0.06, 0.46, 0.82];
      const targetScroll = sectionTop + totalScrollable * stepScrollFractions[index];
      smoothScrollToTarget(targetScroll, 950);
    }
  };

  // Touch Swipe Gesture on Stacked Cards Container with smooth transitions
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    if (isScrollingRef.current) return;

    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dx = touchStartX.current !== null ? e.changedTouches[0].clientX - touchStartX.current : 0;

    // Detect swipe (supports both vertical drag and horizontal step swipe)
    const isVerticalSwipe = Math.abs(dy) > Math.abs(dx);

    if (isVerticalSwipe) {
      if (dy < -50 && activeIndex < 2) {
        handleStepClick(activeIndex + 1);
      } else if (dy > 50 && activeIndex > 0) {
        handleStepClick(activeIndex - 1);
      }
    } else {
      if (dx < -50 && activeIndex < 2) {
        handleStepClick(activeIndex + 1);
      } else if (dx > 50 && activeIndex > 0) {
        handleStepClick(activeIndex - 1);
      }
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  // Segmented progress bar widths
  const bar1Width = useTransform(scrollYProgress, [0, 0.33], ['0%', '100%']);
  const bar2Width = useTransform(scrollYProgress, [0.33, 0.66], ['0%', '100%']);
  const bar3Width = useTransform(scrollYProgress, [0.66, 1.0], ['0%', '100%']);

  // =========================================================================
  // STACKED CARD LIFT TRANSFORMS (Physical layering & Peel-Off Effect)
  // Gentle, wide transition curves so cards glide gracefully without whipping
  // =========================================================================

  // Card 0 (Step 01): On top initially (z-30). Lifts up & away smoothly between 0.15 and 0.40
  const card0Y = useTransform(scrollYProgress, [0.15, 0.40], ['0%', '-150%']);
  const card0Scale = useTransform(scrollYProgress, [0.15, 0.40], [1, 0.94]);
  const card0Opacity = useTransform(scrollYProgress, [0.15, 0.38], [1, 0]);
  const card0RotateX = useTransform(scrollYProgress, [0.15, 0.40], [0, 8]);
  const card0Visibility = useTransform(scrollYProgress, (v) => (v < 0.40 ? 'visible' : 'hidden'));
  const card0ZIndex = useTransform(scrollYProgress, (v) => (v < 0.40 ? 30 : 0));

  // Card 1 (Step 02): Peeks under Card 0 (z-20), rises to focus at 0.35, lifts away smoothly at 0.48 -> 0.72
  const card1Y = useTransform(
    scrollYProgress,
    [0.08, 0.28, 0.48, 0.72],
    ['20px', '0px', '0px', '-150%']
  );
  const card1Scale = useTransform(
    scrollYProgress,
    [0.08, 0.28, 0.48, 0.72],
    [0.96, 1.0, 1.0, 0.94]
  );
  const card1Opacity = useTransform(
    scrollYProgress,
    [0.08, 0.28, 0.48, 0.70],
    [0.85, 1.0, 1.0, 0]
  );
  const card1RotateX = useTransform(scrollYProgress, [0.48, 0.72], [0, 8]);
  const card1Visibility = useTransform(scrollYProgress, (v) => (v >= 0.08 && v < 0.72 ? 'visible' : 'hidden'));
  const card1ZIndex = useTransform(scrollYProgress, (v) => (v < 0.72 ? 20 : 0));

  // Card 2 (Step 03): Sits at base, rises to prominent focus from 0.45 -> 0.70 and stays clean through 1.00
  const card2Y = useTransform(
    scrollYProgress,
    [0.08, 0.30, 0.48, 0.70],
    ['36px', '18px', '0px', '0px']
  );
  const card2Scale = useTransform(
    scrollYProgress,
    [0.08, 0.30, 0.48, 0.70],
    [0.92, 0.96, 1.0, 1.0]
  );
  const card2Opacity = useTransform(
    scrollYProgress,
    [0.08, 0.30, 0.48, 0.70],
    [0.70, 0.85, 1.0, 1.0]
  );
  const card2Visibility = useTransform(scrollYProgress, (v) => (v >= 0.20 ? 'visible' : 'hidden'));
  const card2ZIndex = useTransform(scrollYProgress, (v) => (v >= 0.70 ? 30 : 10));

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full min-h-[280vh] bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10 transition-colors duration-300"
    >
      {/* Sticky Viewport Container: 100vh pinned while cards are lifted */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] flex flex-col justify-start pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8 px-4 sm:px-6 overflow-hidden z-20">
        <div className="max-w-5xl mx-auto w-full flex flex-col justify-between h-full max-h-[860px]">
          
          {/* Section Header */}
          <div className="relative z-30 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-3 sm:mb-4 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-md pt-1 pb-2">
            <div>
              <div className="text-xs font-mono tracking-widest text-zinc-500 dark:text-white/40 mb-1.5 sm:mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-700 dark:text-white/60">{t.process.tag}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
                {t.process.title}
              </h2>
              <p className="text-xs sm:text-base text-zinc-600 dark:text-white/60 font-sans mt-1 max-w-xl">
                &ldquo;{t.process.quote}&rdquo;
              </p>
            </div>

            {/* Step Navigation Pill Controls */}
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {steps.map((step, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStepClick(idx)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
                      activeIndex === idx
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)] font-semibold'
                        : 'border-zinc-300 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] text-zinc-500 dark:text-white/40 hover:text-zinc-800 dark:hover:text-white/80 hover:border-zinc-400 dark:hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        activeIndex === idx ? 'bg-emerald-500 animate-ping' : 'bg-zinc-300 dark:bg-white/20'
                      }`}
                    />
                    <span>{step.shortTitle}</span>
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-white/40">
                <MousePointer className="w-3.5 h-3.5 text-emerald-500 stroke-[1.75]" />
                <span>{t.process.scrollCycle} &middot; Step 0{activeIndex + 1} of 03</span>
              </div>
            </div>
          </div>

          {/* Segmented Scroll Progress Bar (01 / 02 / 03) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="h-1 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={{ width: bar1Width }}
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
              />
            </div>
            <div className="h-1 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={{ width: bar2Width }}
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
              />
            </div>
            <div className="h-1 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={{ width: bar3Width }}
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* THE STACKED CARDS STAGE (Cards stacked on top of each other, lifting up)  */}
          {/* ========================================================================= */}
          <div
            ref={cardStackRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-4xl mx-auto h-[440px] sm:h-[480px] md:h-[500px] flex items-center justify-center my-auto"
            style={{ perspective: 1200 }}
          >
            {/* Ambient Radial Glow behind the active stack */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-10"
            />

            {/* ------------------------------------------------------------------- */}
            {/* STEP 03 CARD (Base of Stack - dynamic zIndex)                       */}
            {/* ------------------------------------------------------------------- */}
            {steps[2] && (
              <motion.div
                style={{
                  y: card2Y,
                  scale: card2Scale,
                  opacity: card2Opacity,
                  visibility: card2Visibility,
                  zIndex: card2ZIndex,
                }}
                className="absolute inset-0 rounded-[28px] sm:rounded-[36px] border border-zinc-300 dark:border-white/15 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Top Row: Number & Badges */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono font-bold tracking-tighter text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-white">
                      03
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                      {steps[2].stepLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-semibold">
                      <Rocket className="w-3.5 h-3.5 text-emerald-500 stroke-[1.75]" />
                      <span>{steps[2].badge}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-white/50 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04]">
                      {steps[2].timeline}
                    </span>
                  </div>
                </div>

                {/* Middle Content: Title, Description & Feature Highlights */}
                <div className="my-auto py-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-zinc-900 dark:text-white mb-2 leading-tight tracking-tight">
                    {steps[2].title}
                  </h3>

                  <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4 max-w-3xl font-sans">
                    {steps[2].desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-zinc-200 dark:border-white/10">
                    {(steps[2].highlights || []).map((h, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-zinc-200 font-mono"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2]" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar: Action */}
                <div className="pt-3 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Step 03 of 03 &middot; Production Ready</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const pricingEl = document.getElementById('pricing');
                      pricingEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <span>{lang === 'pt' ? 'Ver Planos de Preço' : 'See Pricing Plans'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* STEP 02 CARD (Middle of Stack)                                      */}
            {/* ------------------------------------------------------------------- */}
            {steps[1] && (
              <motion.div
                style={{
                  y: card1Y,
                  scale: card1Scale,
                  opacity: card1Opacity,
                  rotateX: card1RotateX,
                  visibility: card1Visibility,
                  zIndex: card1ZIndex,
                  transformOrigin: 'top center',
                }}
                className="absolute inset-0 rounded-[28px] sm:rounded-[36px] border border-zinc-300 dark:border-white/15 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Top Row: Number & Badges */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono font-bold tracking-tighter text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-white">
                      02
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                      {steps[1].stepLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 stroke-[1.75]" />
                      <span>{steps[1].badge}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-white/50 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04]">
                      {steps[1].timeline}
                    </span>
                  </div>
                </div>

                {/* Middle Content */}
                <div className="my-auto py-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-zinc-900 dark:text-white mb-2 leading-tight tracking-tight">
                    {steps[1].title}
                  </h3>

                  <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4 max-w-3xl font-sans">
                    {steps[1].desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-zinc-200 dark:border-white/10">
                    {(steps[1].highlights || []).map((h, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-zinc-200 font-mono"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2]" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-3 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Step 02 of 03 Active</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStepClick(2)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <span>{lang === 'pt' ? 'Levantar para revelar o Passo 03' : 'Lift card to reveal Step 03'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* STEP 01 CARD (Top of Stack)                                         */}
            {/* ------------------------------------------------------------------- */}
            {steps[0] && (
              <motion.div
                style={{
                  y: card0Y,
                  scale: card0Scale,
                  opacity: card0Opacity,
                  rotateX: card0RotateX,
                  visibility: card0Visibility,
                  zIndex: card0ZIndex,
                  transformOrigin: 'top center',
                }}
                className="absolute inset-0 rounded-[28px] sm:rounded-[36px] border border-zinc-300 dark:border-white/15 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Top Row: Number & Badges */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono font-bold tracking-tighter text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-white">
                      01
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                      {steps[0].stepLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-semibold">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 stroke-[1.75]" />
                      <span>{steps[0].badge}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-white/50 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04]">
                      {steps[0].timeline}
                    </span>
                  </div>
                </div>

                {/* Middle Content */}
                <div className="my-auto py-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-zinc-900 dark:text-white mb-2 leading-tight tracking-tight">
                    {steps[0].title}
                  </h3>

                  <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4 max-w-3xl font-sans">
                    {steps[0].desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-zinc-200 dark:border-white/10">
                    {(steps[0].highlights || []).map((h, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-zinc-200 font-mono"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2]" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-3 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Step 01 of 03 Active</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStepClick(1)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <span>{lang === 'pt' ? 'Levantar para revelar o Passo 02' : 'Lift card to reveal Step 02'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Guidance Prompt */}
          <div className="mt-2 sm:mt-4 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-white/40">
            <span className="flex items-center gap-2">
              <ChevronDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-bounce stroke-[1.75]" />
              <span>{lang === 'pt' ? 'Deslize ou role para levantar as cartas' : 'Scroll or swipe to lift cards in sequence'}</span>
            </span>
            <span className="hidden sm:inline-block text-zinc-500 dark:text-white/40">
              {t.process.protocolHint}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Process;
