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
import AdminPage from '@/app/admin/page';
import DynamicDemoPage from '@/app/demo/[client]/page';

function MainExperience({ country, onSelectCountry }: { country: CountryCode; onSelectCountry: (c: CountryCode) => void }) {
  const { theme } = useApp();
  const content = getCountryContent(country);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-white overflow-x-clip selection:bg-zinc-900/10 dark:selection:bg-white/20 selection:text-zinc-900 dark:selection:text-white relative transition-colors duration-300">
      {/* Ambient Radial Lighting - Hardware accelerated with GPU layer separation */}
      <div 
        aria-hidden="true"
        className="fixed top-12 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] sm:blur-[140px] rounded-full pointer-events-none z-0 transform-gpu will-change-transform" 
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
        <AdminPage />
      </AppProvider>
    );
  }

  if (currentPath.startsWith('/demo/')) {
    const client = currentPath.replace('/demo/', '').split('/')[0] || '8to8dental';
    return (
      <AppProvider>
        <DynamicDemoPage params={{ client }} />
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
