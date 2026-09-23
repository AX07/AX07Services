import React from 'react';
import { ArrowUpRight, MessageSquare, ExternalLink, ShieldCheck, Sparkles, Smartphone, Monitor, RotateCcw } from 'lucide-react';
import { AppProvider } from '@/src/context/ThemeLanguageContext';

interface DemoProps {
  params: Promise<{ client: string }> | { client: string };
  searchParams?: Promise<{ url?: string }> | { url?: string };
}

// Sample fallback staging deployments for known portfolio projects
const clientDeploymentMap: Record<string, string> = {
  flyfoil: 'https://flyfoil-formosa.vercel.app',
  altura: 'https://altura-kites.vercel.app',
  fintrack: 'https://fintrack-ai.vercel.app',
  cryptoax07: 'https://cryptoax07.vercel.app',
  albania: 'https://albania-facil.vercel.app',
};

export default async function ClientDemoPage({ params, searchParams }: DemoProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const clientSlug = resolvedParams?.client || 'client';
  const formattedName = decodeURIComponent(clientSlug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Determine external Vercel deployment URL
  const externalUrl =
    resolvedSearchParams?.url ||
    clientDeploymentMap[clientSlug.toLowerCase()] ||
    `https://${clientSlug}.vercel.app`;

  // Pre-filled WhatsApp message as explicitly requested
  const whatsappQuery = encodeURIComponent(
    `Hi Alex, I reviewed the 3D prototype for ${formattedName} at ax07services.com/demo/${clientSlug} and want to discuss launching it live.`
  );
  const whatsappUrl = `https://wa.me/351912345678?text=${whatsappQuery}`;

  return (
    <AppProvider>
      <div className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-zinc-950 font-sans select-none">
        
        {/* ========================================================================= */}
        {/* 1. TOP FLOATING GLASSMORPHISM BAR (Persistent Overlay Controls)            */}
        {/* ========================================================================= */}
        <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-5xl pointer-events-auto">
          <div className="bg-zinc-950/85 dark:bg-zinc-950/85 backdrop-blur-2xl border border-white/15 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 text-white transition-all">
            
            {/* Left Action: Back to Home */}
            <div className="flex items-center gap-2">
              <a
                href="https://ax07services.com"
                className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition-colors"
                title="Return to AX07 Services"
              >
                <span className="text-zinc-400 group-hover:-translate-x-0.5 transition-transform">←</span>
                <span className="font-display tracking-tight">AX07 Services</span>
              </a>
            </div>

            {/* Center Badge: Private Staging Preview */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">
                Private Staging Preview for <strong className="text-white font-semibold font-sans">{formattedName}</strong>
              </span>
            </div>

            {/* Mobile simplified badge */}
            <div className="flex md:hidden items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate max-w-[120px] font-sans text-white font-medium">{formattedName}</span>
            </div>

            {/* Right Action: High-Contrast WhatsApp CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current stroke-none text-emerald-600 hidden xs:inline" />
                <span className="tracking-tight">Approve & Launch</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </a>
            </div>

          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. FULL-VIEWPORT STAGING FRAME (Client's External Vercel Deployment)      */}
        {/* ========================================================================= */}
        <main className="absolute inset-0 w-full h-full z-0 bg-zinc-950 flex flex-col items-center justify-center">
          {/* Iframe Viewport Layer */}
          <iframe
            src={externalUrl}
            title={`${formattedName} Staging Environment`}
            className="w-full h-full border-0 bg-zinc-950"
            allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            loading="eager"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          />

          {/* Fallback Ambient Staging Indicator if iframe is loading or blocked by headers */}
          <div className="absolute bottom-4 right-4 pointer-events-none z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Target: {externalUrl.replace('https://', '')}</span>
          </div>
        </main>

      </div>
    </AppProvider>
  );
}
