'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowLeft, ShieldCheck, Sparkles, ExternalLink, Globe, Search, X, Boxes, Layers, RefreshCw, Check } from 'lucide-react';
import { getClientBySlug, ensureAbsoluteUrl, ClientConfig } from '@/src/lib/clients';
import { INDUSTRY_BENCHMARKS, getBenchmarkByQuery, IndustryBenchmark } from '@/src/lib/benchmarks';
import { BrandLogo } from '@/src/components/BrandLogo';

export default function DynamicDemoPage({
  params,
}: {
  params: Promise<{ client: string }> | { client: string };
}) {
  const [clientSlug, setClientSlug] = useState<string>('');
  const [clientConfig, setClientConfig] = useState<ClientConfig | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showDirectFallback, setShowDirectFallback] = useState(false);
  
  // Gallery Engine & Query State
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const [galleryQuery, setGalleryQuery] = useState<string>('dentist');
  const [activeBenchmark, setActiveBenchmark] = useState<IndustryBenchmark>(() => getBenchmarkByQuery('dentist'));
  const [engineMode, setEngineMode] = useState<'spline' | 'webflow'>('spline');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

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
      } else if (parts.includes('gallery')) {
        resolveClient('gallery');
      }
    }

    const timer = setTimeout(() => {
      setShowDirectFallback(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, [params]);

  const resolveClient = (rawSlug: string) => {
    const slug = decodeURIComponent(rawSlug).toLowerCase().trim();
    setClientSlug(slug);

    const searchUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('url') : null;
    const searchQuery = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') : null;
    const searchEngine = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('engine') : null;

    if (searchEngine === 'webflow') {
      setEngineMode('webflow');
    }

    if (slug === 'gallery' || slug === 'spline' || slug === 'webflow' || searchQuery) {
      const q = (searchQuery || 'dentist').trim();
      setGalleryQuery(q);
      setIsGalleryMode(true);
      const benchmark = getBenchmarkByQuery(q);
      setActiveBenchmark(benchmark);

      if (searchUrl) {
        setCustomUrl(ensureAbsoluteUrl(searchUrl));
      }

      setClientConfig({
        slug: 'gallery',
        name: benchmark.name,
        stagingUrl: searchUrl ? ensureAbsoluteUrl(searchUrl) : benchmark.splineUrl,
        bookingUrl: `https://wa.me/353894419127?text=${encodeURIComponent(`Hi Alex, I was exploring the ${benchmark.name} 3D prototype at ax07.dev and want to claim my free 48h prototype.`)}`,
        whatsappNumber: '+353894419127',
        marketTier: 'Live Benchmarks',
      });
      return;
    }

    const found = getClientBySlug(slug);

    if (found) {
      setIsGalleryMode(false);
      setClientConfig({
        ...found,
        stagingUrl: searchUrl ? ensureAbsoluteUrl(searchUrl) : ensureAbsoluteUrl(found.stagingUrl),
      });
    } else {
      // Automatic fallback for unregistered slugs
      const formattedName = slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      setClientConfig({
        slug,
        name: formattedName,
        stagingUrl: searchUrl ? ensureAbsoluteUrl(searchUrl) : ensureAbsoluteUrl(`https://${slug}.vercel.app`),
        bookingUrl: 'https://booking.uk.hsone.app/soe/new/',
        whatsappNumber: '+353894419127',
        marketTier: 'Ireland (€1,800)',
      });
    }
  };

  const handleSelectIndustry = (q: string) => {
    setGalleryQuery(q);
    const benchmark = getBenchmarkByQuery(q);
    setActiveBenchmark(benchmark);
    setCustomUrl('');
    setIsSwitcherOpen(false);
    setCustomInput('');
    setIframeLoaded(false);

    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', `/demo/gallery?q=${encodeURIComponent(q)}&engine=${engineMode}`);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    if (/^https?:\/\/my\.spline\.design\//i.test(customInput) || /^https?:\/\//i.test(customInput)) {
      setCustomUrl(ensureAbsoluteUrl(customInput));
      setIsSwitcherOpen(false);
    } else {
      handleSelectIndustry(customInput.trim());
    }
  };

  // Determine current active presentation URL
  const currentRenderUrl = isGalleryMode
    ? customUrl || (engineMode === 'spline' ? activeBenchmark.splineUrl : activeBenchmark.webflowUrl)
    : ensureAbsoluteUrl(clientConfig?.stagingUrl || `https://${clientSlug}.vercel.app`);

  const clientName = isGalleryMode ? activeBenchmark.name : (clientConfig?.name || clientSlug);
  const cleanPhone = (clientConfig?.whatsappNumber || '+353894419127').replace(/[^0-9]/g, '');

  const whatsappMessage = isGalleryMode
    ? `Hi Alex, I was viewing the ${activeBenchmark.name} [${engineMode.toUpperCase()}] prototype at ax07.dev/demo/gallery?q=${encodeURIComponent(galleryQuery)} and want to claim my free 48h 3D prototype.`
    : `Hi Alex, I reviewed the 3D prototype for ${clientName} at ax07.dev/demo/${clientSlug} and want to discuss launching it live.`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-zinc-950 font-sans select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP FLOATING GLASSMORPHISM OVERLAY BAR                                 */}
      {/* ========================================================================= */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[96vw] max-w-6xl pointer-events-auto">
        <div className="bg-zinc-950/85 backdrop-blur-2xl border border-white/15 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2.5 text-white transition-all">
          
          {/* Left Action: Link labeled "← ax07.dev" */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/ie"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/ie');
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Return to ax07.dev"
            >
              <span className="text-zinc-400 group-hover:-translate-x-0.5 transition-transform">←</span>
              <BrandLogo imgClassName="w-4 h-4 sm:w-5 sm:h-5 object-contain" themeOverride="dark" className="flex items-center" />
              <span className="font-display tracking-tight hidden sm:inline">ax07.dev</span>
            </a>
          </div>

          {/* Center Area: Engine Mode Switcher & Sector Selector */}
          {isGalleryMode ? (
            <div className="relative flex items-center gap-2">
              {/* Engine Toggle: Spline 3D vs Webflow */}
              <div className="flex items-center bg-black/50 border border-white/10 rounded-full p-0.5">
                <button
                  type="button"
                  onClick={() => setEngineMode('spline')}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    engineMode === 'spline'
                      ? 'bg-white text-zinc-950 font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Render interactive 3D Spline scene"
                >
                  <Boxes className="w-3 h-3 text-emerald-500" />
                  <span>Spline 3D</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEngineMode('webflow')}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    engineMode === 'webflow'
                      ? 'bg-white text-zinc-950 font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Render Webflow live showcase"
                >
                  <Globe className="w-3 h-3 text-blue-500" />
                  <span>Webflow</span>
                </button>
              </div>

              {/* Industry Badge & Selector */}
              <button
                type="button"
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
                title="Select industry or paste custom Spline URL"
              >
                <span>{activeBenchmark.icon}</span>
                <span className="font-semibold text-white truncate max-w-[140px]">
                  {activeBenchmark.name.split('&')[0]}
                </span>
                <span className="text-[10px] text-emerald-400 uppercase font-bold">Change ▾</span>
              </button>

              {/* Popover Dropdown for Custom URL / Industry Selection */}
              {isSwitcherOpen && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[320px] sm:w-[420px] bg-zinc-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl z-50 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Select Industry or Paste Spline URL</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSwitcherOpen(false)}
                      className="text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCustomSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Paste https://my.spline.design/... or sector"
                      className="flex-1 bg-black/60 border border-white/15 rounded-full px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 font-sans"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-colors cursor-pointer shrink-0"
                    >
                      Load
                    </button>
                  </form>

                  <div className="pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                      Curated 3D Industry Benchmarks:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                      {INDUSTRY_BENCHMARKS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectIndustry(item.id)}
                          className={`px-3 py-2 rounded-2xl text-[11px] font-mono transition-all cursor-pointer flex items-center gap-2 text-left ${
                            activeBenchmark.id === item.id
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                              : 'bg-white/[0.04] hover:bg-white/[0.10] text-zinc-300 border border-white/10'
                          }`}
                        >
                          <span className="text-sm">{item.icon}</span>
                          <span className="truncate">{item.name.split('&')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-none">
                Staging Preview for <strong className="text-white font-semibold font-sans">{clientName}</strong>
              </span>
            </div>
          )}

          {/* Right Action: Direct Tab Launcher + WhatsApp Action */}
          <div className="flex items-center gap-2 shrink-0">
            {currentRenderUrl && (
              <a
                href={currentRenderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white/90 hover:text-white transition-colors cursor-pointer"
                title="Open Direct Scene in New Tab"
              >
                <span>Direct Tab</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-1.5 sm:py-2 flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all cursor-pointer whitespace-nowrap"
              title="Claim 48h 3D Preview on WhatsApp"
            >
              <span className="tracking-tight">
                {isGalleryMode ? 'Claim 48h Spec' : 'Approve & Launch'}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </a>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FULL-SCREEN 3D SCENE & WEBFLOW CONTAINER                                */}
      {/* ========================================================================= */}
      <main className="absolute inset-0 w-full h-full z-0 bg-zinc-950 flex flex-col items-center justify-center">
        
        {/* Render Spline 3D Scene or Webflow Live Showcase via iframe */}
        {currentRenderUrl && (
          <iframe
            src={currentRenderUrl}
            title={`${clientName} 3D Experience`}
            onLoad={() => setIframeLoaded(true)}
            className="w-full h-full border-0 bg-zinc-950 relative z-10"
            allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            loading="eager"
          />
        )}

        {/* Ambient Presentation Backdrop & Fallback Card */}
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 text-center bg-radial-gradient from-zinc-900 to-zinc-950">
          <div className="max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-4 text-emerald-400">
              {engineMode === 'spline' ? <Boxes className="w-6 h-6 stroke-[2]" /> : <Globe className="w-6 h-6 stroke-[2]" />}
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-2 font-semibold">
              {engineMode === 'spline' ? 'Spline 3D Interactive Model' : 'Webflow Live Showcase'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white mb-2">
              {activeBenchmark.icon} {clientName}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mb-5 leading-relaxed font-sans">
              {isGalleryMode ? activeBenchmark.description : 'High-motion interactive preview rendered in isolated edge staging.'}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <a
                href={currentRenderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
              >
                <span>Launch Direct Fullscreen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {isGalleryMode && (
              <div className="flex flex-wrap gap-1.5 justify-center pt-4 border-t border-white/10">
                {INDUSTRY_BENCHMARKS.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectIndustry(item.id)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-mono text-zinc-300 border border-white/10 transition-colors cursor-pointer"
                  >
                    {item.name.split('&')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ambient Staging Status Bar at bottom right */}
        <div className="absolute bottom-4 right-4 pointer-events-none z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate max-w-[280px]">
            {isGalleryMode ? `${engineMode.toUpperCase()}: ${activeBenchmark.name}` : `Staging: ${currentRenderUrl.replace(/^https?:\/\//, '')}`}
          </span>
          {activeBenchmark?.speedMetric && isGalleryMode && (
            <>
              <span className="text-white/20">|</span>
              <span className="text-emerald-400 font-semibold">{activeBenchmark.speedMetric}</span>
            </>
          )}
        </div>

        {/* Bottom Left Quick Controls for Gallery Switcher on mobile */}
        {isGalleryMode && (
          <div className="absolute bottom-4 left-4 z-20 pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSwitcherOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 backdrop-blur-md border border-white/15 text-[11px] font-mono text-zinc-200 hover:text-white shadow-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3 h-3 text-emerald-400" />
              <span>Change Sector / Paste URL</span>
            </button>
          </div>
        )}
      </main>

    </div>
  );
}
