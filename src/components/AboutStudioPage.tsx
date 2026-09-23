'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Zap, 
  Cpu, 
  Boxes, 
  Flame, 
  ShieldCheck, 
  Terminal, 
  Globe2, 
  Database, 
  Workflow, 
  ArrowUpRight, 
  MessageSquare, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Compass,
  Laptop
} from 'lucide-react';
import { CommandIsland } from './CommandIsland';
import { Footer } from './Footer';
import { Dock } from './Dock';
import { LogoCanvas } from './LogoCanvas';
import { CountryContent } from '../lib/content';
import { useApp } from '../context/ThemeLanguageContext';
import { appleSprings } from '../lib/design-system';

export interface AboutStudioPageProps {
  countryContent?: CountryContent;
}

const TECH_STACK_ITEMS = [
  {
    name: 'Next.js 15+ (App Router)',
    category: 'Framework & Edge SSR',
    metric: '< 180ms TTFB',
    description: 'React Server Components and streaming edge rendering ensure near-zero client-side hydration penalty and perfect Core Web Vitals.',
    icon: Code2,
    badgeColor: 'emerald',
  },
  {
    name: 'React Three Fiber & Three.js',
    category: '3D WebGL Spatial Engine',
    metric: '60 FPS Hardware Render',
    description: 'Declarative GPU-accelerated 3D meshes, custom particle point clouds, and dynamic camera choreography that convert passive visitors into buyers.',
    icon: Boxes,
    badgeColor: 'blue',
  },
  {
    name: 'Custom GLSL Shaders',
    category: 'Graphics Kernel',
    metric: 'Direct GPU Shaders',
    description: 'Low-level vertex and fragment shader kernels for realistic fluid dynamics, wave distortion, and luminous particle scattering.',
    icon: Cpu,
    badgeColor: 'purple',
  },
  {
    name: 'Vercel Global Edge Network',
    category: 'Multi-Region Infrastructure',
    metric: '300+ Edge POPs',
    description: 'Sub-50ms distributed cache routing, automatic SSL renewal, and instantaneous smart compression worldwide.',
    icon: Globe2,
    badgeColor: 'sky',
  },
  {
    name: 'Supabase & PostgreSQL',
    category: 'Reactive Cloud Storage',
    metric: 'Instant Sync Engine',
    description: 'Row-level security, instant realtime subscriptions, and ACID-compliant transactional persistence for customer bookings.',
    icon: Database,
    badgeColor: 'amber',
  },
  {
    name: 'n8n Webhook Automations',
    category: 'Workflow & Routing',
    metric: '0.2s Dispatch Speed',
    description: 'Immediate 1-click WhatsApp customer routing, automated Stripe invoice generation, and private staging deployment webhooks.',
    icon: Workflow,
    badgeColor: 'rose',
  },
];

export function AboutStudioPage({ countryContent }: AboutStudioPageProps = {}) {
  const { lang } = useApp();
  const whatsappNumber = countryContent?.whatsappNumber || (lang === 'pt' ? '351912345678' : '353871234567');
  const countrySlug = countryContent?.countrySlug || 'ie';

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-white selection:bg-zinc-900/10 dark:selection:bg-white/20 transition-colors duration-300">
      
      {/* Top Floating Command Island Navbar */}
      <CommandIsland countryContent={countryContent} activePage="about" />

      {/* Ambient background glows */}
      <div 
        aria-hidden="true" 
        className="fixed top-24 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-blue-500/5 dark:bg-blue-500/10 blur-[160px] rounded-full pointer-events-none" 
      />

      <main className="relative z-10 pt-32 sm:pt-40 pb-28 px-4 sm:px-6 max-w-6xl mx-auto">
        
        {/* ========================================================================= */}
        {/* SECTION 1: STUDIO MANIFESTO                                               */}
        {/* ========================================================================= */}
        <section className="mb-24 sm:mb-32">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/[0.04] dark:bg-white/[0.05] border border-zinc-900/10 dark:border-white/10 text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-6">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'pt' ? 'O MANIFESTO DO ESTÚDIO' : 'THE STUDIO MANIFESTO'}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-6">
              {lang === 'pt' ? (
                <>Sites lentos matam negócios. <span className="text-zinc-500 dark:text-zinc-400 font-serif italic">Nós matamos a lentidão.</span></>
              ) : (
                <>Slow websites kill businesses. <span className="text-zinc-500 dark:text-zinc-400 font-serif italic">We kill the lag.</span></>
              )}
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              {lang === 'pt'
                ? 'Agências tradicionais vendem modelos pré-fabricados de WordPress com 40 plugins desnecessários e cobram meses para entregar. Nós operamos com engenharia de software pura: WebGL em 60fps, servidores edge distribuídos e risco zero.'
                : 'Traditional agencies sell bloated WordPress themes loaded with 40 third-party plugins that take 8 seconds to load. We build spatial 3D web software compiled for speed, deployed on the edge, and tested live before payment.'}
            </p>
          </div>

          {/* Three Core Tenets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[28px] bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                <Zap className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h2 className="text-lg font-bold font-display mb-2 text-zinc-900 dark:text-white">
                {lang === 'pt' ? '01. Sub-500ms Edge Speed' : '01. Sub-500ms Edge Delivery'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {lang === 'pt'
                  ? 'Cada milissegundo de atraso custa 7% de conversão. Os nossos sites compilam estaticamente na rede Edge global da Vercel para carregar instantaneamente em qualquer telemóvel.'
                  : 'Every 100ms delay causes a 7% drop in inquiries. We compile directly to global edge CDNs so your prospective clients experience immediate, effortless interactions.'}
              </p>
            </div>

            <div className="p-8 rounded-[28px] bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
                <Boxes className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h2 className="text-lg font-bold font-display mb-2 text-zinc-900 dark:text-white">
                {lang === 'pt' ? '02. 3D Espacial a 60 FPS' : '02. 60 FPS Spatial 3D Web'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {lang === 'pt'
                  ? 'Imagens estáticas são ignoradas. Gráficos 3D interativos renderizados em WebGL criam uma presença de luxo que faz com que os seus clientes fiquem 3x mais tempo na página.'
                  : 'Generic flat templates blend into noise. Hardware-accelerated WebGL visuals communicate luxury, authority, and hold prospect attention 3x longer than boring static sites.'}
              </p>
            </div>

            <div className="p-8 rounded-[28px] bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
                <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h2 className="text-lg font-bold font-display mb-2 text-zinc-900 dark:text-white">
                {lang === 'pt' ? '03. Zero Depósito Antecipado' : '03. Zero-Deposit Spec Protocol'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {lang === 'pt'
                  ? 'Não pedimos reuniões de 4 semanas nem adiantamentos. Construímos o seu protótipo completo em 48 horas. Você só paga se ficar impressionado com o resultado.'
                  : 'We don’t pitch theoretical slide decks or demand upfront retainers. We code a live 3D prototype for your business within 48 hours. If you love it, we launch it.'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: TECH ARCHITECTURE GRID                                         */}
        {/* ========================================================================= */}
        <section className="mb-24 sm:mb-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-white/10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-semibold">
                  ENGINEERING FOUNDATION
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-zinc-900 dark:text-white">
                {lang === 'pt' ? 'Arquitetura & Stack Tecnológica' : 'Studio Tech Stack & Architecture'}
              </h2>
            </div>
            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Zero CMS Bloat · 100% Native Code
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECH_STACK_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="p-6 rounded-[24px] bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-900 dark:text-white">
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.metric}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-display text-zinc-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-3">
                      {item.category}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: FOUNDER & LEAD ARCHITECT SPOTLIGHT                             */}
        {/* ========================================================================= */}
        <section className="rounded-[36px] bg-white dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-white/10 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div 
            aria-hidden="true" 
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* 3D Canvas Rig or Portrait Frame */}
            <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[380px] rounded-[28px] overflow-hidden bg-zinc-950 border border-white/10 shadow-inner">
              <LogoCanvas
                canvasId="architect-spotlight-canvas"
                showControls={false}
                showHint={false}
                autoRotate={true}
                defaultMode="particles"
                className="w-full h-full cursor-grab active:cursor-grabbing"
              />
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time WebGL Shader</span>
                </span>
                <span>Active 60 FPS</span>
              </div>
            </div>

            {/* Bio & Philosophy Copy */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/10 text-xs font-mono text-zinc-700 dark:text-zinc-300 mb-4 w-max">
                <Compass className="w-3.5 h-3.5 text-blue-500" />
                <span>LEAD 3D ARCHITECT & FOUNDER</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-zinc-900 dark:text-white mb-4">
                Alex & The AX07 Spec Engineering Team
              </h3>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 font-sans">
                {lang === 'pt'
                  ? 'Com mais de 8 anos dedicados ao desenvolvimento de gráficos 3D na web, renderizadores WebGL e infraestruturas edge de alta disponibilidade, fundámos a AX07 com uma única missão: libertar os empresários de websites genéricos e lentos.'
                  : 'With over 8 years dedicated to creative 3D web engineering, WebGL shader programming, and global edge architectures, we founded AX07 on a direct principle: eliminating sluggish legacy site builders and giving local business owners unfair digital advantages.'}
              </p>

              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed mb-8 font-sans">
                {lang === 'pt'
                  ? 'Não usamos intermediários, gestores de conta desnecessários nem promessas vazias. Falamos diretamente consigo pelo WhatsApp, entregamos código de nível Awwwards e assumimos todo o risco da criação.'
                  : 'You work directly with the architect building your site. No account managers, no bureaucratic delays, and zero upfront risk. We verify our value by building your prototype before you pay.'}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    lang === 'pt'
                      ? 'Olá Alex, estive a ler sobre a filosofia da AX07 e gostaria de conversar sobre o meu projeto.'
                      : 'Hello Alex, I was reading through the AX07 manifesto and would love to discuss a project with you.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  <span>{lang === 'pt' ? 'Conversar com o Alex' : 'Talk Directly on WhatsApp'}</span>
                </a>

                <a
                  href={`/${countrySlug}/work`}
                  className="px-5 py-3 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/15 text-zinc-900 dark:text-white font-medium text-xs sm:text-sm transition-colors border border-zinc-200 dark:border-white/10"
                >
                  {lang === 'pt' ? 'Ver Estudos de Caso' : 'Explore Case Studies'}
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <Dock />
    </div>
  );
}
