import { notFound } from 'next/navigation';
import { getCountryContent, countryDictionary, CountryCode, isValidCountry } from '@/src/lib/content';
import { AppProvider } from '@/src/context/ThemeLanguageContext';
import { CommandIsland } from '@/src/components/CommandIsland';
import { Hero } from '@/src/components/Hero';
import { BrandTicker } from '@/src/components/BrandTicker';
import { Process } from '@/src/components/Process';
import { PortfolioReviewGrid } from '@/src/components/PortfolioReviewGrid';
import { Pricing } from '@/src/components/Pricing';
import { Faq } from '@/src/components/Faq';
import { CtaBanner } from '@/src/components/CtaBanner';
import { Footer } from '@/src/components/Footer';
import { Dock } from '@/src/components/Dock';
import { Toaster } from 'sonner';

export async function generateStaticParams() {
  return Object.keys(countryDictionary).map((country) => ({
    country,
  }));
}

interface PageProps {
  params: Promise<{ country: string }> | { country: string };
}

export default async function CountryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const countryParam = resolvedParams?.country?.toLowerCase();

  if (!isValidCountry(countryParam)) {
    notFound();
  }

  const content = getCountryContent(countryParam as CountryCode);

  return (
    <AppProvider initialLang={content.defaultLanguage}>
      <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-white overflow-x-clip selection:bg-zinc-900/10 dark:selection:bg-white/20 selection:text-zinc-900 dark:selection:text-white relative transition-colors duration-300">
        {/* Ambient Radial Lighting: Glow spot behind primary content/3D canvas */}
        <div 
          aria-hidden="true"
          className="fixed top-12 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[140px] rounded-full pointer-events-none z-0" 
        />

        {/* 1. FLOATING COMMAND ISLAND (Top Navigation Pill with Country Subpath & EN/PT Switchers) */}
        <CommandIsland countryContent={content} />

        {/* Apple HIG Sonner Toast Provider */}
        <Toaster 
          position="bottom-right" 
          richColors 
          closeButton 
        />

        <main className="relative z-10">
          {/* HERO SECTION (3D Particle Logo + Localized Subtitle & WhatsApp Link) */}
          <Hero countryContent={content} />

          {/* TECH & PARTNER TICKER BANNER (Infinite Sliding Marquee) */}
          <BrandTicker />

          {/* HOW WE WORK (The 3-Step Process: 01 Spec, 02 The Test, 03 Launch) */}
          <Process countryContent={content} />

          {/* FULL-SCREEN CSS SNAP-SCROLL PORTFOLIO & REVIEWS */}
          <PortfolioReviewGrid />

          {/* TRANSPARENT PRICING (PT: €500 Upfront + €25/mo vs IE: €1,800 Upfront + €75/mo) */}
          <Pricing countryContent={content} />

          {/* FREQUENTLY ASKED QUESTIONS (FAQ Accordion) */}
          <Faq />

          {/* FINAL FOOTER CTA WITH 3D ASSET IN BACKGROUND & REGIONAL WHATSAPP */}
          <CtaBanner countryContent={content} />
        </main>

        <Footer />
        <Dock />
      </div>
    </AppProvider>
  );
}
