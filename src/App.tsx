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

function AppContent() {
  const { theme } = useApp();

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-white overflow-x-clip selection:bg-zinc-900/10 dark:selection:bg-white/20 selection:text-zinc-900 dark:selection:text-white relative transition-colors duration-300">
      {/* Ambient Radial Lighting: Glow spot behind primary content/3D canvas */}
      <div 
        aria-hidden="true"
        className="fixed top-12 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[140px] rounded-full pointer-events-none z-0" 
      />

      {/* 1. FLOATING COMMAND ISLAND (Apple HIG Top Navigation Pill with EN/PT & Theme Switchers) */}
      <CommandIsland />

      {/* Apple HIG Sonner Toast Provider */}
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
        {/* HERO SECTION (3D Particle Logo + 3-Beat Scroll Narrative) */}
        <Hero />

        {/* TECH & PARTNER TICKER BANNER (Infinite Sliding Marquee) */}
        <BrandTicker />

        {/* HOW WE WORK (The 3-Step Process: 01 Spec, 02 Staging Link, 03 Launch) */}
        <Process />

        {/* FULL-SCREEN CSS SNAP-SCROLL PORTFOLIO & REVIEWS */}
        <PortfolioReviewGrid />

        {/* TRANSPARENT PRICING (€500 Upfront + €20/mo) */}
        <Pricing />

        {/* FREQUENTLY ASKED QUESTIONS (FAQ Accordion) */}
        <Faq />

        {/* FINAL FOOTER CTA WITH 3D ASSET IN BACKGROUND */}
        <CtaBanner />
      </main>

      <Footer />
      <Dock />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

