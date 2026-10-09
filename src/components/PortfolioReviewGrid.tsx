import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, ArrowUpRight, X, Sparkles, ChevronLeft, ChevronRight, ShieldCheck, MousePointer } from 'lucide-react';
import { toast } from 'sonner';
import { LogoCanvas } from './LogoCanvas';
import { useApp } from '../context/ThemeLanguageContext';

export interface ReviewData {
  rating: number;
  quote: string;
  author: string;
  role: string;
  verified?: boolean;
}

export interface PortfolioProject {
  id: string;
  index: string;
  title: string;
  client: string;
  year: string;
  categories: string[];
  stat: string;
  statLabel: string;
  verifiedBadge: string;
  image: string;
  metadataLabel: string;
  link: string;
  review: ReviewData;
}

const PROJECT_IMAGES: Record<string, string> = {
  flyfoil: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
  fintrack: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2000&q=85',
  altura: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=85',
  'la-kafeteria': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=85',
  albania: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=85',
  cryptoax07: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=2000&q=85',
};

const PROJECT_DEMO_URLS: Record<string, string> = {
  flyfoil: '/demo/flyfoil?url=https%3A%2F%2Fflyfoilformosa.com%2F',
  fintrack: '/demo/fintrack?url=https%3A%2F%2Ffintrack-ai.vercel.app%2F',
  altura: '/demo/altura?url=https%3A%2F%2Faltura-kite-school.vercel.app%2F',
  'altura-kites': '/demo/altura?url=https%3A%2F%2Faltura-kite-school.vercel.app%2F',
  'la-kafeteria': '/demo/la-kafeteria?url=https%3A%2F%2Fla-kafeteria.vercel.app%2F',
  lakafeteria: '/demo/la-kafeteria?url=https%3A%2F%2Fla-kafeteria.vercel.app%2F',
  albania: '/demo/albania?url=https%3A%2F%2Falbania-facil.vercel.app%2F',
  'albania-facil': '/demo/albania?url=https%3A%2F%2Falbania-facil.vercel.app%2F',
  cryptoax07: '/demo/cryptoax07?url=https%3A%2F%2Fcryptoax07.com%2F',
};

export function PortfolioReviewGrid() {
  const { t, lang } = useApp();
  // Carousel State: FlyFoil loads by default at index 0
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });
  const touchResumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map translated projects strictly ensuring FlyFoil is projects[0]
  const prioritizedOrder = ['flyfoil', 'fintrack', 'altura', 'la-kafeteria', 'albania', 'cryptoax07'];
  const rawProjects = t.portfolio?.projects || [];
  const sortedRawProjects = [...rawProjects].sort((a, b) => {
    const idxA = prioritizedOrder.indexOf(a.id);
    const idxB = prioritizedOrder.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  const projects: PortfolioProject[] = sortedRawProjects.map((p) => ({
    ...p,
    image: PROJECT_IMAGES[p.id] || PROJECT_IMAGES.flyfoil,
    review: {
      ...p.review,
      rating: 5,
      verified: true,
    },
  }));

  const numProjects = projects.length || 6;
  const currentProject = projects[activeIndex] || projects[0];

  // Auto-flick carousel every 3.5 seconds unless user is hovering or touching
  useEffect(() => {
    if (selectedProject || isHovered || isTouching) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % numProjects);
    }, 3500);

    return () => clearInterval(interval);
  }, [numProjects, selectedProject, isHovered, isTouching]);

  // Clean up touch timeout on unmount
  useEffect(() => {
    return () => {
      if (touchResumeTimeoutRef.current) {
        clearTimeout(touchResumeTimeoutRef.current);
      }
    };
  }, []);

  // Navigation handlers
  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : numProjects - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < numProjects - 1 ? prev + 1 : 0));
  };

  const handleSelectProject = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(numProjects - 1, index)));
  };

  // Mobile Swipe Gesture & Touch Hold/Pause Support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    if (touchResumeTimeoutRef.current) {
      clearTimeout(touchResumeTimeoutRef.current);
      touchResumeTimeoutRef.current = null;
    }
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        handleNext();
      } else if (diff < -45) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;

    // Keep paused momentarily on touch interaction, then resume flicking
    if (touchResumeTimeoutRef.current) {
      clearTimeout(touchResumeTimeoutRef.current);
    }
    touchResumeTimeoutRef.current = setTimeout(() => {
      setIsTouching(false);
    }, 3200);
  };

  // Desktop keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, numProjects]);

  const handleOpenDemo = (projectId: string, title?: string) => {
    const targetUrl = PROJECT_DEMO_URLS[projectId] || `/demo/${projectId}`;
    toast.success(`Opening ${title || 'Project'} Demo`, {
      description: 'Launching live client staging sandbox...',
    });
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleOpenReview = (project: PortfolioProject) => {
    setSelectedProject(project);
  };

  const handleVisitPage = (e: React.MouseEvent, projectId: string, title: string) => {
    e.stopPropagation();
    handleOpenDemo(projectId, title);
  };

  return (
    <section
      id="project-showcase"
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 md:py-36 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300 overflow-hidden select-none z-20 border-t border-zinc-200/80 dark:border-white/10"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER: Clean typographic lead & category indicators               */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 stroke-[1.75]" />
              <span>{lang === 'pt' ? 'PROTÓTIPOS EM 48H · CASOS REAIS' : '48-HOUR SPEC PROTOTYPES · LIVE WORKS'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-zinc-950 dark:text-white leading-[1.08]">
              {lang === 'pt' ? 'Projetos Selecionados & Resultados.' : 'Selected Works & Proven Conversions.'}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-sans mt-3 max-w-2xl leading-relaxed">
              {lang === 'pt' 
                ? 'Explore os protótipos 3D de alta performance construídos para conversão direta por WhatsApp.' 
                : 'Explore interactive 3D web systems and sub-second edge builds engineered for direct customer acquisition.'}
            </p>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2.5 self-start md:self-end shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-zinc-300 dark:border-white/15 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl flex items-center justify-center text-zinc-800 dark:text-white hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-md cursor-pointer"
              title="Previous project"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-zinc-300 dark:border-white/15 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl flex items-center justify-center text-zinc-800 dark:text-white hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-md cursor-pointer"
              title="Next project"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BIGGER FULL-SCREEN CAROUSEL STAGE                                         */}
        {/* Card fits whole screen, houses testimonial quote, author, and CTAs        */}
        {/* Pauses when hovered or touched; flicks through automatically when idle    */}
        {/* ========================================================================= */}
        <div
          className="relative w-full -mx-4 sm:mx-0 overflow-hidden py-3 sm:py-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Centered Slider Container with Smooth Translation */}
          <div className="relative w-full flex items-center justify-center min-h-[600px] sm:min-h-[640px] md:min-h-[680px]">
            {projects.map((project, index) => {
              const isActive = index === activeIndex;
              const isPrev = index === (activeIndex - 1 + numProjects) % numProjects;
              const isNext = index === (activeIndex + 1) % numProjects;
              const isVisible = isActive || isPrev || isNext;

              // Smooth 3D stage offsets for the carousel flick:
              // On mobile, placing adjacent cards at ±88% with scale(0.88) ensures the side cards
              // peek prominently into the viewport, giving an unmistakable native carousel feel.
              const prevOffset = isMobile ? -88 : -103;
              const nextOffset = isMobile ? 88 : 103;

              let translateX = 0;
              if (isActive) translateX = 0;
              else if (isPrev) translateX = prevOffset;
              else if (isNext) translateX = nextOffset;
              else translateX = index < activeIndex ? -200 : 200;

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (!isActive) handleSelectProject(index);
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    transform: `translateX(${translateX}%)`,
                    display: isVisible ? 'block' : 'none',
                  }}
                  className={`absolute ${
                    isMobile
                      ? 'w-[80vw] max-w-[325px] h-[580px] rounded-[48px] border-[6px] border-zinc-800 dark:border-zinc-700/80 shadow-[0_24px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/15'
                      : 'w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl min-h-[580px] md:min-h-[620px] lg:min-h-[660px] rounded-[28px] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.75)] ring-1 ring-white/10'
                  } mx-auto overflow-hidden transition-all duration-700 ease-out cursor-pointer ${
                    isActive
                      ? 'scale-100 opacity-100 z-20'
                      : 'scale-[0.88] sm:scale-[0.92] opacity-45 hover:opacity-75 z-10 filter blur-[0.5px]'
                  } bg-zinc-950 group select-none flex flex-col justify-between`}
                >
                  {/* Card Background Media */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />

                  {/* Multi-Stop Cinematic Scrim for Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 via-40% to-black/35 pointer-events-none" />

                  {/* Subtle ambient mesh glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none" />

                  {/* ========================================================================= */}
                  {/* MOBILE DEVICE FRAME (Smartphone screen preview with Dynamic Island)       */}
                  {/* ========================================================================= */}
                  {isMobile ? (
                    <div className="relative z-10 w-full h-full flex flex-col justify-between text-white pointer-events-auto">
                      {/* Dynamic Island Pill at Top */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-24 h-5 rounded-full bg-black border border-white/15 flex items-center justify-between px-2.5 pointer-events-none shadow-md">
                        <div className="w-2 h-2 rounded-full bg-[#18181b] border border-white/20 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-blue-900/90" />
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>

                      {/* Phone Top Header: Status Bar + Project Index */}
                      <div className="w-full">
                        {/* Status bar */}
                        <div className="pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-mono text-white/90 pointer-events-none">
                          <span className="font-semibold tracking-tight">9:41</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono px-1 rounded bg-white/15 text-emerald-400 font-bold">5G</span>
                            <div className="w-5 h-2.5 rounded-xs border border-white/70 p-0.5 flex items-center">
                              <div className="w-full h-full bg-white rounded-2xs" />
                            </div>
                          </div>
                        </div>

                        {/* Top Badges */}
                        <div className="px-4 pt-1.5 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/90 shadow-sm flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">{project.index}</span>
                            <span className="text-white/30">·</span>
                            <span>{project.year}</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{project.stat}</span>
                          </span>
                        </div>
                      </div>

                      {/* Phone Bottom Sheet Glass Overlay (Clean: Case review text hidden) */}
                      <div className="w-full">
                        <div className="m-3 p-4 rounded-[26px] bg-black/80 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-3">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-0.5">
                              {project.client}
                            </p>
                            <h3 className="text-xl font-bold font-display text-white tracking-tight leading-tight">
                              {project.title}
                            </h3>
                            <p className="text-[11px] font-mono text-emerald-300 font-medium mt-0.5">
                              {project.verifiedBadge}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDemo(project.id, project.title);
                              }}
                              className="w-full py-2.5 px-4 rounded-full bg-white text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-md active:scale-98 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                              <span>{lang === 'pt' ? 'Ver Demo Ao Vivo' : 'View Live Demo'}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.4]" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenReview(project);
                              }}
                              className="w-full py-2 px-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-xs font-semibold text-white flex items-center justify-center gap-2 hover:bg-white/20 transition-all active:scale-98 cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" />
                              <span>{t.portfolio.viewCaseReview}</span>
                            </button>
                          </div>
                        </div>

                        {/* Phone Home Indicator Bar */}
                        <div className="pb-2 flex justify-center pointer-events-none">
                          <div className="w-28 h-1 rounded-full bg-white/40" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ========================================================================= */
                    /* DESKTOP BROWSER FRAME (Mac window chrome with URL bar & clean HUD)        */
                    /* ========================================================================= */
                    <div className="relative z-10 w-full h-full flex flex-col justify-between text-white pointer-events-auto">
                      {/* macOS Window Chrome Header */}
                      <div className="w-full px-5 py-3.5 bg-black/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-4">
                        {/* Traffic lights */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-sm" />
                          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-sm" />
                          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-sm" />
                        </div>

                        {/* Centered browser address pill */}
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-zinc-300 max-w-md w-full justify-center shadow-inner">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-zinc-500">https://</span>
                          <span className="font-medium text-white">{project.link.replace('https://', '').replace(/\/$/, '')}</span>
                        </div>

                        {/* Right: Badges & 5 Stars */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono uppercase text-emerald-400 font-bold">
                            {project.categories[0] || 'VERIFIED RESULT'}
                          </span>
                          <div className="flex items-center gap-1 bg-black/40 border border-white/10 px-2.5 py-1 rounded-full">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-xs font-mono text-white/90 ml-1 font-semibold">5.0</span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Bottom Floating HUD (Clean: Case review text hidden) */}
                      <div className="m-6 md:m-8 p-6 md:p-8 rounded-[24px] bg-black/80 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="text-xs font-mono text-emerald-400 uppercase tracking-[0.2em] font-semibold">
                              {project.client}
                            </span>
                            <span className="text-white/30">·</span>
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              {project.stat} {project.statLabel}
                            </span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
                            {project.title}
                          </h3>
                          <p className="text-xs sm:text-sm font-mono text-zinc-400 mt-1">
                            {project.metadataLabel}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDemo(project.id, project.title);
                            }}
                            className="px-6 py-3 rounded-full bg-white text-zinc-950 font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
                            <span>{lang === 'pt' ? 'Ver Demo Ao Vivo' : 'View Live Demo'}</span>
                            <ArrowUpRight className="w-4 h-4 stroke-[2.4]" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenReview(project);
                            }}
                            className="px-5 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-sm font-medium text-white flex items-center gap-2 hover:bg-white/20 hover:border-white/30 transition-all shadow-md cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-400 stroke-[2]" />
                            <span>{t.portfolio.viewCaseReview}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM PAGINATION CONTROLS & LIVE FLICK STATUS BAR                        */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-2xl border border-zinc-200/80 dark:border-white/10 shadow-lg transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Live status beacon */}
          <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            {isHovered || isTouching ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {lang === 'pt' ? 'Pausado em' : 'Paused on'} {currentProject.client}
                </span>
                <span className="text-zinc-400 dark:text-white/40">({activeIndex + 1}/{numProjects})</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {lang === 'pt' ? 'Avanço Automático Ativo' : 'Auto-Flick Active'}
                </span>
                <span className="text-zinc-400 dark:text-white/40">·</span>
                <span>{lang === 'pt' ? 'Toque para pausar' : 'Hover or touch to hold'} ({activeIndex + 1}/{numProjects})</span>
              </>
            )}
          </div>

          {/* Right: Segmented Dots / Pill Selectors (01 through 06) + Chevrons */}
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-full border border-zinc-200 dark:border-white/10">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 dark:text-white/80 hover:bg-white dark:hover:bg-white/15 transition-all cursor-pointer"
              title="Previous"
              aria-label="Previous Project"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" />
            </button>

            {projects.map((proj, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleSelectProject(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold shadow-sm'
                      : 'text-zinc-600 dark:text-white/60 hover:text-zinc-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{proj.index.split('/')[0].trim()}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 dark:text-white/80 hover:bg-white dark:hover:bg-white/15 transition-all cursor-pointer"
              title="Next"
              aria-label="Next Project"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* CASE STUDY & CLIENT REVIEW MODAL                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-xl"
            />

            {/* Squircle glass modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/80 dark:border-white/15 rounded-[36px] p-8 md:p-10 text-zinc-900 dark:text-white shadow-2xl max-w-2xl w-full select-text transition-colors"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-white/70 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                aria-label={t.portfolio.modalClose}
              >
                <X className="w-4 h-4 stroke-[1.75]" />
              </button>

              {/* Modal Header: 5 golden stars + verified outcome badge */}
              <div className="flex flex-wrap items-center gap-3 pr-10">
                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 stroke-[1.75]" />
                  ))}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 stroke-[1.75]" />
                  <span>{selectedProject.verifiedBadge}</span>
                </div>
              </div>

              {/* Modal Body: Client review quote */}
              <div className="my-8">
                <p className="text-lg sm:text-xl font-light italic text-zinc-800 dark:text-white/90 leading-relaxed font-serif">
                  "{selectedProject.review.quote}"
                </p>
              </div>

              {/* Modal Footer */}
              <div className="pt-6 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white tracking-tight font-display">
                    {selectedProject.review.author}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-white/60 font-sans mt-0.5">
                    {selectedProject.review.role}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleVisitPage(e, selectedProject.id, selectedProject.title)}
                  className="w-full sm:w-auto rounded-full bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs sm:text-sm px-6 py-3 uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>{lang === 'pt' ? 'VER DEMO AO VIVO' : 'VIEW DEMO'}</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default PortfolioReviewGrid;
