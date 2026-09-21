import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/ThemeLanguageContext';

interface TickerItem {
  name: string;
  category: 'client' | 'tech' | 'in-house';
}

const tickerItems: TickerItem[] = [
  { name: 'FLYFOIL FORMOSA', category: 'client' },
  { name: 'THREE.JS', category: 'tech' },
  { name: 'ALTURA KITES', category: 'client' },
  { name: 'GSAP MOTION', category: 'tech' },
  { name: 'LA KAFETERIA', category: 'client' },
  { name: 'REACT 19', category: 'tech' },
  { name: 'CRYPTOAX07', category: 'in-house' },
  { name: 'VERCEL EDGE', category: 'tech' },
  { name: 'ALBANIA FÁCIL', category: 'client' },
  { name: 'SUPABASE', category: 'tech' },
  { name: 'GOOGLE AI STUDIO', category: 'tech' },
  { name: 'WEBGL 3D', category: 'tech' },
];

export function BrandTicker() {
  const { t } = useApp();

  return (
    <section className="relative w-full bg-zinc-100 dark:bg-zinc-950 border-y border-zinc-200 dark:border-white/10 py-6 sm:py-8 overflow-hidden z-10 transition-colors duration-300">
      {/* Subtle edge fade overlays for infinite gradient effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-zinc-100 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-zinc-100 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

      {/* Header Label */}
      <div className="flex items-center justify-center gap-2 mb-4 px-4 text-center">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 dark:text-white/40">
          {t.ticker.heading}
        </p>
      </div>

      {/* Sliding Marquee Track */}
      <div className="relative flex overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8 sm:gap-12">
          {/* Double list for seamless 100% to -50% loop */}
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 sm:gap-4 shrink-0 group cursor-default"
            >
              <span
                className={`text-sm sm:text-base md:text-lg font-mono font-semibold tracking-wider transition-colors duration-300 ${
                  item.category === 'in-house'
                    ? 'text-zinc-900 dark:text-white/90 group-hover:text-black dark:group-hover:text-white font-display'
                    : item.category === 'client'
                    ? 'text-zinc-800 dark:text-white/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-display'
                    : 'text-zinc-400 dark:text-white/40 group-hover:text-zinc-800 dark:group-hover:text-white/80'
                }`}
              >
                {item.name}
              </span>

              {item.category === 'in-house' && (
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-2.5 h-2.5 text-blue-500 dark:text-blue-400 stroke-[1.75]" />
                  {t.ticker.ventureTag}
                </span>
              )}

              {item.category === 'client' && (
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {t.ticker.clientTag}
                </span>
              )}

              {/* Dot divider */}
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-white/20 group-hover:bg-zinc-400 dark:group-hover:bg-white/40 transition-colors ml-4 sm:ml-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandTicker;
