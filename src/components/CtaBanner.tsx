import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, MessageSquare, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { LogoCanvas } from './LogoCanvas';
import { appleGestures } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';
import { CountryContent } from '../lib/content';

export interface CtaBannerProps {
  countryContent?: CountryContent;
}

export function CtaBanner({ countryContent }: CtaBannerProps = {}) {
  const { t, lang } = useApp();
  const [businessInput, setBusinessInput] = useState('');
  const whatsappNumber = countryContent?.whatsappNumber || '351912345678';

  const badges = t.cta?.badges || {
    riskFree: '100% Risk-Free Staging',
    staging48h: '48h Direct Staging Link',
    whatsApp: 'Direct WhatsApp Chat',
  };

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const query = businessInput.trim()
      ? encodeURIComponent(
          lang === 'pt'
            ? `Olá AX07, gostaria de pedir o meu link de teste 3D gratuito em 48h para: ${businessInput.trim()}`
            : `Hello AX07, I would like to claim my free 48h 3D preview link for: ${businessInput.trim()}`
        )
      : encodeURIComponent(
          lang === 'pt'
            ? 'Olá AX07, gostaria de pedir o meu link de teste 3D gratuito em 48h.'
            : 'Hello AX07, I would like to claim my free 48h 3D preview staging link.'
        );
    window.open(`https://wa.me/${whatsappNumber}?text=${query}`, '_blank');
  };

  return (
    <section
      id="cta-section"
      className="relative py-28 sm:py-36 px-4 sm:px-6 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10 overflow-hidden z-20 min-h-[750px] flex items-center justify-center transition-colors duration-300"
    >
      {/* 3D WebGL Canvas Layer in the Background (Fully Visible Behind Transparent Container) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto opacity-100 flex items-center justify-center">
        <LogoCanvas
          canvasId="cta-3d-bg-canvas"
          showControls={false}
          showHint={false}
          autoRotate={true}
          defaultMode="hybrid"
          className="w-full h-full"
        />
      </div>

      {/* Ambient Radial Lighting Spot */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-blue-500/15 dark:bg-blue-500/25 blur-[140px] rounded-full pointer-events-none z-10"
      />

      {/* Ultra-Soft Subtle Edge Vignette (Keeps center transparent so 3D asset is fully visible) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-zinc-100/50 dark:to-zinc-950/70 pointer-events-none z-10"
      />

      <div className="relative max-w-4xl mx-auto z-20 w-full">
        {/* Apple HIG Semi-Transparent Squircle Glass Card Enclosure */}
        <div className="rounded-[36px] border border-zinc-300/40 dark:border-white/20 bg-white/20 dark:bg-zinc-950/30 backdrop-blur-md p-8 sm:p-14 shadow-2xl text-center transition-colors duration-300">
          
          {/* Top Micro Eyebrow */}
          <div className="text-[11px] font-mono tracking-widest text-zinc-800 dark:text-white/80 mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-300/60 dark:border-white/20 bg-white/40 dark:bg-white/[0.08] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
            <span className="font-semibold">{t.cta.badge}</span>
          </div>

          {/* Main Pitch */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white font-display mb-6 leading-[1.08] drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            {t.cta.title}
          </h2>

          <p className="text-zinc-800 dark:text-white/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-sans drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
            {t.cta.desc}
          </p>

          {/* Fast Action WhatsApp Capsule Form */}
          <form
            onSubmit={handleWhatsAppRedirect}
            className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 p-1.5 rounded-[24px] sm:rounded-full border border-zinc-300/60 dark:border-white/20 bg-white/40 dark:bg-zinc-900/45 backdrop-blur-md shadow-xl mb-8"
          >
            <input
              type="text"
              value={businessInput}
              onChange={(e) => setBusinessInput(e.target.value)}
              placeholder={t.cta.placeholder}
              className="flex-1 bg-transparent px-5 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-white/50 focus:outline-none font-sans"
            />
            <motion.button
              whileHover={appleGestures.primaryButton.hover}
              whileTap={appleGestures.primaryButton.tap}
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all"
            >
              <span>{t.cta.button}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2]" />
            </motion.button>
          </form>

          {/* Reassurance Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-700 dark:text-white/70">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
              <span>{badges.riskFree}</span>
            </div>
            <div className="h-3 w-px bg-zinc-300 dark:bg-white/15 hidden sm:block" />
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
              <Zap className="w-4 h-4 text-cyan-500 dark:text-cyan-400 stroke-[1.75]" />
              <span>{badges.staging48h}</span>
            </div>
            <div className="h-3 w-px bg-zinc-300 dark:bg-white/15 hidden sm:block" />
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
              <MessageSquare className="w-4 h-4 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
              <span>{badges.whatsApp}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CtaBanner;
