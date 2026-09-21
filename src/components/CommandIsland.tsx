import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Sun, Moon, Globe } from 'lucide-react';
import { appleGestures, appleSprings } from '../lib/design-system';
import { useApp } from '../context/ThemeLanguageContext';

export function CommandIsland() {
  const { lang, setLang, theme, toggleTheme, t } = useApp();
  const [activeSection, setActiveSection] = useState<string>('project-showcase');

  const navItems = [
    { id: 'project-showcase', label: t.nav.works },
    { id: 'process', label: t.nav.process },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'faq', label: t.nav.faq },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [t]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

        {/* Navigation Segmented Tray */}
        <nav className="hidden sm:flex items-center gap-0.5 bg-zinc-100/90 dark:bg-white/[0.04] p-1 rounded-full border border-zinc-200/60 dark:border-white/10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-zinc-950 dark:text-white'
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

        {/* 1. Language Toggle Segmented Pill (EN | PT) */}
        <div
          id="lang-toggle-container"
          className="flex items-center bg-zinc-100 dark:bg-white/[0.06] p-0.5 rounded-full border border-zinc-200/80 dark:border-white/10 text-[11px] font-mono"
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

        {/* 2. Light / Dark Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          id="theme-toggle-btn"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200/80 dark:border-white/10 flex items-center justify-center text-zinc-700 dark:text-white/80 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/15 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 stroke-[1.75] text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 stroke-[1.75] text-indigo-600" />
            )}
          </motion.div>
        </button>

        {/* Primary Capsule Action CTA */}
        <motion.a
          href={`https://wa.me/351912345678?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={appleGestures.primaryButton.hover}
          whileTap={appleGestures.primaryButton.tap}
          className="rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all shrink-0"
        >
          <Sparkles className="w-3 h-3 text-emerald-400 stroke-[2]" />
          <span>{t.nav.claim48h}</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2] hidden xs:inline" />
        </motion.a>
      </motion.div>
    </header>
  );
}

export default CommandIsland;
