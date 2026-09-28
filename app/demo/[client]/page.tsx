'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowLeft, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { getClientBySlug, ClientConfig } from '@/src/lib/clients';

export default function DynamicDemoPage({
  params,
}: {
  params: Promise<{ client: string }> | { client: string };
}) {
  const [clientSlug, setClientSlug] = useState<string>('');
  const [clientConfig, setClientConfig] = useState<ClientConfig | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // Resolve params whether it's a promise (Next.js 15) or synchronous object (Next.js 14 / Vite)
    if (params && typeof (params as any).then === 'function') {
      (params as Promise<{ client: string }>).then((res) => {
        if (res?.client) {
          resolveClient(res.client);
        }
      });
    } else if (params && (params as any).client) {
      resolveClient((params as any).client);
    } else if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const demoIdx = parts.indexOf('demo');
      if (demoIdx !== -1 && parts[demoIdx + 1]) {
        resolveClient(parts[demoIdx + 1]);
      }
    }
  }, [params]);

  const resolveClient = (rawSlug: string) => {
    const slug = decodeURIComponent(rawSlug).toLowerCase().trim();
    setClientSlug(slug);
    const found = getClientBySlug(slug);
    if (found) {
      setClientConfig(found);
    } else {
      // Automatic fallback for unregistered slugs
      const formattedName = slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Check if URL search params has url
      const searchUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('url') : null;

      setClientConfig({
        slug,
        name: formattedName,
        stagingUrl: searchUrl || `https://${slug}.vercel.app`,
        bookingUrl: 'https://booking.uk.hsone.app/soe/new/',
        whatsappNumber: '+353871234567',
        marketTier: 'Ireland (€1,800)',
      });
    }
  };

  const clientName = clientConfig?.name || clientSlug;
  const targetUrl = clientConfig?.stagingUrl || `https://${clientSlug}.vercel.app`;
  const cleanPhone = (clientConfig?.whatsappNumber || '+353871234567').replace(/[^0-9]/g, '');

  const whatsappMessage = `Hi Alex, I reviewed the 3D prototype for ${clientName} at ax07services.com/demo/${clientSlug} and want to discuss launching it live.`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-zinc-950 font-sans select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP FLOATING GLASSMORPHISM OVERLAY BAR                                 */}
      {/* Persistent floating pill container fixed above the canvas                 */}
      {/* ========================================================================= */}
      <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-5xl pointer-events-auto">
        <div className="bg-zinc-950/85 backdrop-blur-2xl border border-white/15 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 text-white transition-all">
          
          {/* Left Action: Link labeled "← AX07 Services" navigating to ax07services.com */}
          <div className="flex items-center gap-2">
            <a
              href="/ie"
              className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Return to AX07 Services"
            >
              <span className="text-zinc-400 group-hover:-translate-x-0.5 transition-transform">←</span>
              <span className="font-display tracking-tight">AX07 Services</span>
            </a>
          </div>

          {/* Center Badge: Subtle label "Private Staging Preview for [Client Name]" */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">
              Private Staging Preview for <strong className="text-white font-semibold font-sans">{clientName}</strong>
            </span>
          </div>

          {/* Mobile responsive center badge */}
          <div className="flex md:hidden items-center gap-1.5 text-[11px] font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate max-w-[130px] font-sans font-medium text-white">{clientName}</span>
          </div>

          {/* Right Action: High-Contrast "Approve & Launch" WhatsApp Button */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
              title="Approve & Launch Live"
            >
              <span className="tracking-tight">Approve &amp; Launch</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </a>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FULL-SCREEN VIEWPORT CONTAINER EMBEDDING STAGING TARGET URL             */}
      {/* ========================================================================= */}
      <main className="absolute inset-0 w-full h-full z-0 bg-zinc-950 flex flex-col items-center justify-center">
        {targetUrl && (
          <iframe
            src={targetUrl}
            title={`${clientName} Live Staging Environment`}
            onLoad={() => setIframeLoaded(true)}
            className="w-full h-full border-0 bg-zinc-950"
            allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            loading="eager"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          />
        )}

        {/* Ambient Staging Status Bar at bottom right */}
        <div className="absolute bottom-4 right-4 pointer-events-none z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Staging: {targetUrl.replace(/^https?:\/\//, '')}</span>
          {clientConfig?.marketTier && (
            <>
              <span className="text-white/20">|</span>
              <span className="text-emerald-400 font-semibold">{clientConfig.marketTier}</span>
            </>
          )}
        </div>
      </main>

    </div>
  );
}
