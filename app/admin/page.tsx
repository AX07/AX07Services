'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Globe, 
  Link as LinkIcon, 
  Phone, 
  Calendar, 
  Layers,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ClientConfig, MarketTier, getStoredClients, saveStoredClients, ensureAbsoluteUrl } from '@/src/lib/clients';
import { BrandLogo } from '@/src/components/BrandLogo';

export default function AdminPage() {
  const [clients, setClients] = useState<ClientConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'All' | MarketTier>('All');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Authentication State (Password Protected: adminadmin)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('ax07_admin_auth') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'adminadmin') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ax07_admin_auth', 'true');
      }
      setAuthError(false);
      toast.success('Access Granted', {
        description: 'Welcome to the AX07 Admin Management Engine.',
      });
    } else {
      setAuthError(true);
      toast.error('Access Denied', {
        description: 'Incorrect administrator password.',
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ax07_admin_auth');
    }
    setPasswordInput('');
    toast.info('Admin session locked');
  };

  // Form State
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [stagingUrl, setStagingUrl] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [marketTier, setMarketTier] = useState<MarketTier>('Ireland (€1,800)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    // If slug hasn't been manually diverged or is empty, auto-slugify
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
      if (!stagingUrl || stagingUrl.includes('.vercel.app')) {
        setStagingUrl(generatedSlug ? `https://${generatedSlug}-demo.vercel.app` : '');
      }
    }
  };

  const handleCreateOrUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!cleanSlug) {
      toast.error('Please provide a valid client slug');
      return;
    }
    if (!name.trim()) {
      toast.error('Please provide a client name');
      return;
    }
    if (!stagingUrl.trim()) {
      toast.error('Please provide a staging deployment URL');
      return;
    }

    setIsSubmitting(true);

    const formattedStagingUrl = ensureAbsoluteUrl(stagingUrl.trim());
    const formattedBookingUrl = bookingUrl.trim() 
      ? ensureAbsoluteUrl(bookingUrl.trim()) 
      : 'https://booking.uk.hsone.app/soe/new/';

    const newClient: ClientConfig = {
      slug: cleanSlug,
      name: name.trim(),
      stagingUrl: formattedStagingUrl,
      bookingUrl: formattedBookingUrl,
      whatsappNumber: whatsappNumber.trim() || '+353894419127',
      marketTier,
      createdAt: new Date().toISOString(),
    };

    const existingIndex = clients.findIndex((c) => c.slug.toLowerCase() === cleanSlug);
    let updatedList: ClientConfig[];

    if (existingIndex >= 0) {
      updatedList = [...clients];
      updatedList[existingIndex] = newClient;
      toast.success(`Updated demo link for ${newClient.name}`);
    } else {
      updatedList = [newClient, ...clients];
      toast.success(`Created new staging route: /demo/${newClient.slug}`);
    }

    setClients(updatedList);
    saveStoredClients(updatedList);

    // Reset Form
    setSlug('');
    setName('');
    setStagingUrl('');
    setBookingUrl('');
    setWhatsappNumber('');
    setIsSubmitting(false);
  };

  const handleDeleteClient = (slugToDelete: string) => {
    const target = clients.find((c) => c.slug === slugToDelete);
    if (!target) return;
    if (confirm(`Are you sure you want to remove the demo route for "${target.name}"?`)) {
      const updated = clients.filter((c) => c.slug !== slugToDelete);
      setClients(updated);
      saveStoredClients(updated);
      toast.success(`Deleted demo link: /demo/${slugToDelete}`);
    }
  };

  const handleCopyUrl = (client: ClientConfig, withParam = true) => {
    // Generate URL that works anywhere across all devices
    const fullUrl = withParam && client.stagingUrl
      ? `https://ax07.dev/demo/${client.slug}?url=${encodeURIComponent(client.stagingUrl)}`
      : `https://ax07.dev/demo/${client.slug}`;

    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(client.slug);
    toast.success('Demo URL copied to clipboard!', {
      description: fullUrl,
    });
    setTimeout(() => {
      setCopiedSlug(null);
    }, 2500);
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.stagingUrl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTierFilter === 'All' || c.marketTier === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-zinc-950 min-h-screen text-white flex flex-col items-center justify-center p-4 relative selection:bg-white/20 selection:text-white font-sans overflow-hidden">
        <Toaster position="bottom-right" richColors theme="dark" />

        {/* Ambient Radial Lighting */}
        <div 
          aria-hidden="true"
          className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[450px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" 
        />
        <div 
          aria-hidden="true"
          className="fixed bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-blue-500/5 blur-[130px] rounded-full pointer-events-none" 
        />

        <div className="w-full max-w-md relative z-10">
          <div className="rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] text-center">
            
            {/* Header Identity */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center shadow-inner">
                <BrandLogo imgClassName="w-8 h-8 object-contain" themeOverride="dark" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-4">
              <Lock className="w-3 h-3" />
              <span>Restricted Access</span>
            </div>

            <h1 className="text-2xl font-bold font-display tracking-tight text-white mb-2">
              ax07.dev Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed mb-8">
              Enter administrator password to access client staging deployments and production demo routes.
            </p>

            {/* Auth Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative text-left">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                  Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError(false);
                    }}
                    placeholder="Enter admin password..."
                    autoFocus
                    className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-white/[0.04] border ${
                      authError
                        ? 'border-red-500/80 focus:border-red-500 ring-2 ring-red-500/20'
                        : 'border-white/10 focus:border-emerald-500/80'
                    } text-white placeholder-zinc-500 text-sm focus:outline-none transition-all font-sans`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="mt-2 text-xs text-red-400 font-mono">
                    Incorrect password. Access denied.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/10 active:scale-[0.98]"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unlock Command Center</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
              <a
                href="/ie"
                className="hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>← Back to Website</span>
              </a>
              <span className="text-[10px] text-zinc-600">AX07 OS SECURE</span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white p-4 sm:p-8 md:p-12 relative flex flex-col justify-between selection:bg-white/20 selection:text-white font-sans">
      <Toaster position="bottom-right" richColors theme="dark" />

      {/* Ambient Radial Glow */}
      <div 
        aria-hidden="true"
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none" 
      />

      <div className="max-w-6xl mx-auto w-full relative z-10 pt-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/10 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/ie"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Return to Main Experience"
            >
              <ArrowLeft className="w-4 h-4" />
              <BrandLogo imgClassName="w-5 h-5 object-contain" themeOverride="dark" className="flex items-center" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">ax07.dev OS ENGINE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                Admin Client Staging System
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{clients.length} Active Staging Routes</span>
            </div>
            <a
              href="/"
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
            >
              View Site →
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-mono text-zinc-400 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/10 flex items-center gap-1.5 cursor-pointer"
              title="Lock Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Creation Form Section */}
        <div className="mb-12 p-6 sm:p-8 rounded-[32px] bg-white/[0.03] border border-white/15 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display">Generate New Client Demo Route</h2>
              <p className="text-xs text-white/60">
                Overlay ax07.dev floating glassmorphism controls above any client staging deployment.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateOrUpdateClient} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Field 1: Client Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Client Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. FlyFoil Formosa"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-sans transition-colors placeholder:text-white/30"
                  required
                />
              </div>

              {/* Field 2: Client Slug */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Client Slug (Subpath) <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono text-white/40">/demo/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="flyfoil"
                    className="w-full pl-18 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono transition-colors placeholder:text-white/30"
                    required
                  />
                </div>
              </div>

              {/* Field 3: Vercel / Staging Target URL */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Vercel / Staging Target URL <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <Globe className="w-4 h-4 text-white/40 absolute left-3.5" />
                  <input
                    type="url"
                    value={stagingUrl}
                    onChange={(e) => setStagingUrl(e.target.value)}
                    placeholder="https://flyfoilformosa.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono transition-colors placeholder:text-white/30"
                    required
                  />
                </div>
              </div>

              {/* Field 4: Exact / External PMS Booking URL */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Exact / External PMS Booking URL
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-white/40 absolute left-3.5" />
                  <input
                    type="url"
                    value={bookingUrl}
                    onChange={(e) => setBookingUrl(e.target.value)}
                    placeholder="https://booking.uk.hsone.app/soe/new/?pid=UKBBC01"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono transition-colors placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Field 5: Client WhatsApp Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Client WhatsApp Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-white/40 absolute left-3.5" />
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+353894419127"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono transition-colors placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Field 6: Market Tier */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Market Tier
                </label>
                <select
                  value={marketTier}
                  onChange={(e) => setMarketTier(e.target.value as MarketTier)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 font-sans transition-colors cursor-pointer"
                >
                  <option value="Ireland (€1,800)">Ireland (€1,800)</option>
                  <option value="Algarve (€500)">Algarve (€500)</option>
                </select>
              </div>

            </div>

            {/* Quick Demo Slug Generator Presets */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-white/40">Presets:</span>
                {[
                  { name: 'FinTrack AI', s: 'fintrack', tier: 'Ireland (€1,800)' as MarketTier },
                  { name: 'Ocean Charters', s: 'ocean-charters', tier: 'Algarve (€500)' as MarketTier },
                  { name: 'FlyFoil Formosa', s: 'flyfoil', tier: 'Algarve (€500)' as MarketTier },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.s}
                    onClick={() => {
                      setName(preset.name);
                      setSlug(preset.s);
                      setStagingUrl(`https://${preset.s}.vercel.app`);
                      setMarketTier(preset.tier);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 stroke-[2]" />
                <span>Save &amp; Generate Demo Link</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Routes & Link Manager */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold font-display text-white">Active Client Staging Routes</h3>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                Dynamic routes served at ax07.dev/demo/[slug]
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by name or slug..."
                  className="pl-8 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
                />
              </div>

              {/* Market Tier Filter */}
              <select
                value={selectedTierFilter}
                onChange={(e) => setSelectedTierFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-zinc-900">All Markets</option>
                <option value="Ireland (€1,800)" className="bg-zinc-900">Ireland (€1,800)</option>
                <option value="Algarve (€500)" className="bg-zinc-900">Algarve (€500)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map((client) => {
              const fullDemoUrl = `https://ax07.dev/demo/${client.slug}`;
              const isCopied = copiedSlug === client.slug;

              return (
                <div
                  key={client.slug}
                  className="p-5 sm:p-6 rounded-[24px] bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {client.marketTier}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopyUrl(client, false)}
                        className="text-xs font-mono text-white/40 hover:text-emerald-400 transition-colors cursor-pointer"
                        title="Copy clean slug URL (without parameters)"
                      >
                        /demo/{client.slug}
                      </button>
                    </div>

                    <h4 className="text-lg font-bold font-display text-white group-hover:text-emerald-400 transition-colors">
                      {client.name}
                    </h4>

                    {/* Target preview link */}
                    <p className="text-xs font-mono text-zinc-400 truncate mt-1 flex items-center gap-1">
                      <span className="text-white/30">Target:</span>
                      <span className="text-zinc-300">{client.stagingUrl}</span>
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    {/* Copy Demo URL Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(client, true)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-white font-semibold'
                          : 'bg-white/10 hover:bg-white/15 text-white/90 hover:text-white border border-white/10'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Demo URL!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copy Demo URL</span>
                        </>
                      )}
                    </button>

                    {/* Open in Staging Frame */}
                    <a
                      href={`/demo/${client.slug}?url=${encodeURIComponent(client.stagingUrl)}`}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Test live staging overlay"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {/* Delete Action */}
                    <button
                      type="button"
                      onClick={() => handleDeleteClient(client.slug)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Delete Staging Route"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredClients.length === 0 && (
              <div className="col-span-full p-12 text-center rounded-[24px] bg-white/[0.02] border border-dashed border-white/10 text-white/40 font-mono text-sm">
                No client routes found matching &ldquo;{searchTerm}&rdquo;. Create your first staging link above.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
