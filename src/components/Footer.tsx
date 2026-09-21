import React from 'react';
import { useApp } from '../context/ThemeLanguageContext';

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="py-12 px-6 border-t border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 relative z-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="text-zinc-900 dark:text-white font-display font-bold text-xl tracking-tight">AX07</div>
          <div className="w-px h-4 bg-zinc-300 dark:bg-white/15" />
          <div className="text-xs font-mono tracking-widest uppercase text-zinc-500 dark:text-white/40">{t.footer.brandSub}</div>
        </div>

        <div className="text-xs font-mono text-zinc-500 dark:text-white/40 flex items-center gap-4">
          <span>{t.footer.location}</span>
          <span className="hidden md:inline text-zinc-300 dark:text-white/20">//</span>
          <span className="flex items-center gap-2 text-zinc-700 dark:text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t.footer.edgeStatus}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
