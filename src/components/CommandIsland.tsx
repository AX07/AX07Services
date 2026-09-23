'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Sun, Moon, Globe, MapPin } from 'lucide-react';
import { appleGestures, appleSprings } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';
import { CountryContent, CountryCode } from '../lib/content';

export interface CommandIslandProps {
  countryContent?: CountryContent;
  onSelectCountry?: (country: CountryCode) => void;
  activePage?: 'home' | 'work' | 'about';
}

export function CommandIsland({ countryContent, onSelectCountry, activePage = 'home' }: CommandIslandProps = {}) {
  const { lang, setLang, theme, toggleTheme, t } = useApp();
  const [activeSection, setActiveSection] = useState<string>(activePage);

  const currentCountry = countryContent?.countrySlug || 'ie';
  const whatsappNumber = countryContent?.whatsappNumber || (lang === 'pt' ? '351912345678' : '353871234567');

  const navItems = [
    { id: 'work', label: t.nav.works, type: 'page', route: `/${currentCountry}/work` },
    { id: 'process', label: t.nav.process, type: 'section', route: `/${currentCountry}#process` },
    { id: 'pricing', label: t.nav.pricing, type: 'section', route: `/${currentCountry}#pricing` },
    { id: 'about', label: t.nav.about || (lang === 'pt' ? 'Sobre' : 'About'), type: 'page', route: `/${currentCountry}/about` },
  ];

  useEffect(() => {
    if (activePage !== 'home') {
      setActiveSection(activePage);
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      const sectionIds = ['project-showcase', 'process', 'pricing', 'faq'];
      for (const sid of sectionIds) {
        const el = document.getElementById(sid);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            if (sid === 'project-showcase') {
              setActiveSection('work');
            } else if (sid === 'process') {
              setActiveSection('process');
            } else if (sid === 'pricing') {
              setActiveSection('pricing');
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [t, activePage]);

  const navigateTo = (targetPath: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', targetPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.type === 'page') {
      if (activePage === item.id) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigateTo(item.route);
      }
      return;
    }

    // Section scroll or redirect
    if (activePage === 'home') {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigateTo(item.route);
      }
    } else {
      navigateTo(item.route);
    }
  };

  const handleBrandClick = () => {
    if (activePage === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateTo(`/${currentCountry}`);
    }
  };

  const handleCountryChange = (targetCountry: CountryCode) => {
    if (onSelectCountry) {
      onSelectCountry(targetCountry);
    }

    if (typeof window !== 'undefined') {
      let targetPath = `/${targetCountry}`;
      if (activePage === 'work') {
        targetPath = `/${targetCountry}/work`;
      } else if (activePage === 'about') {
        targetPath = `/${targetCountry}/about`;
      }
      window.history.pushState({}, '', targetPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const whatsappMessage =
    lang === 'pt'
      ? 'Olá AX07, gostaria de pedir o meu protótipo 3D gratuito em 48 horas.'
      : 'Hello AX07, I would like to request the free 48h 3D spec preview.';

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none w-max max-w-[96vw]">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={appleSprings.default}
        className="pointer-events-auto bg-white/80 dark:bg-zinc-900/85 backdrop-blur-2xl border border-zinc-200/80 dark:border-white/10 px-2.5 sm:px-4 py-2 rounded-full shadow-xl dark:shadow-2xl flex items-center gap-1.5 sm:gap-2.5 transition-colors duration-300"
      >
        {/* Brand Anchor */}
        <button
          type="button"
          onClick={handleBrandClick}
          className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-full text-zinc-900 dark:text-white hover:opacity-80 transition-opacity cursor-pointer group"
          aria-label="AX07 Home"
        >
          <div className="w-6 h-6 rounded-full bg-zinc-900/10 dark:bg-white/10 border border-zinc-900/10 dark:border-white/15 flex items-center justify-center font-display font-bold text-[11px] text-zinc-900 dark:text-white">
            A
          </div>
          <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-zinc-900 dark:text-white hidden xs:inline">
            AX07
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </button>

        {/* Vertical divider */}
        <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 hidden md:block" />

        {/* Navigation Segmented Tray: Works | Process | Pricing | About */}
        <nav className="hidden sm:flex items-center gap-0.5 bg-zinc-100/90 dark:bg-white/[0.04] p-1 rounded-full border border-zinc-200/60 dark:border-white/10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id || (item.id === 'work' && activePage === 'work') || (item.id === 'about' && activePage === 'about');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-zinc-950 dark:text-white font-semibold'
                    : 'text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="commandIslandNavPill"
                    className="absolute inset-0 bg-white dark:bg-white/15 rounded-full shadow-sm dark:shadow-none z-0"
                    transition={appleSprings.snappy}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Vertical divider */}
        <div className="w-px h-4 bg-zinc-200 dark:bg-white/10" />

        {/* 1. Country Subpath Toggle (/ie | /pt) - Preserving active page */}
        <div
          id="country-toggle-container"
          className="flex items-center bg-zinc-100 dark:bg-white/[0.06] p-0.5 rounded-full border border-zinc-200/80 dark:border-white/10 text-[11px] font-mono"
          title="Subpath Region Route (/ie vs /pt)"
        >
          <button
            type="button"
            onClick={() => handleCountryChange('ie')}
            className={`px-2 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              currentCountry === 'ie'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-zinc-500 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span>🇮🇪</span>
            <span>IE</span>
          </button>
          <button
            type="button"
            onClick={() => handleCountryChange('pt')}
            className={`px-2 py-1 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              currentCountry === 'pt'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-zinc-500 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span>🇵🇹</span>
            <span>PT</span>
          </button>
        </div>

        {/* 2. Language Toggle Segmented Pill (EN | PT) */}
        <div
          id="lang-toggle-container"
          className="hidden xs:flex items-center bg-zinc-100 dark:bg-white/[0.06] p-0.5 rounded-full border border-zinc-200/80 dark:border-white/10 text-[11px] font-mono"
          title="Toggle Language (English / Português)"
        >
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-zinc-500 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('pt')}
            className={`px-2 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              lang === 'pt'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-black shadow-sm'
                : 'text-zinc-500 dark:text-white/50 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            PT
          </button>
        </div>

        {/* 3. Theme Toggle Switcher */}
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileTap={appleGestures.tapButton}
          aria-label={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
          className="p-1.5 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100/90 dark:bg-white/[0.06] border border-zinc-200/70 dark:border-white/10 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </motion.button>

        {/* 4. Action: 48h Spec CTA on WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold px-3 sm:px-4 py-1.5 flex items-center gap-1 shadow-sm hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-3 h-3 text-emerald-400 dark:text-emerald-600" />
          <span className="hidden sm:inline">{t.nav.claim48h}</span>
          <span className="sm:hidden">48h</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </motion.div>
    </header>
  );
}
