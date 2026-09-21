import React from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Zap, ArrowUpRight, MessageSquare, Sparkles } from 'lucide-react';
import { appleGestures } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';

export function Pricing() {
  const { t } = useApp();

  const fallbackReassurance = {
    card1Title: 'Zero-Deposit Guarantee',
    card1Badge: '100% Risk-Free Build',
    card1Desc: 'We invest our own design & coding hours upfront. If you do not love the 3D staging link on your phone, you walk away paying €0.',
    card1Tag: 'No Credit Card Needed',
    card2Title: '48-Hour Live Delivery',
    card2Badge: 'Rapid Mobile Staging',
    card2Desc: 'From sending your brand details to having a private staging link on your phone in under 48 hours.',
    card2Cta: 'View Live Case Studies',
    card3Title: 'Direct WhatsApp Chat',
    card3Badge: 'Speak to Lead Engineer',
    card3Desc: 'No sales reps or bot delays. Message our lead creative engineer directly to claim your 48h spec slot.',
    card3Cta: 'Message on WhatsApp',
  };

  const reassurance = t.pricing?.reassurance || fallbackReassurance;

  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 border-t border-zinc-200 dark:border-white/10 relative z-20 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="text-xs font-mono tracking-widest text-zinc-500 dark:text-white/40 mb-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-700 dark:text-white/60">{t.pricing.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-display mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-zinc-600 dark:text-white/60 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-sans leading-relaxed">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Main Hero Tier: The €500 + €20/mo Signature Package (Span 7) */}
          <motion.div 
            whileHover={appleGestures.cardHover}
            className="lg:col-span-7 relative rounded-[32px] p-8 sm:p-10 border border-emerald-500/40 bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl shadow-2xl flex flex-col justify-between"
          >
            {/* Top Ribbon */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 font-bold">
                {t.pricing.signature.badge}
              </span>
              <span className="text-xs font-mono text-zinc-500 dark:text-white/40">
                {t.pricing.signature.subBadge}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white font-display tracking-tight mb-2">
                {t.pricing.signature.title}
              </h3>
              <p className="text-zinc-600 dark:text-white/60 text-sm mb-6 leading-relaxed font-sans">
                {t.pricing.signature.desc}
              </p>

              {/* Price Breakdown */}
              <div className="p-6 rounded-[24px] bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 mb-8 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-zinc-200 dark:border-white/10">
                  <div>
                    <span className="text-4xl sm:text-5xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">€500</span>
                    <span className="text-zinc-500 dark:text-white/60 text-xs sm:text-sm font-mono ml-2">{t.pricing.signature.oneTime}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto font-semibold">
                    {t.pricing.signature.approvalBadge}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">+ €20</span>
                    <span className="text-zinc-500 dark:text-white/60 text-xs font-mono">{t.pricing.signature.perMonth}</span>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-white/40 font-mono">
                    {t.pricing.signature.subNote}
                  </span>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3.5 mb-8">
                {(t.pricing?.signature?.features || []).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700 dark:text-white/80">
                    <div className="mt-0.5 rounded-full p-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[1.75]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct CTA: Capsule Action Button */}
            <div>
              <motion.a
                whileHover={appleGestures.primaryButton.hover}
                whileTap={appleGestures.primaryButton.tap}
                href="https://wa.me/351912345678?text=Hello%20AX07,%20I%20would%20like%20to%20request%20the%20€500%20Signature%203D%20Spec%20with%20zero%20deposit."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-medium text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-shadow cursor-pointer"
              >
                <Sparkles className="w-4 h-4 stroke-[1.75]" />
                <span>{t.pricing.signature.cta}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[1.75]" />
              </motion.a>
              <p className="text-center text-[10px] font-mono text-zinc-400 dark:text-white/40 mt-2.5">
                {t.pricing.signature.guaranteeNote}
              </p>
            </div>
          </motion.div>

          {/* Secondary Plan: Growth & AI Automation (Span 5) */}
          <motion.div 
            whileHover={appleGestures.cardHover}
            className="lg:col-span-5 relative rounded-[32px] p-8 sm:p-10 border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-white/60 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04]">
                  {t.pricing.growth.badge}
                </span>
                <span className="text-xs font-mono text-zinc-400 dark:text-white/40">
                  {t.pricing.growth.subBadge}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white font-display tracking-tight mb-2">
                {t.pricing.growth.title}
              </h3>
              <p className="text-zinc-600 dark:text-white/60 text-sm mb-6 leading-relaxed font-sans">
                {t.pricing.growth.desc}
              </p>

              {/* Price Box */}
              <div className="p-6 rounded-[24px] bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 mb-8 backdrop-blur-md">
                <div className="flex items-baseline justify-between pb-3 border-b border-zinc-200 dark:border-white/10">
                  <span className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">€1,200</span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-white/60">{t.pricing.growth.oneTime}</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-xl font-display font-bold text-zinc-900 dark:text-white/90 tracking-tight">+ €45/mo</span>
                  <span className="text-xs font-mono text-zinc-400 dark:text-white/40">priority edge ops</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {(t.pricing?.growth?.features || []).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-zinc-700 dark:text-white/80">
                    <Check className="w-3.5 h-3.5 text-zinc-400 dark:text-white/40 shrink-0 mt-0.5 stroke-[1.75]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Glass System Control (Secondary Action Button) */}
            <motion.a
              whileHover={appleGestures.secondaryButton.hover}
              whileTap={appleGestures.secondaryButton.tap}
              href="https://wa.me/351912345678?text=Hello%20AX07,%20I%20am%20interested%20in%20the%20Growth%20&%20AI%20Automation%20system."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-full bg-zinc-200/80 dark:bg-white/10 backdrop-blur-md border border-zinc-300 dark:border-white/15 text-zinc-900 dark:text-white font-medium text-sm hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.pricing.growth.cta}</span>
              <MessageSquare className="w-4 h-4 text-emerald-500 dark:text-emerald-400 stroke-[1.75]" />
            </motion.a>
          </motion.div>

        </div>

        {/* The Zero-Risk Reassurance & Direct Delivery Bar */}
        <div className="mt-12 max-w-5xl mx-auto rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-white/10">
            
            {/* 1. Zero-Risk Guarantee */}
            <div className="flex flex-col justify-between gap-3 pt-6 md:pt-0 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-display tracking-tight">{reassurance.card1Title}</h4>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">{reassurance.card1Badge}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-white/60 leading-relaxed font-sans">
                {reassurance.card1Desc}
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-white/60 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 px-3 py-1 rounded-full font-medium">
                  {reassurance.card1Tag}
                </span>
              </div>
            </div>

            {/* 2. 48h Direct Staging Link */}
            <div className="flex flex-col justify-between gap-3 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                  <Zap className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-display tracking-tight">{reassurance.card2Title}</h4>
                  <p className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">{reassurance.card2Badge}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-white/60 leading-relaxed font-sans">
                {reassurance.card2Desc}
              </p>
              <div className="pt-1">
                <a
                  href="#project-showcase"
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full transition-colors cursor-pointer group font-medium"
                >
                  <span>{reassurance.card2Cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform stroke-[1.75]" />
                </a>
              </div>
            </div>

            {/* 3. Direct WhatsApp Chat */}
            <div className="flex flex-col justify-between gap-3 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <MessageSquare className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-display tracking-tight">{reassurance.card3Title}</h4>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">{reassurance.card3Badge}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-white/60 leading-relaxed font-sans">
                {reassurance.card3Desc}
              </p>
              <div className="pt-1">
                <a
                  href="https://wa.me/351912345678?text=Hello%20AX07,%20I%20would%20like%20to%20chat%20directly%20about%20a%2048h%203D%20spec%20build."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-white bg-emerald-500/15 dark:bg-emerald-500/20 hover:bg-emerald-500/25 dark:hover:bg-emerald-500/30 border border-emerald-500/40 px-3.5 py-1 rounded-full transition-colors cursor-pointer group font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{reassurance.card3Cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform stroke-[1.75]" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Pricing;
