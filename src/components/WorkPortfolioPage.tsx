'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Percent, 
  ExternalLink, 
  MessageSquare, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Code2, 
  Filter,
  Eye,
  Box
} from 'lucide-react';
import { CommandIsland } from './CommandIsland';
import { Footer } from './Footer';
import { Dock } from './Dock';
import { LogoCanvas } from './LogoCanvas';
import { CountryContent } from '../lib/content';
import { useApp } from '../context/ThemeLanguageContext';
import { appleSprings } from '../lib/design-system';

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  nicheBadge: string;
  category: 'marine' | 'sports' | 'fintech' | 'hospitality';
  tagline: string;
  description: string;
  speedMetric: string;
  growthMetric: string;
  feeMetric: string;
  previewImage: string;
  defaultCanvasMode: 'particles' | 'fluid' | 'wireframe';
  demoUrl: string;
  externalUrl?: string;
  techTags: string[];
  launchYear: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'ocean-charters',
    slug: 'ocean-charters',
    title: 'Ocean Charters',
    client: 'Ocean Charters Algarve',
    nicheBadge: 'Ocean Charters — Luxury Marine',
    category: 'marine',
    tagline: 'Direct luxury yacht booking engine with 3D ocean depth simulation.',
    description:
      'Replaced an antiquated WordPress booking form with an interactive WebGL catamaran customizer, 1-click WhatsApp VIP concierge, and sub-second global edge distribution.',
    speedMetric: '⚡ 340ms Speed',
    growthMetric: '📈 +48% Direct Inquiries',
    feeMetric: '💼 0% OTA Fees',
    previewImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2000&q=85',
    defaultCanvasMode: 'fluid',
    demoUrl: '/demo/ocean-charters',
    techTags: ['React Three Fiber', 'Next.js 15', 'WhatsApp API', 'GLSL Water Shader'],
    launchYear: '2025',
  },
  {
    id: 'flyfoil',
    slug: 'flyfoil',
    title: 'FlyFoil Formosa',
    client: 'FlyFoil Formosa',
    nicheBadge: 'FlyFoil Formosa — Extreme Sports',
    category: 'sports',
    tagline: 'Electric hydrofoil board rental & live tidal condition radar.',
    description:
      'Engineered an interactive 3D eFoil kinetic configurator with real-time weather integration and instantaneous mobile WhatsApp checkout, eliminating third-party rental portal commissions.',
    speedMetric: '⚡ 380ms Speed',
    growthMetric: '📈 +42% Direct Inquiries',
    feeMetric: '💼 0% OTA Fees',
    previewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
    defaultCanvasMode: 'particles',
    demoUrl: '/demo/flyfoil',
    externalUrl: 'https://flyfoil-formosa.vercel.app',
    techTags: ['Three.js', 'Framer Motion', 'Vercel Edge', 'Tailwind CSS'],
    launchYear: '2024',
  },
  {
    id: 'altura-kites',
    slug: 'altura',
    title: 'Altura Kites',
    client: 'Altura Kites Academy',
    nicheBadge: 'Altura Kites — Watersports & Training',
    category: 'sports',
    tagline: 'IKO certified kitesurf school booking engine with wind telemetry.',
    description:
      'Created a tactile high-motion booking portal where students lock in private downwinders and equipment packages directly through local coach chat threads.',
    speedMetric: '⚡ 310ms Speed',
    growthMetric: '📈 +54% Direct Inquiries',
    feeMetric: '💼 0% OTA Fees',
    previewImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=85',
    defaultCanvasMode: 'wireframe',
    demoUrl: '/demo/altura',
    externalUrl: 'https://altura-kites.vercel.app',
    techTags: ['Next.js App Router', 'WebGL Particles', 'Stripe & WhatsApp', 'Edge Middleware'],
    launchYear: '2024',
  },
  {
    id: 'fintrack',
    slug: 'fintrack',
    title: 'FinTrack AI',
    client: 'FinTrack Wealth Advisory',
    nicheBadge: 'FinTrack AI — Quantitative Wealth',
    category: 'fintech',
    tagline: 'High-frequency algorithmic portfolio visualizer & private wealth interface.',
    description:
      'Designed a dark, luxury terminal interface rendering real-time cryptographic asset telemetry and predictive volatility nodes in 60fps WebGL canvas.',
    speedMetric: '⚡ 290ms Speed',
    growthMetric: '📈 +65% High-Net-Worth Leads',
    feeMetric: '💼 0% Intermediary Overhead',
    previewImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2000&q=85',
    defaultCanvasMode: 'particles',
    demoUrl: '/demo/fintrack',
    externalUrl: 'https://fintrack-ai.vercel.app',
    techTags: ['WebGL Shaders', 'Server Actions', 'Realtime WebSockets', 'Radix UI'],
    launchYear: '2025',
  },
  {
    id: 'la-kafeteria',
    slug: 'la-kafeteria',
    title: 'La Kafeteria',
    client: 'La Kafeteria Specialty Roasters',
    nicheBadge: 'La Kafeteria — Specialty Hospitality',
    category: 'hospitality',
    tagline: 'Micro-roastery subscription engine & sensory origin map.',
    description:
      'Transformed a local café brand into a global subscription direct-to-consumer store with interactive 3D origin topography and WhatsApp gift card dispatch.',
    speedMetric: '⚡ 360ms Speed',
    growthMetric: '📈 +38% Repeat Orders',
    feeMetric: '💼 0% Aggregator Platform Cut',
    previewImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=85',
    defaultCanvasMode: 'fluid',
    demoUrl: '/demo/la-kafeteria',
    techTags: ['Shopify Headless', 'Next.js 15', 'Three.js Camera Rig', 'Tailwind CSS'],
    launchYear: '2024',
  },
  {
    id: 'cryptoax07',
    slug: 'cryptoax07',
    title: 'CryptoAX07',
    client: 'CryptoAX07 Protocol',
    nicheBadge: 'CryptoAX07 — Web3 Infrastructure',
    category: 'fintech',
    tagline: 'Non-custodial zero-knowledge bridge & liquidity terminal.',
    description:
      'Constructed a quantum-inspired particle cluster representing cross-chain liquidity depth with zero latency execution metrics and verified smart contract triggers.',
    speedMetric: '⚡ 275ms Speed',
    growthMetric: '📈 +72% Protocol Retention',
    feeMetric: '💼 0% Centralized Intermediary',
    previewImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=2000&q=85',
    defaultCanvasMode: 'particles',
    demoUrl: '/demo/cryptoax07',
    externalUrl: 'https://cryptoax07.vercel.app',
    techTags: ['R3F Fiber', 'GLSL Kernels', 'Wagmi / Viem', 'Edge Streaming'],
    launchYear: '2025',
  },
];

export interface WorkPortfolioPageProps {
  countryContent?: CountryContent;
}

export function WorkPortfolioPage({ countryContent }: WorkPortfolioPageProps = {}) {
  const { lang } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'marine' | 'sports' | 'fintech' | 'hospitality'>('all');
  const [canvasModeMap, setCanvasModeMap] = useState<Record<string, boolean>>({
    'ocean-charters': true,
    'flyfoil': true,
  });

  const whatsappNumber = countryContent?.whatsappNumber || (lang === 'pt' ? '351912345678' : '353871234567');
  const countrySlug = countryContent?.countrySlug || 'ie';

  const filteredStudies = selectedFilter === 'all' 
    ? CASE_STUDIES 
    : CASE_STUDIES.filter((c) => c.category === selectedFilter);

  const toggle3D = (id: string) => {
    setCanvasModeMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-white selection:bg-zinc-900/10 dark:selection:bg-white/20 transition-colors duration-300">
      
      {/* Top Floating Command Island Navbar */}
      <CommandIsland countryContent={countryContent} activePage="work" />

      {/* Ambient background glows */}
      <div 
        aria-hidden="true" 
        className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" 
      />

      <main className="relative z-10 pt-32 sm:pt-40 pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* Page Hero Header */}
        <section className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/[0.04] dark:bg-white/[0.05] border border-zinc-900/10 dark:border-white/10 text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lang === 'pt' ? 'ESTUDOS DE CASO & RESULTADOS REAIS' : 'PORTFOLIO & VERIFIED CASE STUDIES'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
            {lang === 'pt' ? (
              <>Experiências 3D que <span className="text-zinc-500 dark:text-zinc-400 font-serif italic">convertem</span> sem intermediários.</>
            ) : (
              <>Crafted for speed. <span className="text-zinc-500 dark:text-zinc-400 font-serif italic">Engineered</span> for direct revenue.</>
            )}
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto">
            {lang === 'pt' 
              ? 'Todos os protótipos foram entregues em menos de 48 horas e testados ao vivo antes do primeiro pagamento. Sem taxas para plataformas de terceiros. Apenas reservas diretas.'
              : 'Every build was deployed in 48 hours and live-tested before payment. Zero commissions paid to Booking.com, Airbnb, or middleman aggregators.'}
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mt-10">
            {[
              { id: 'all', label: lang === 'pt' ? 'Todos os Projetos' : 'All Work' },
              { id: 'marine', label: lang === 'pt' ? 'Náutica & Turismo' : 'Luxury Marine' },
              { id: 'sports', label: lang === 'pt' ? 'Desportos & Atividades' : 'Watersports' },
              { id: 'fintech', label: lang === 'pt' ? 'Fintech & Web3' : 'Fintech & AI' },
              { id: 'hospitality', label: lang === 'pt' ? 'Hotelaria & Café' : 'Hospitality' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md'
                    : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/60 dark:border-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredStudies.map((study, idx) => {
              const is3DActive = !!canvasModeMap[study.id];

              const whatsappInquiryUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Hi Alex, I was viewing the ${study.title} case study on AX07 and would love to build a similar 3D experience for my business.`
              )}`;

              return (
                <motion.article
                  key={study.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ ...appleSprings.default, delay: idx * 0.05 }}
                  className="group rounded-[32px] bg-white dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-zinc-400/80 dark:hover:border-white/25"
                >
                  {/* Top Interactive Preview Stage (Toggleable 3D WebGL vs Image) */}
                  <div className="relative w-full h-[280px] sm:h-[340px] bg-zinc-950 overflow-hidden select-none">
                    {is3DActive ? (
                      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                        <LogoCanvas
                          canvasId={`case-${study.id}`}
                          showControls={false}
                          showHint={true}
                          autoRotate={true}
                          defaultMode={study.defaultCanvasMode}
                          className="w-full h-full"
                        />
                        <div className="absolute top-4 left-4 z-20 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Interactive 3D WebGL</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full relative overflow-hidden">
                        <img
                          src={study.previewImage}
                          alt={study.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                      </div>
                    )}

                    {/* View Switcher Toggle (3D WebGL / High-Res Imagery) */}
                    <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md p-1 rounded-full border border-white/15 text-white">
                      <button
                        type="button"
                        onClick={() => toggle3D(study.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                          is3DActive ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                        title="Toggle Interactive 3D Canvas"
                      >
                        <Box className="w-3 h-3" />
                        <span>3D Canvas</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggle3D(study.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                          !is3DActive ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                        title="Toggle High-Res Photo"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Static</span>
                      </button>
                    </div>

                    {/* Launch Year Badge */}
                    <div className="absolute top-4 right-4 z-20 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300">
                        {study.launchYear}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Project Niche Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-700 dark:text-zinc-300 mb-4 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{study.nicheBadge}</span>
                      </div>

                      {/* Project Title & Tagline */}
                      <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-zinc-900 dark:text-white mb-2">
                        {study.title}
                      </h2>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3 font-sans">
                        {study.tagline}
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans mb-6">
                        {study.description}
                      </p>

                      {/* Performance Metrics Grid: 380ms Speed | +40% Inquiries | 0% OTA Fees */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-white/5 mb-6 text-center">
                        <div className="p-1">
                          <div className="text-xs sm:text-sm font-bold font-mono text-zinc-900 dark:text-white tracking-tight">
                            {study.speedMetric}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500 uppercase mt-0.5">
                            Edge TTFB
                          </div>
                        </div>
                        <div className="p-1 border-x border-zinc-200/60 dark:border-white/10">
                          <div className="text-xs sm:text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                            {study.growthMetric}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500 uppercase mt-0.5">
                            Inquiries
                          </div>
                        </div>
                        <div className="p-1">
                          <div className="text-xs sm:text-sm font-bold font-mono text-blue-600 dark:text-blue-400 tracking-tight">
                            {study.feeMetric}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500 uppercase mt-0.5">
                            Commission
                          </div>
                        </div>
                      </div>

                      {/* Tech stack badges */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {study.techTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/[0.04] text-[11px] font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between gap-3">
                      <a
                        href={study.demoUrl}
                        className="flex-1 px-4 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span>{lang === 'pt' ? 'Ver Staging 3D' : 'Open Staging Demo'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                      </a>

                      <a
                        href={whatsappInquiryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/15 text-zinc-900 dark:text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 border border-zinc-200/80 dark:border-white/10"
                        title="Inquire Similar Build"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="hidden sm:inline">{lang === 'pt' ? 'Pedir Semelhante' : 'Inquire Similar'}</span>
                      </a>
                    </div>

                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </section>

        {/* Bottom Banner: Request 48h Spec Build */}
        <section className="mt-20 sm:mt-28 p-8 sm:p-14 rounded-[36px] bg-zinc-900 text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div 
            aria-hidden="true" 
            className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" 
          />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-3 block">
              {lang === 'pt' ? 'SEM DEPÓSITO ANTECIPADO' : 'RISK-FREE 48-HOUR SPEC PROTOTYPE'}
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold font-display tracking-tight mb-4">
              {lang === 'pt' 
                ? 'Pronto para substituir o seu site por uma máquina de conversão 3D?' 
                : 'Ready for a 3D web experience that your clients actually remember?'}
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8">
              {lang === 'pt'
                ? `Construímos o seu protótipo em 48 horas. Se aprovar, paga apenas ${countryContent?.pricingUpfront || '€500'}. Caso contrário, não deve um único cêntimo.`
                : `We build your custom 3D prototype in 48 hours. If you love it, you pay ${countryContent?.pricingUpfront || '€1,800'}. If not, you pay nothing.`}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  lang === 'pt'
                    ? 'Olá Alex, estive a ver a página de projetos e gostaria de pedir o meu protótipo 3D gratuito em 48h.'
                    : 'Hello Alex, I was browsing the portfolio page and would like to claim my free 48h 3D spec prototype.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition-colors shadow-lg flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-emerald-600 stroke-none" />
                <span>{lang === 'pt' ? 'Pedir Amostra no WhatsApp' : 'Claim 48h Spec on WhatsApp'}</span>
              </a>
              <a
                href={`/${countrySlug}#pricing`}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors border border-white/10"
              >
                {lang === 'pt' ? 'Ver Tabela de Preços' : 'View Pricing Plans'}
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <Dock />
    </div>
  );
}
