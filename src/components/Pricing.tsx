import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldCheck, Zap, ArrowUpRight, MessageSquare, Sparkles } from 'lucide-react';
import { appleGestures } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';
import { CountryContent } from '../lib/content';

export interface PricingProps {
  countryContent?: CountryContent;
}

type PricingFilter = 'all' | 'capex' | 'opex';

export function Pricing({ countryContent }: PricingProps = {}) {
  const { t, lang } = useApp();
  const [canHover, setCanHover] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PricingFilter>('all');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    }
  }, []);

  const whatsappNumber = countryContent?.whatsappNumber || '353894419127';

  // One-Time Payment Specs
  const optionA = {
    badge: lang === 'pt' ? 'PAGAMENTO ÚNICO' : 'ONE-TIME PAYMENT',
    subBadge: lang === 'pt' ? 'Posse Total do Ativo' : 'Full Ownership',
    title: lang === 'pt' ? 'Pagamento Único' : 'One-Time Payment',
    model: lang === 'pt' ? '(Posse Total)' : '(Full Ownership)',
    tagline:
      lang === 'pt'
        ? 'Ideal para empresas consolidadas que pretendem a posse total do ativo digital com baixos custos contínuos.'
        : 'Ideal for established businesses wanting complete digital asset ownership with low ongoing overhead.',
    upfrontFee: '€1,800',
    upfrontLabel: lang === 'pt' ? 'Pagamento único de criação' : 'One-time build fee',
    upfrontBadge: lang === 'pt' ? 'Posse Total do Código' : 'Full Asset Transfer',
    monthlyFee: '€49 / mo',
    monthlyLabel: lang === 'pt' ? 'Mês a mês (sem fidelização)' : 'Month-to-month maintenance',
    monthlyNote: lang === 'pt' ? 'alojamento, segurança e uptime' : 'hosting, security & monitoring',
    deliverables:
      lang === 'pt'
        ? [
            'Engenharia Web Edge personalizada sub-500ms (Next.js / Vercel Edge)',
            'Triagem e encaminhamento direto em 1 toque para WhatsApp',
            'Conformidade de privacidade Zero-Cookie e arquitetura SSL',
            'Garantia de performance mobile sub-500ms',
            'Posse integral do código-fonte e transferência completa do ativo',
            'Alojamento essencial, segurança e monitorização de uptime (€49/mês)',
          ]
        : [
            'Full Custom Sub-500ms Edge Web Engineering (Next.js / Vercel Edge)',
            '1-Tap Direct WhatsApp Triage & Intake Routing',
            'Zero-Cookie Privacy Compliance & SSL Architecture',
            'Sub-500ms Mobile Performance Guarantee',
            'Complete Codebase Ownership & Asset Transfer',
            'Essential Hosting, Security, & Uptime Monitoring (€49/mo)',
          ],
    cta: lang === 'pt' ? 'Selecionar Pagamento Único' : 'Select One-Time Payment',
    waText:
      lang === 'pt'
        ? 'Olá AX07, gostaria de selecionar o Pagamento Único (€1.800 + €49/mês).'
        : 'Hello AX07, I would like to select One-Time Payment (€1,800 build + €49/mo).',
  };

  // Monthly Subscription Specs - Fully aligned with emerald theme and dark CTA button
  const optionB = {
    badge: lang === 'pt' ? 'SUBSCRIÇÃO MENSAL // ENTRADA €0' : 'MONTHLY SUBSCRIPTION // ZERO UPFRONT',
    subBadge: lang === 'pt' ? 'Sem Custos Iniciais' : 'Zero Cash Outlay',
    title: lang === 'pt' ? 'Subscrição Mensal' : 'Monthly Subscription',
    model: lang === 'pt' ? '(Tudo Incluído)' : '(All-Inclusive)',
    tagline:
      lang === 'pt'
        ? 'Engenharia digital com tudo incluído e otimização contínua sem qualquer saída de capital inicial.'
        : 'All-inclusive digital engineering and continuous optimization with zero upfront cash outlay.',
    upfrontFee: '€0',
    upfrontLabel: lang === 'pt' ? 'Sem atrito ou entrada inicial' : 'Zero upfront friction',
    upfrontBadge: lang === 'pt' ? 'Risco Zero Inicial' : 'Zero Cash Outlay',
    monthlyFee: '€200 / mo',
    monthlyLabel: lang === 'pt' ? 'Compromisso mínimo de 12 meses' : '12-Month Minimum Commitment',
    monthlyNote: lang === 'pt' ? 'engenharia e atualizações contínuas' : 'all-inclusive continuous engineering',
    deliverables:
      lang === 'pt'
        ? [
            'Engenharia Web Edge personalizada sub-500ms (Next.js / Vercel Edge)',
            'Triagem e encaminhamento direto em 1 toque para WhatsApp',
            'Conformidade de privacidade Zero-Cookie e manutenção de segurança',
            'Infraestrutura global Vercel Edge gerida e CDN incluída',
            'Atualizações mensais ilimitadas de conteúdos, preços e ementas',
            'Auditorias trimestrais de performance e otimização de conversão',
            'Canal de suporte prioritário com acesso direto ao desenvolvedor',
          ]
        : [
            'Full Custom Sub-500ms Edge Web Engineering (Next.js / Vercel Edge)',
            '1-Tap Direct WhatsApp Triage & Intake Routing',
            'Zero-Cookie Privacy Compliance & Security Maintenance',
            'Managed Vercel Edge Global Infrastructure & CDN Hosting Included',
            'Unlimited Monthly Content, Price, & Menu Updates',
            'Quarterly Performance Audits & Conversion Optimization',
            'Priority Support Channel (Direct Developer Access)',
          ],
    cta: lang === 'pt' ? 'Iniciar Subscrição Mensal (€0 Entrada)' : 'Start Monthly Subscription (€0 Upfront)',
    waText:
      lang === 'pt'
        ? 'Olá AX07, gostaria de iniciar a Subscrição Mensal (€0 de entrada, €200/mês).'
        : 'Hello AX07, I would like to start Monthly Subscription (€0 upfront, €200/month).',
  };

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
    <section 
      id="pricing" 
      className="py-24 sm:py-32 px-4 sm:px-6 border-t border-zinc-200 dark:border-white/10 relative z-20 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs font-mono tracking-widest text-zinc-500 dark:text-zinc-400 mb-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-zinc-700 dark:text-zinc-300 uppercase tracking-widest font-mono text-[11px]">
              {lang === 'pt' ? 'MODELO DE PREÇOS // PAGAMENTO ÚNICO OU SUBSCRIÇÃO MENSAL' : 'PRICING ARCHITECTURE // ONE-TIME PAYMENT OR MONTHLY SUBSCRIPTION'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white font-display mb-4">
            {lang === 'pt' ? 'Estrutura de Preços Transparente.' : 'Engineered for Immediate ROI.'}
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            {lang === 'pt'
              ? 'Escolha entre o pagamento único com posse integral do ativo digital, ou aceleração total sem investimento inicial através da nossa subscrição mensal gerida.'
              : 'Choose between a one-time payment with complete digital asset ownership, or all-inclusive digital engineering with zero upfront cash outlay through our monthly subscription.'}
          </p>

          {/* Interactive Comparison Filter Toggle */}
          <div className="mt-8 inline-flex p-1 rounded-full bg-zinc-200/70 dark:bg-zinc-900/90 border border-zinc-300 dark:border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                activeFilter === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {lang === 'pt' ? 'Comparação Lado a Lado' : 'Side-by-Side Comparison'}
            </button>
            <button
              onClick={() => setActiveFilter('capex')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                activeFilter === 'capex'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {lang === 'pt' ? 'Pagamento Único' : 'One-Time Payment'}
            </button>
            <button
              onClick={() => setActiveFilter('opex')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                activeFilter === 'opex'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {lang === 'pt' ? 'Subscrição Mensal' : 'Monthly Subscription'}
            </button>
          </div>
        </div>

        {/* Pricing Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* ============================================================ */}
          {/* OPTION A: "Asset Ownership" (CapEx)                         */}
          {/* ============================================================ */}
          <AnimatePresence mode="popLayout">
            {(activeFilter === 'all' || activeFilter === 'capex') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                whileHover={canHover ? appleGestures.cardHover : undefined}
                className={`relative rounded-[32px] p-8 sm:p-10 border transition-all duration-300 flex flex-col justify-between ${
                  activeFilter === 'capex' ? 'lg:col-span-2 max-w-2xl mx-auto w-full' : ''
                } border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-zinc-300 dark:hover:border-white/20`}
              >
                <div>
                  {/* Top Badge & Subtitle */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-700 dark:text-zinc-300 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.05] font-semibold">
                      {optionA.badge}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {optionA.subBadge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white font-display tracking-tight mb-2">
                      {optionA.title}{' '}
                      <span className="text-base sm:text-lg font-mono font-normal text-zinc-500 dark:text-zinc-400">
                        {optionA.model}
                      </span>
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans">
                      "{optionA.tagline}"
                    </p>
                  </div>

                  {/* Price Box */}
                  <div className="p-6 rounded-[24px] bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 mb-8 backdrop-blur-md">
                    {/* Upfront Build Fee */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-zinc-200 dark:border-white/10">
                      <div>
                        <span className="text-4xl sm:text-5xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
                          {optionA.upfrontFee}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-mono ml-2">
                          {optionA.upfrontLabel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/25 self-start sm:self-auto font-semibold">
                        {optionA.upfrontBadge}
                      </span>
                    </div>

                    {/* Monthly Maintenance */}
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-2xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
                          {optionA.monthlyFee}
                        </span>
                        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 ml-2">
                          {optionA.monthlyLabel}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 text-right">
                        {optionA.monthlyNote}
                      </span>
                    </div>
                  </div>

                  {/* Key Deliverables */}
                  <div className="mb-8">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3.5 font-semibold">
                      {lang === 'pt' ? 'Entregáveis Incluídos:' : 'Key Deliverables:'}
                    </p>
                    <ul className="space-y-3">
                      {optionA.deliverables.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                          <div className="mt-0.5 rounded-full p-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                          </div>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Option A CTA Button */}
                <div className="pt-2">
                  <motion.a
                    whileHover={appleGestures.secondaryButton.hover}
                    whileTap={appleGestures.secondaryButton.tap}
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(optionA.waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-full border border-stone-300 dark:border-[#EBE3D5]/35 hover:border-stone-500 dark:hover:border-[#EBE3D5]/80 bg-stone-100 hover:bg-stone-200 dark:bg-[#EBE3D5]/[0.05] dark:hover:bg-[#EBE3D5]/[0.12] text-stone-900 dark:text-[#F5EFE6] font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_0_20px_rgba(235,227,213,0.18)] transition-all duration-300 cursor-pointer group"
                  >
                    <span>{optionA.cta}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform stroke-[2]" />
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================================================ */}
          {/* OPTION B: "Digital Front Door Membership" (OpEx / Recommended) */}
          {/* ============================================================ */}
          <AnimatePresence mode="popLayout">
            {(activeFilter === 'all' || activeFilter === 'opex') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                whileHover={canHover ? appleGestures.cardHover : undefined}
                className={`relative rounded-[32px] p-8 sm:p-10 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  activeFilter === 'opex' ? 'lg:col-span-2 max-w-2xl mx-auto w-full' : ''
                } border-emerald-500/30 dark:border-emerald-500/40 bg-white dark:bg-white/[0.03] backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-emerald-500/60 dark:hover:border-emerald-500/60 ring-1 ring-emerald-500/20`}
              >
                {/* Ambient Soft Emerald Glow Backdrop */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

                <div>
                  {/* Top Glowing Emerald Ribbon */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 dark:bg-emerald-500/15 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      {optionB.badge}
                    </span>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {optionB.subBadge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-6 relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white font-display tracking-tight mb-2">
                      {optionB.title}{' '}
                      <span className="text-base sm:text-lg font-mono font-normal text-emerald-600 dark:text-emerald-400">
                        {optionB.model}
                      </span>
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-sans">
                      "{optionB.tagline}"
                    </p>
                  </div>

                  {/* Price Box with Green Theme */}
                  <div className="p-6 rounded-[24px] bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] border border-emerald-500/20 dark:border-emerald-500/25 mb-8 backdrop-blur-md relative z-10">
                    {/* Upfront Build Fee: €0 */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-zinc-200 dark:border-white/10">
                      <div>
                        <span className="text-4xl sm:text-5xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
                          {optionB.upfrontFee}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-mono ml-2">
                          {optionB.upfrontLabel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                        {optionB.upfrontBadge}
                      </span>
                    </div>

                    {/* Monthly Subscription: €200 / mo in Green Theme */}
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                          {optionB.monthlyFee}
                        </span>
                        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 ml-2">
                          {optionB.monthlyLabel}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700/90 dark:text-emerald-400/90 text-right font-medium">
                        {optionB.monthlyNote}
                      </span>
                    </div>
                  </div>

                  {/* Key Deliverables */}
                  <div className="mb-8 relative z-10">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-3.5 font-semibold">
                      {lang === 'pt' ? 'Entregáveis Incluídos:' : 'Key Deliverables:'}
                    </p>
                    <ul className="space-y-3">
                      {optionB.deliverables.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                          <div className="mt-0.5 rounded-full p-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                            <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                          </div>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Option B CTA Button: Dark Black Button with Green Accent / Glow */}
                <div className="pt-2 relative z-10">
                  <motion.a
                    whileHover={appleGestures.primaryButton.hover}
                    whileTap={appleGestures.primaryButton.tap}
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(optionB.waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-full bg-zinc-950 text-white dark:bg-black dark:text-white border border-zinc-800 dark:border-emerald-500/30 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-zinc-900 dark:hover:bg-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-300 cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400 stroke-[2]" />
                    <span>{optionB.cta}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform stroke-[2]" />
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Clean Micro-Copy Note below pricing grid */}
        <div className="mt-8 text-center max-w-3xl mx-auto px-4">
          <p className="text-xs sm:text-sm font-mono text-zinc-500 dark:text-zinc-400 tracking-wide leading-relaxed">
            *All plans include sub-500ms mobile performance guarantees, zero-cookie GDPR compliance, and direct WhatsApp triage integration.*
          </p>
        </div>

        {/* The Zero-Risk Reassurance & Direct Delivery Bar */}
        <div className="mt-14 max-w-5xl mx-auto rounded-[32px] border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 shadow-xl">
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
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {reassurance.card1Desc}
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/10 px-3 py-1 rounded-full font-medium">
                  {reassurance.card1Tag}
                </span>
              </div>
            </div>

            {/* 2. 48h Direct Staging Link */}
            <div className="flex flex-col justify-between gap-3 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Zap className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-display tracking-tight">{reassurance.card2Title}</h4>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">{reassurance.card2Badge}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {reassurance.card2Desc}
              </p>
              <div className="pt-1">
                <a
                  href="#project-showcase"
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 px-3 py-1 rounded-full transition-colors cursor-pointer group font-medium"
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
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {reassurance.card3Desc}
              </p>
              <div className="pt-1">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    lang === 'pt'
                      ? 'Olá AX07, gostaria de falar diretamente sobre a proposta de preços e protótipo em 48h.'
                      : 'Hello AX07, I would like to chat directly about the pricing options and 48h spec build.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-3.5 py-1 rounded-full transition-colors cursor-pointer group font-semibold"
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
