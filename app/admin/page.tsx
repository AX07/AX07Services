import React from 'react';
import { ArrowLeft, Sparkles, Terminal, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { AppProvider } from '@/src/context/ThemeLanguageContext';
import { Dock } from '@/src/components/Dock';

export default function AdminPage() {
  return (
    <AppProvider>
      <div className="bg-zinc-950 min-h-screen text-white p-6 sm:p-12 relative flex flex-col justify-between selection:bg-white/20 selection:text-white">
        {/* Ambient Glow */}
        <div 
          aria-hidden="true"
          className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" 
        />

        <div className="max-w-4xl mx-auto w-full relative z-10 pt-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-10">
            <div className="flex items-center gap-3">
              <a
                href="/ie"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                title="Return to Main Experience"
              >
                <ArrowLeft className="w-4 h-4" />
              </a>
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

          {/* Admin Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <LinkIcon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold font-display mb-2">Magic Staging Link Engine</h2>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4">
                Input any Vercel staging deployment or client URL to instantly mount a sandboxed preview frame inside the AX07 shell.
              </p>
              <div className="text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 inline-block">
                Target: ax07services.com/preview/[id]
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
                <a
                  href="/ie"
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono transition-colors"
                >
                  🇮🇪 Open /ie
                </a>
                <a
                  href="/pt"
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono transition-colors"
                >
                  🇵🇹 Open /pt
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Global Floating Dock */}
        <Dock />
      </div>
    </AppProvider>
  );
}
