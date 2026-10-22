'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gauge,
  Zap,
  Activity,
  X,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Clock,
  RefreshCw,
  Search,
  ChevronRight,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';
import {
  runPageSpeedAudit,
  PageSpeedAuditResult,
  AX07_BENCHMARK,
  normalizeUrl
} from '../lib/pagespeed';
import { useApp } from '../context/ThemeLanguageContext';

export interface SpeedAuditDockProps {
  defaultOpen?: boolean;
  className?: string;
  showFloatingButton?: boolean;
}

export function SpeedAuditDock({ defaultOpen = false, className = '', showFloatingButton = false }: SpeedAuditDockProps) {
  const { theme, lang } = useApp();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [urlInput, setUrlInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKeyField, setShowApiKeyField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<PageSpeedAuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick preset websites for instant demonstration
  const quickPresets = [
    { label: 'ax07.dev (Fast)', url: 'https://ax07.dev' },
    { label: 'google.com (Fast)', url: 'https://google.com' },
    { label: 'vercel.com (Medium)', url: 'https://vercel.com' },
    { label: 'shopify.com (Heavy)', url: 'https://shopify.com' },
  ];

  // Listen for global custom event to open speed audit from any link/button
  useEffect(() => {
    const handleOpenAudit = (e: any) => {
      setIsOpen(true);
      if (e?.detail?.url) {
        setUrlInput(e.detail.url);
      }
    };
    window.addEventListener('ax07-open-speed-audit', handleOpenAudit);
    return () => window.removeEventListener('ax07-open-speed-audit', handleOpenAudit);
  }, []);

  // Cycle loading step messages during audit
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const loadingMessages = [
    'Connecting to Google PageSpeed Insights & Network Probe...',
    'Evaluating Mobile CPU Throttling, FCP & Largest Contentful Paint...',
    'Testing Total Blocking Time (TBT) & Layout Shifts (CLS)...',
    'Synthesizing live diagnostic comparison vs ax07.dev 98/100 Edge...'
  ];

  const handleRunAudit = async (targetUrl?: string) => {
    const queryUrl = targetUrl || urlInput;
    if (!queryUrl || queryUrl.trim().length === 0) {
      toast.error('Please enter a website URL to test.');
      inputRef.current?.focus();
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const data = await runPageSpeedAudit(queryUrl, apiKeyInput.trim() || undefined);
      setResult(data);
      if (data.score >= 90) {
        toast.success(`Score: ${data.score}/100 — Excellent Performance!`);
      } else if (data.score >= 50) {
        toast.warning(`Score: ${data.score}/100 — Moderate Mobile Latency`);
      } else {
        toast.error(`Score: ${data.score}/100 — Critical Optimization Needed`);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to analyze website. Please check the URL and try again.');
      toast.error('Could not complete PageSpeed audit.');
    } finally {
      setIsLoading(false);
    }
  };

  // WhatsApp concierge booking with tested score hook
  const handleWhatsAppBooking = () => {
    const testedUrl = result?.normalizedUrl || 'my website';
    const scoreText = result ? `${result.score}/100` : 'unoptimized';
    const msg = encodeURIComponent(
      `Hi Alex, I ran a speed test on ax07.dev for ${testedUrl} and scored ${scoreText}. I want to see a 48h custom 3D staging prototype built to your 98/100 benchmark!`
    );
    window.open(`https://wa.me/353894419127?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* 1. FLOATING ACTION TRIGGER BUTTON (DISABLED BY DEFAULT TO KEEP BOTTOM OF SCREEN CLEAN) */}
      {showFloatingButton && (
        <div className={`fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] pointer-events-auto ${className}`}>
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="group relative flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/60 hover:bg-black/85 dark:bg-black/60 dark:hover:bg-black/85 text-white/90 hover:text-white border border-white/10 hover:border-white/25 backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer select-none"
            aria-label="Test Website Speed with Google PageSpeed Insights"
          >
            {/* Speed Gauge Icon with Pulsing Dot */}
            <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-emerald-400 shrink-0">
              <Gauge className="w-3.5 h-3.5 stroke-[2] transition-transform group-hover:rotate-12" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Label */}
            <span className="text-[11px] sm:text-xs font-medium tracking-tight text-white whitespace-nowrap">
              {lang === 'pt' ? 'Testar Velocidade Web' : 'Test Website Speed'}
            </span>

            {/* Comparison Pill Tag */}
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-white/10 text-emerald-300 border border-white/10 shrink-0">
              vs 98/100
            </span>

            <ArrowUpRight className="w-3 h-3 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </motion.button>
        </div>
      )}

      {/* 2. SPEED AUDIT MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative z-10 w-full max-w-4xl bg-zinc-950/95 dark:bg-[#09090b]/95 text-white border border-white/15 rounded-[28px] sm:rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl max-h-[92vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                    <Zap className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                        Official Google PageSpeed API & Live Probe
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-zinc-300">
                        Mobile 4G
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-display">
                      {lang === 'pt' ? 'Diagnóstico Real de Velocidade vs ax07 Spec' : 'Real Website Speed Test vs ax07 Spec'}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
                {/* Search / URL Input Box */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                    {lang === 'pt' ? 'Insira o URL para testar a velocidade real:' : 'Enter any website URL to test real speed:'}
                  </label>

                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 font-mono text-xs">
                        https://
                      </div>
                      <input
                        ref={inputRef}
                        type="text"
                        value={urlInput.replace(/^https?:\/\//, '')}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRunAudit()}
                        placeholder="yourbusiness.com"
                        className="w-full pl-20 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-emerald-500/60 focus:bg-white/[0.07] text-white placeholder-zinc-500 text-sm font-sans focus:outline-none transition-all"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleRunAudit()}
                      className="px-6 py-3 rounded-2xl bg-white text-black hover:bg-zinc-200 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-60 font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_18px_rgba(255,255,255,0.15)] shrink-0"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{lang === 'pt' ? 'A Testar...' : 'Testing...'}</span>
                        </>
                      ) : (
                        <>
                          <Gauge className="w-4 h-4 stroke-[2]" />
                          <span>{lang === 'pt' ? 'Testar Agora' : 'Run Live Test'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Quick Preset Buttons (Showcases real green, orange, red scores!) */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {lang === 'pt' ? 'Ou teste exemplos:' : 'Quick examples to test:'}
                    </span>
                    {quickPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setUrlInput(preset.url);
                          handleRunAudit(preset.url);
                        }}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Loading State */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                      <Gauge className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {loadingMessages[loadingStep]}
                      </h4>
                      <p className="text-xs text-zinc-500 font-mono mt-1">
                        Performing real network latency probe and Core Web Vitals audit...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{errorMsg}</p>
                      <p className="text-red-400/80 mt-1">Ensure the website is publicly reachable and try again.</p>
                    </div>
                  </div>
                )}

                {/* 3. SIDE-BY-SIDE BENCHMARK SHOWCASE ("THE HOOK") */}
                {result && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Header Banner: The Conversion Impact / Real Assessment */}
                    <div
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        result.score >= 90
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : result.score >= 50
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div>
                        <span
                          className={`text-[10px] font-mono uppercase tracking-[0.2em] font-semibold ${
                            result.score >= 90
                              ? 'text-emerald-400'
                              : result.score >= 50
                              ? 'text-amber-400'
                              : 'text-red-400'
                          }`}
                        >
                          {result.score >= 90 ? 'High Performance Detected' : 'Conversion Impact Diagnosis'}
                        </span>
                        <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
                          {result.score >= 90
                            ? 'Your website is fast! With ax07.dev, we add interactive 3D WebGL experiences while retaining your 98-100/100 score.'
                            : 'Every 1-second delay in mobile loading causes a 20% drop in inquiries and sales.'}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold shrink-0 border ${
                          result.score >= 90
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : result.score >= 50
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        {result.conversionLossEstimate}
                      </div>
                    </div>

                    {/* The Comparison Grid: Left (User's Site in Green/Orange/Red) vs Right (ax07 98/100 Emerald) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* CARD A: USER'S CURRENT WEBSITE (DYNAMIC: GREEN IF >=90, ORANGE IF >=50, RED IF <50) */}
                      <div
                        className={`p-6 rounded-[28px] border relative overflow-hidden flex flex-col justify-between space-y-6 ${
                          result.score >= 90
                            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.15)]'
                            : result.score >= 50
                            ? 'bg-amber-950/15 border-amber-500/35 shadow-[0_0_30px_rgba(245,158,11,0.12)]'
                            : 'bg-red-950/15 border-red-500/35 shadow-[0_0_30px_rgba(239,68,68,0.12)]'
                        }`}
                      >
                        <div
                          className={`absolute top-0 right-0 w-32 h-32 blur-3xl pointer-events-none ${
                            result.score >= 90
                              ? 'bg-emerald-500/10'
                              : result.score >= 50
                              ? 'bg-amber-500/10'
                              : 'bg-red-500/10'
                          }`}
                        />

                        {/* Card Header */}
                        <div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-mono uppercase tracking-[0.2em] font-semibold ${
                                result.score >= 90
                                  ? 'text-emerald-400'
                                  : result.score >= 50
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                              }`}
                            >
                              Your Tested Website
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
                                result.score >= 90
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : result.score >= 50
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-red-500/20 text-red-300 border-red-500/40'
                              }`}
                            >
                              {result.score >= 90 ? 'Optimized' : result.score >= 50 ? 'Moderate' : 'Critical'}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 truncate mt-1" title={result.normalizedUrl}>
                            {result.normalizedUrl}
                          </p>
                        </div>

                        {/* Large Score Indicator */}
                        <div className="flex items-center gap-5 py-2">
                          <div
                            className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${
                              result.score >= 90
                                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
                                : result.score >= 50
                                ? 'border-amber-400 text-amber-300 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                                : 'border-red-500 text-red-400 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                            }`}
                          >
                            <span className="text-2xl font-bold font-mono tracking-tight leading-none">
                              {result.score}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-400 mt-0.5">/ 100</span>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-white font-display">
                              {result.scoreLabel}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                              {result.score >= 90 ? (
                                <>
                                  Fast mobile loading with{' '}
                                  <strong className="text-emerald-300">{result.metrics.fcp.value}</strong> first paint.
                                </>
                              ) : (
                                <>
                                  Mobile users wait over{' '}
                                  <strong className={result.score >= 50 ? 'text-amber-300' : 'text-red-300'}>
                                    {result.metrics.lcp.value}
                                  </strong>{' '}
                                  before hero content stabilizes.
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Core Web Vitals Breakdown */}
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                            Core Web Vitals (Mobile)
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                              <span className="text-[10px] text-zinc-500 block">First Paint (FCP)</span>
                              <span
                                className={`font-mono font-semibold ${
                                  result.metrics.fcp.rating === 'good'
                                    ? 'text-emerald-300'
                                    : result.metrics.fcp.rating === 'needs-improvement'
                                    ? 'text-amber-300'
                                    : 'text-red-400'
                                }`}
                              >
                                {result.metrics.fcp.value}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                              <span className="text-[10px] text-zinc-500 block">Main Load (LCP)</span>
                              <span
                                className={`font-mono font-semibold ${
                                  result.metrics.lcp.rating === 'good'
                                    ? 'text-emerald-300'
                                    : result.metrics.lcp.rating === 'needs-improvement'
                                    ? 'text-amber-300'
                                    : 'text-red-400'
                                }`}
                              >
                                {result.metrics.lcp.value}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                              <span className="text-[10px] text-zinc-500 block">CPU Block (TBT)</span>
                              <span
                                className={`font-mono font-semibold ${
                                  result.metrics.tbt.rating === 'good'
                                    ? 'text-emerald-300'
                                    : result.metrics.tbt.rating === 'needs-improvement'
                                    ? 'text-amber-300'
                                    : 'text-red-400'
                                }`}
                              >
                                {result.metrics.tbt.value}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                              <span className="text-[10px] text-zinc-500 block">Layout Shift (CLS)</span>
                              <span
                                className={`font-mono font-semibold ${
                                  result.metrics.cls.rating === 'good'
                                    ? 'text-emerald-300'
                                    : 'text-amber-300'
                                }`}
                              >
                                {result.metrics.cls.value}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Diagnostics / Observations */}
                        <div className="space-y-1.5 pt-2 border-t border-white/10">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                            {result.score >= 90 ? 'Detected Performance Highlights:' : 'Identified Bottlenecks:'}
                          </span>
                          <ul className="space-y-1 text-[11px] text-zinc-300">
                            {result.diagnostics.slice(0, 3).map((diag, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span
                                  className={`font-bold ${
                                    result.score >= 90
                                      ? 'text-emerald-400'
                                      : result.score >= 50
                                      ? 'text-amber-400'
                                      : 'text-red-400'
                                  }`}
                                >
                                  •
                                </span>
                                <span>{diag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* CARD B: AX07 SPEC ARCHITECTURE (EMERALD / 98/100 BENCHMARK) */}
                      <div className="p-6 rounded-[28px] bg-emerald-950/20 border border-emerald-500/40 relative overflow-hidden flex flex-col justify-between space-y-6 shadow-[0_15px_45px_rgba(16,185,129,0.12)]">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 blur-3xl pointer-events-none" />

                        {/* Card Header */}
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              ax07.dev Spec Architecture
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Sub-Second Edge
                            </span>
                          </div>
                          <p className="text-xs text-emerald-300/80 mt-1">
                            Your Custom 3D Demo on Vercel Edge Global CDN
                          </p>
                        </div>

                        {/* Large Score Indicator */}
                        <div className="flex items-center gap-5 py-2">
                          <div className="w-20 h-20 rounded-full border-4 border-emerald-400 text-emerald-400 bg-emerald-500/10 flex flex-col items-center justify-center shrink-0 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                            <span className="text-2xl font-bold font-mono tracking-tight leading-none text-emerald-300">
                              {AX07_BENCHMARK.score}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400/80 mt-0.5">/ 100</span>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-white font-display">
                              {AX07_BENCHMARK.scoreLabel}
                            </h4>
                            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                              Sub-second interactive paint in{' '}
                              <strong className="text-emerald-300">{AX07_BENCHMARK.fcp}</strong> with zero layout
                              stutter or lag.
                            </p>
                          </div>
                        </div>

                        {/* Core Web Vitals Breakdown */}
                        <div className="space-y-2 pt-2 border-t border-emerald-500/20">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                            Core Web Vitals (ax07 Demo)
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-emerald-500/20">
                              <span className="text-[10px] text-zinc-400 block">First Paint (FCP)</span>
                              <span className="font-mono font-semibold text-emerald-300">
                                {AX07_BENCHMARK.fcp}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-emerald-500/20">
                              <span className="text-[10px] text-zinc-400 block">Main Load (LCP)</span>
                              <span className="font-mono font-semibold text-emerald-300">
                                {AX07_BENCHMARK.lcp}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-emerald-500/20">
                              <span className="text-[10px] text-zinc-400 block">CPU Block (TBT)</span>
                              <span className="font-mono font-semibold text-emerald-300">
                                {AX07_BENCHMARK.tbt}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-emerald-500/20">
                              <span className="text-[10px] text-zinc-400 block">Layout Shift (CLS)</span>
                              <span className="font-mono font-semibold text-emerald-300">
                                {AX07_BENCHMARK.cls}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Built-in Features */}
                        <div className="space-y-1.5 pt-2 border-t border-emerald-500/20">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                            Engineering Superpowers Included:
                          </span>
                          <ul className="space-y-1 text-[11px] text-zinc-300">
                            {AX07_BENCHMARK.features.slice(0, 3).map((feat, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* THE HOOK CALL TO ACTION BAR */}
                    <div className="p-6 rounded-[24px] bg-gradient-to-r from-zinc-900 to-zinc-950 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                      <div className="text-center sm:text-left">
                        <h3 className="text-sm sm:text-base font-bold text-white font-display">
                          {lang === 'pt'
                            ? 'Quer esta velocidade 98/100 no seu projeto?'
                            : `Want this 98/100 speed for ${result.normalizedUrl.replace(/^https?:\/\//, '')}?`}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {lang === 'pt'
                            ? 'Construímos um protótipo 3D completo em 48h sem compromisso.'
                            : 'We build a clickable 48h custom 3D staging prototype on Vercel Edge.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleWhatsAppBooking}
                          className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
                        >
                          <span>
                            {lang === 'pt' ? 'Pedir Demo 48h no WhatsApp' : 'Get 48h Spec Demo on WhatsApp'}
                          </span>
                          <ArrowUpRight className="w-4 h-4 stroke-[2]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer Info */}
              <div className="p-4 px-6 sm:px-8 border-t border-white/10 bg-white/[0.01] flex flex-wrap items-center justify-between text-[11px] text-zinc-500 font-mono gap-2">
                <span>Real performance analysis powered by Google PageSpeed Insights & Core Web Vitals Engine</span>
                <a
                  href="https://developers.google.com/speed/docs/insights/v5/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-300 transition-colors flex items-center gap-1"
                >
                  <span>Google Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SpeedAuditDock;
