import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/ThemeLanguageContext';
import { CommandIsland } from './components/CommandIsland';
import { Hero } from './components/Hero';
import { BrandTicker } from './components/BrandTicker';
import { Process } from './components/Process';
import { PortfolioReviewGrid } from './components/PortfolioReviewGrid';
import { Pricing } from './components/Pricing';
import { Faq } from './components/Faq';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { Dock } from './components/Dock';
import { Toaster } from 'sonner';
import { getCountryContent, CountryCode, isValidCountry, defaultCountry } from './lib/content';
import { ArrowLeft, ArrowUpRight, Terminal, Link as LinkIcon, ShieldCheck, Smartphone, Sparkles, ExternalLink } from 'lucide-react';
import { LogoCanvas } from './components/LogoCanvas';
import { WorkPortfolioPage } from './components/WorkPortfolioPage';
import { AboutStudioPage } from './components/AboutStudioPage';

function AdminView() {
  const [clientInput, setClientInput] = useState('flyfoil');
  const [urlInput, setUrlInput] = useState('https://flyfoil-formosa.vercel.app');

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = clientInput.trim().toLowerCase().replace(/\s+/g, '-');
    const path = urlInput.trim()
      ? `/demo/${slug}?url=${encodeURIComponent(urlInput.trim())}`
      : `/demo/${slug}`;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white p-6 sm:p-12 relative flex flex-col justify-between selection:bg-white/20 selection:text-white">
      <div 
        aria-hidden="true"
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" 
      />

      <div className="max-w-4xl mx-auto w-full relative z-10 pt-8">
        <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/ie');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Return to Main Experience"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">AX07 SYSTEM</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                Admin Command & Staging Dock
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Root Route Preserved</span>
          </div>
        </div>

        {/* Live Staging Generator Form */}
        <form onSubmit={handleLaunch} className="mb-10 p-6 sm:p-8 rounded-[28px] bg-white/[0.04] border border-white/15 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display">Generate Full-Viewport Client Staging Frame</h2>
              <p className="text-xs text-white/60">Overlay AX07 floating glassmorphism controls on any Vercel deployment.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-mono text-white/60 mb-1.5">Client Name or Slug</label>
              <input
                type="text"
                value={clientInput}
                onChange={(e) => setClientInput(e.target.value)}
                placeholder="e.g. flyfoil, alturakites"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/60 mb-1.5">Vercel Staging Deployment URL</label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://client-preview.vercel.app"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-white/40">Quick Presets:</span>
              {['flyfoil', 'altura', 'fintrack', 'cryptoax07'].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => {
                    setClientInput(preset);
                    setUrlInput(`https://${preset}-staging.vercel.app`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
            >
              <span>Launch Staging Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display mb-2">Floating Glassmorphism Overlay</h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4">
              Staging links now feature persistent top glassmorphism controls with the verified &ldquo;Approve & Launch&rdquo; WhatsApp funnel.
            </p>
            <div className="text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 inline-block">
              Route: /demo/[client]
            </div>
          </div>

          <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display mb-2">Subpath Regional Routing</h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4">
              Country routing active across <span className="text-white font-mono">/ie</span> (Ireland: €1,800 + €75/mo) and <span className="text-white font-mono">/pt</span> (Portugal: €500 + €25/mo).
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/ie');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono transition-colors cursor-pointer"
              >
                🇮🇪 Open /ie
              </button>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/pt');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono transition-colors cursor-pointer"
              >
                🇵🇹 Open /pt
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dock />
    </div>
  );
}

function DemoView({ client }: { client: string }) {
  const formattedName = decodeURIComponent(client)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Check URL search parameters if any passed
  const urlParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('url') : null;
  const externalUrl = urlParam || `https://${client.toLowerCase()}.vercel.app`;

  const whatsappQuery = encodeURIComponent(
    `Hi Alex, I reviewed the 3D prototype for ${formattedName} at ax07services.com/demo/${client} and want to discuss launching it live.`
  );
  const whatsappUrl = `https://wa.me/351912345678?text=${whatsappQuery}`;

  return (
    <div className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-zinc-950 font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. TOP FLOATING GLASSMORPHISM BAR (Persistent Overlay Controls)            */}
      {/* ========================================================================= */}
      <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-5xl pointer-events-auto">
        <div className="bg-zinc-950/85 backdrop-blur-2xl border border-white/15 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 text-white transition-all">
          
          {/* Left Action: Back to Home */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/ie');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Return to AX07 Services"
            >
              <span className="text-zinc-400 group-hover:-translate-x-0.5 transition-transform">←</span>
              <span className="font-display tracking-tight">AX07 Services</span>
            </button>
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
        <iframe
          src={externalUrl}
          title={`${formattedName} Staging Environment`}
          className="w-full h-full border-0 bg-zinc-950"
          allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          loading="eager"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
        />

        {/* Fallback Ambient Staging Indicator */}
        <div className="absolute bottom-4 right-4 pointer-events-none z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>Target: {externalUrl.replace('https://', '')}</span>
        </div>
      </main>
    </div>
  );
}

function MainExperience({ country, onSelectCountry }: { country: CountryCode; onSelectCountry: (c: CountryCode) => void }) {
  const { theme } = useApp();
  const content = getCountryContent(country);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-white overflow-x-clip selection:bg-zinc-900/10 dark:selection:bg-white/20 selection:text-zinc-900 dark:selection:text-white relative transition-colors duration-300">
      {/* Ambient Radial Lighting */}
      <div 
        aria-hidden="true"
        className="fixed top-12 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[140px] rounded-full pointer-events-none z-0" 
      />

      {/* Floating Command Island with Country Subpath Toggle & Language Switcher */}
      <CommandIsland countryContent={content} onSelectCountry={onSelectCountry} />

      {/* Apple HIG Toast Provider */}
      <Toaster 
        position="bottom-right" 
        theme={theme} 
        richColors 
        closeButton 
        toastOptions={{
          style: {
            background: theme === 'dark' ? 'rgba(24, 24, 27, 0.90)' : 'rgba(255, 255, 255, 0.92)',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(20px)',
            color: theme === 'dark' ? '#f4f4f5' : '#09090b',
            fontFamily: 'var(--font-sans)',
            borderRadius: '18px',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
          }
        }}
      />

      <main className="relative z-10">
        {/* HERO SECTION (3D Logo + Regionally Tuned Subtitle & Phone) */}
        <Hero countryContent={content} />

        {/* TECH & PARTNER TICKER BANNER */}
        <BrandTicker />

        {/* HOW WE WORK (01 Spec, 02 The Test, 03 Launch) */}
        <Process countryContent={content} />

        {/* PORTFOLIO SNAP REVIEW GRID */}
        <PortfolioReviewGrid />

        {/* TRANSPARENT PRICING (PT: €500 / €25/mo vs IE: €1,800 / €75/mo) */}
        <Pricing countryContent={content} />

        {/* FREQUENTLY ASKED QUESTIONS */}
        <Faq />

        {/* FINAL FOOTER CTA WITH REGIONAL WHATSAPP ACTION */}
        <CtaBanner countryContent={content} />
      </main>

      <Footer />
      <Dock />
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/ie';
  });

  const [country, setCountry] = useState<CountryCode>(() => {
    if (typeof window !== 'undefined') {
      const seg = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
      if (isValidCountry(seg)) return seg;
    }
    return defaultCountry;
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      const seg = path.split('/').filter(Boolean)[0]?.toLowerCase();
      if (isValidCountry(seg)) {
        setCountry(seg);
      } else if (path === '/' || path === '') {
        // Automatically redirect root / to /ie
        window.history.replaceState({}, '', `/${defaultCountry}`);
        setCountry(defaultCountry);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleSelectCountry = (targetCountry: CountryCode) => {
    setCountry(targetCountry);
    window.history.pushState({}, '', `/${targetCountry}`);
    setCurrentPath(`/${targetCountry}`);
  };

  // Route evaluation
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return (
      <AppProvider>
        <AdminView />
      </AppProvider>
    );
  }

  if (currentPath.startsWith('/demo/')) {
    const client = currentPath.replace('/demo/', '').split('/')[0] || 'Demo Client';
    return (
      <AppProvider>
        <DemoView client={client} />
      </AppProvider>
    );
  }

  const content = getCountryContent(country);
  const initialLang = content.defaultLanguage;

  if (currentPath === '/work' || currentPath.endsWith('/work')) {
    return (
      <AppProvider key={`${country}-work`} initialLang={initialLang}>
        <WorkPortfolioPage countryContent={content} />
      </AppProvider>
    );
  }

  if (currentPath === '/about' || currentPath.endsWith('/about')) {
    return (
      <AppProvider key={`${country}-about`} initialLang={initialLang}>
        <AboutStudioPage countryContent={content} />
      </AppProvider>
    );
  }

  return (
    <AppProvider key={country} initialLang={initialLang}>
      <MainExperience country={country} onSelectCountry={handleSelectCountry} />
    </AppProvider>
  );
}
