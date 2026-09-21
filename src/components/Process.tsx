import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence } from 'motion/react';
import { Clock, ShieldCheck, Rocket, ArrowRight, CheckCircle2, ChevronDown, MousePointer } from 'lucide-react';
import { appleSprings } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';

const stepIcons = [Clock, ShieldCheck, Rocket];

export function Process() {
  const { t } = useApp();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll progress through the 240vh section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Dynamically trigger step expansion based on scroll depth
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.33) {
      setActiveIndex(0);
    } else if (latest < 0.66) {
      setActiveIndex(1);
    } else {
      setActiveIndex(2);
    }
  });

  const steps = (t.process?.steps || []).map((st, idx) => ({
    ...st,
    icon: stepIcons[idx] || stepIcons[0],
    highlights: st.highlights || [],
  }));

  // Smooth click navigation to jump to a specific step along the scroll track
  const handleStepClick = (index: number) => {
    setActiveIndex(index);
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const sectionTop = rect.top + scrollTop;
      const totalScrollable = rect.height - window.innerHeight;
      const targetScroll = sectionTop + totalScrollable * (index * 0.35 + 0.08);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // Segmented progress bar widths
  const bar1Width = useTransform(scrollYProgress, [0, 0.33], ['0%', '100%']);
  const bar2Width = useTransform(scrollYProgress, [0.33, 0.66], ['0%', '100%']);
  const bar3Width = useTransform(scrollYProgress, [0.66, 1.0], ['0%', '100%']);

  const currentStep = steps[activeIndex] || steps[0];
  const CurrentIcon = currentStep.icon;

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full min-h-[240vh] bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10 transition-colors duration-300"
    >
      {/* Sticky Viewport Container: Locks in place for 100vh while user scrolls through the 3 steps */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] flex flex-col justify-start pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 overflow-hidden z-20">
        <div className="max-w-6xl mx-auto w-full flex flex-col justify-between h-full max-h-[820px]">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-4 md:mb-6">
            <div>
              <div className="text-xs font-mono tracking-widest text-zinc-500 dark:text-white/40 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-700 dark:text-white/60">{t.process.tag}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
                {t.process.title}
              </h2>
              <p className="text-xs sm:text-base md:text-lg text-zinc-600 dark:text-white/60 font-sans mt-1.5 max-w-xl">
                &ldquo;{t.process.quote}&rdquo;
              </p>
            </div>

            {/* Scroll-Driven Step Navigation & Live Indicator */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {steps.map((step, idx) => (
                  <button
                    key={idx}
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
                <MousePointer className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
                <span>{t.process.scrollCycle} &middot; Step 0{activeIndex + 1} Active</span>
              </div>
            </div>
          </div>

          {/* Segmented Scroll Progress Bar (01 / 02 / 03) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
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
          {/* MOBILE VIEW (< md): Focused Single Active Card Presentation                */}
          {/* ========================================================================= */}
          <div className="block md:hidden w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={appleSprings.snappy}
                className="relative rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl ring-1 ring-emerald-500/20"
              >
                {/* Top Row: Number & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-bold tracking-tighter text-4xl sm:text-5xl text-zinc-900 dark:text-white">
                    {currentStep.num}
                  </span>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono uppercase tracking-wider font-semibold">
                    <CurrentIcon className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
                    <span>{currentStep.badge}</span>
                  </div>
                </div>

                {/* Step Subheader */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                    {currentStep.stepLabel}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 dark:text-white/40 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04]">
                    {currentStep.timeline}
                  </span>
                </div>

                {/* Main Title */}
                <h3 className="text-lg sm:text-xl font-bold font-display text-zinc-900 dark:text-white mb-2 leading-snug tracking-tight">
                  {currentStep.title}
                </h3>

                {/* Body Copy */}
                <p className="text-zinc-600 dark:text-white/60 text-xs sm:text-sm leading-relaxed mb-4 font-sans">
                  {currentStep.desc}
                </p>

                {/* Key Feature Highlights */}
                <div className="space-y-1.5 pt-3 border-t border-zinc-200 dark:border-white/10 mb-3">
                  {(currentStep?.highlights || []).map((h, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-white/80 font-mono"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[1.75]" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>

                {/* Mobile Bottom Status Indicator */}
                <div className="pt-2 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Step 0{activeIndex + 1} of 03 Active</span>
                  </div>
                  <span className="text-zinc-400 dark:text-white/40 text-[11px]">Scroll to advance ↓</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ========================================================================= */}
          {/* DESKTOP VIEW (>= md): Horizontal Expanding Squircle Card Deck              */}
          {/* ========================================================================= */}
          <div className="hidden md:flex flex-row gap-4 h-[380px] md:h-[400px] lg:h-[410px] w-full">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeIndex === i;

              return (
                <motion.div
                  layout
                  key={step.num}
                  onClick={() => handleStepClick(i)}
                  onMouseEnter={() => setActiveIndex(i)}
                  transition={appleSprings.snappy}
                  className={`group relative rounded-[32px] border transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-xl ${
                    isActive
                      ? 'md:flex-[3.2] flex-1 bg-white/90 dark:bg-white/[0.06] border-zinc-300 dark:border-white/20 shadow-2xl ring-1 ring-emerald-500/20'
                      : 'md:flex-1 bg-white/50 dark:bg-white/[0.03] border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-white/80 dark:hover:bg-white/[0.05]'
                  } p-6 md:p-8 flex flex-col justify-between`}
                >
                  {/* Ambient Highlight for Active Card */}
                  {isActive && (
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
                  )}

                  {/* Top Row: Number & Badge */}
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <span
                      className={`font-mono font-bold tracking-tighter transition-all duration-300 ${
                        isActive
                          ? 'text-5xl md:text-6xl text-zinc-900 dark:text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                          : 'text-4xl md:text-5xl text-zinc-400 dark:text-white/30 group-hover:text-zinc-600 dark:group-hover:text-white/60'
                      }`}
                    >
                      {step.num}
                    </span>

                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all font-semibold ${
                        isActive
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-wider'
                          : 'border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 dark:text-white/40 text-[10px] font-mono uppercase tracking-wider group-hover:border-zinc-300 dark:group-hover:border-white/20 group-hover:text-zinc-800 dark:group-hover:text-white/70'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 stroke-[1.75] ${isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-zinc-400 dark:text-white/40'}`} />
                      <span>{step.badge}</span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="relative z-10 my-auto">
                    {isActive ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={appleSprings.snappy}
                        className="py-1"
                      >
                        {/* Step Subheader */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold block">
                            {step.stepLabel}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 dark:text-white/40 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04]">
                            {step.timeline}
                          </span>
                        </div>

                        {/* Main Title */}
                        <h3 className="text-2xl md:text-3xl font-bold font-display text-zinc-900 dark:text-white mb-3 leading-tight tracking-tight">
                          {step.title}
                        </h3>

                        {/* Full Body Copy */}
                        <p className="text-zinc-600 dark:text-white/60 text-sm md:text-base leading-relaxed mb-5 font-sans">
                          {step.desc}
                        </p>

                        {/* Key Feature Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-zinc-200 dark:border-white/10">
                          {(step?.highlights || []).map((h, hIdx) => (
                            <div
                              key={hIdx}
                              className="flex items-center gap-1.5 p-2 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-white/80 font-mono"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[1.75]" />
                              <span className="truncate">{h}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="py-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-white/40 mb-1.5 block">
                          Step {step.num} &middot; {step.timeline}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-zinc-700 dark:text-white/60 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors leading-snug tracking-tight">
                          {step.shortTitle}
                        </h4>
                      </div>
                    )}
                  </div>

                  {/* Bottom Row / Status Bar */}
                  <div className="relative z-10 pt-3 mt-2 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
                    {isActive ? (
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>{t.process.activeStep} ({step.num}/03)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 dark:text-white/40 group-hover:text-zinc-700 dark:group-hover:text-white/70 transition-colors uppercase tracking-wider">
                        <span>{t.process.scrollOrClick}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-500 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform stroke-[1.75]" />
                      </div>
                    )}

                    <div className="hidden sm:flex items-center gap-1">
                      {[0, 1, 2].map((dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            dotIdx === i ? 'w-6 bg-emerald-500 dark:bg-emerald-400' : 'w-1.5 bg-zinc-300 dark:bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Guidance Prompt */}
          <div className="mt-4 sm:mt-6 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-white/40">
            <span className="flex items-center gap-2">
              <ChevronDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-bounce stroke-[1.75]" />
              <span>{t.process.scrollHint}</span>
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
