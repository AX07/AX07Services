import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { Sparkles, Zap } from 'lucide-react';
import { useApp } from '../context/ThemeLanguageContext';

export interface InitialLoaderProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export function InitialLoader({ onComplete, minDurationMs = 1400 }: InitialLoaderProps) {
  const { lang, theme } = useApp();
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = lang === 'pt' ? [
    'A LIGAR AO EDGE VERCEL...',
    'A CARREGAR ATIVOS 3D...',
    'A COMPILAR SHADERS...',
    'SISTEMA PRONTO'
  ] : [
    'CONNECTING TO VERCEL EDGE...',
    'LOADING 3D ASSETS...',
    'COMPILING SHADERS...',
    'SYSTEM READY'
  ];

  useEffect(() => {
    const startTime = performance.now();
    let animId: number | null = null;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / minDurationMs, 1);
      
      // Fast start, natural easing curve
      const eased = Math.pow(rawProgress, 0.85) * 100;
      const currentPct = Math.min(Math.round(eased), 100);
      setProgress(currentPct);

      if (currentPct < 30) {
        setStatusIndex(0);
      } else if (currentPct < 65) {
        setStatusIndex(1);
      } else if (currentPct < 95) {
        setStatusIndex(2);
      } else {
        setStatusIndex(3);
      }

      if (rawProgress < 1) {
        animId = requestAnimationFrame(update);
      } else {
        // Short pause at 100% for satisfying visual feedback before dissolving
        setTimeout(() => {
          onComplete();
        }, 180);
      }
    };

    animId = requestAnimationFrame(update);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [minDurationMs, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(16px)' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] w-screen h-screen h-[100dvh] overflow-hidden bg-zinc-50 dark:bg-[#050507] text-zinc-900 dark:text-white flex flex-col items-center justify-center select-none transition-colors duration-300"
    >
      {/* Ambient Radial Glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[540px] h-[420px] sm:h-[540px] bg-emerald-500/10 dark:bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] bg-blue-500/10 dark:bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" 
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full">
        {/* Animated Brand Logo with ambient ring */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mb-6 flex items-center justify-center"
        >
          {/* Subtle spinning pulse ring */}
          <div className="absolute -inset-3 rounded-full border border-zinc-300/60 dark:border-white/10 animate-[spin_8s_linear_infinite]" />
          <div className="absolute -inset-1.5 rounded-full border border-emerald-500/30 dark:border-emerald-400/20" />
          
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/80 dark:bg-black/60 backdrop-blur-2xl border border-zinc-200/90 dark:border-white/15 p-3 flex items-center justify-center shadow-xl dark:shadow-2xl">
            <BrandLogo
              imgClassName="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              themeOverride={theme}
            />
          </div>
        </motion.div>

        {/* Studio Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-white mb-1.5 drop-shadow-sm dark:drop-shadow-none"
        >
          Ax07 Studio
        </motion.h1>

        {/* Dynamic Status Text */}
        <div className="h-5 flex items-center justify-center mb-6">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>{statuses[statusIndex]}</span>
          </span>
        </div>

        {/* Tactile Loading Bar */}
        <div className="w-full bg-zinc-200/80 dark:bg-white/[0.08] backdrop-blur-md rounded-full h-2.5 p-0.5 border border-zinc-300/80 dark:border-white/10 shadow-inner relative overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-500 dark:via-teal-400 dark:to-cyan-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] dark:shadow-[0_0_15px_rgba(16,185,129,0.85)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Numerical Percentage & Micro Edge Spec */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 px-0.5">
          <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span>Vercel Edge</span>
          </span>
          <span className="font-bold text-zinc-900 dark:text-white tracking-wider">
            {progress}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default InitialLoader;
