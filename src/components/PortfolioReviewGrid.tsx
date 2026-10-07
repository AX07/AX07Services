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

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

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

  // Auto-rotate projects every 3 seconds so user doesn't have to manually flick through
  useEffect(() => {
    if (selectedProject || isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % numProjects);
    }, 3000);

    return () => clearInterval(interval);
  }, [numProjects, selectedProject, isHovered]);

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

  // Mobile Swipe Gesture Support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
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
        {/* ACTIVE-SLIDE CAROUSEL STAGE                                               */}
        {/* Fixed relative dimensions: w-full max-w-xl aspect-[16/10] mx-auto          */}
        {/* Active: scale-100 opacity-100 z-20 shadow-2xl border-white/20             */}
        {/* Inactive: scale-[0.85] opacity-50 z-10 filter blur-[1px]                  */}
        {/* ========================================================================= */}
        <div
          className="relative w-full overflow-visible py-4 sm:py-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Centered Slider Container with Smooth Offset Translation */}
          <div className="relative w-full flex items-center justify-center min-h-[260px] sm:min-h-[360px] md:min-h-[420px]">
            {projects.map((project, index) => {
              const isActive = index === activeIndex;
              const isPrev = index === (activeIndex - 1 + numProjects) % numProjects;
              const isNext = index === (activeIndex + 1) % numProjects;
              const isVisible = isActive || isPrev || isNext;

              // Calculate relative position for 3D visual carousel
              let translateX = 0;
              if (isActive) translateX = 0;
              else if (isPrev) translateX = -105;
              else if (isNext) translateX = 105;
              else translateX = index < activeIndex ? -200 : 200;

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (!isActive) handleSelectProject(index);
                  }}
                  style={{
                    transform: `translateX(${translateX}%)`,
                    display: isVisible ? 'block' : 'none',
                  }}
                  className={`absolute w-full max-w-xl aspect-[16/10] mx-auto overflow-hidden rounded-2xl transition-all duration-500 ease-out cursor-pointer ${
                    isActive
                      ? 'scale-100 opacity-100 z-20 shadow-2xl border-white/20 border-zinc-300 dark:border-white/20 ring-1 ring-zinc-950/10 dark:ring-white/10'
                      : 'scale-[0.85] opacity-50 z-10 filter blur-[1px] hover:opacity-75 border-zinc-200/80 dark:border-white/10'
                  } border bg-zinc-100 dark:bg-zinc-900 group select-none`}
                >
                  {/* Card Background Media */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />

                  {/* Top Card Badges */}
                  <div className="absolute top-3.5 sm:top-5 left-3.5 sm:left-5 right-3.5 sm:right-5 flex items-center justify-between gap-2 pointer-events-none z-10">
                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md border border-zinc-200 dark:border-white/15 text-[11px] font-mono text-zinc-900 dark:text-white/90 shadow-sm">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{project.index}</span>
                      <span className="mx-1.5 text-zinc-400 dark:text-white/40">·</span>
                      <span>{project.year}</span>
                    </span>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-semibold">
                      {project.categories[0] || 'VERIFIED RESULT'}
                    </span>
                  </div>

                  {/* Bottom Card Identity & Quick Action */}
                  <div className="absolute bottom-3.5 sm:bottom-5 left-3.5 sm:left-5 right-3.5 sm:right-5 flex items-end justify-between gap-3 text-white z-10">
                    <div className="max-w-[70%]">
                      <p className="text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1 truncate">
                        {project.client}
                      </p>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display tracking-tight text-white drop-shadow-md leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    {isActive && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDemo(project.id, project.title);
                        }}
                        className="shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:bg-zinc-200 transition-all shadow-lg cursor-pointer"
                        title="Open Live Demo Sandbox"
                      >
                        <span>{lang === 'pt' ? 'Ver Demo' : 'View Demo'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ACTIVE PROJECT DETAILS PANEL & ACTIONS                                     */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-12 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-2xl border border-zinc-200/80 dark:border-white/10 shadow-xl transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Verified Result & Review Quote */}
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  {currentProject.verifiedBadge}
                </span>
                <span className="text-zinc-300 dark:text-white/20 hidden sm:inline">|</span>
                <span className="text-zinc-600 dark:text-white/60">
                  {currentProject.metadataLabel}
                </span>
              </div>

              <blockquote className="text-base sm:text-lg font-serif italic text-zinc-800 dark:text-zinc-200 leading-relaxed">
                "{currentProject.review.quote}"
              </blockquote>

              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                <span className="font-semibold text-zinc-900 dark:text-white font-display">
                  {currentProject.review.author}
                </span>
                <span>—</span>
                <span>{currentProject.review.role}</span>
              </div>
            </div>

            {/* Right: Actions (Launch Demo + View Review Modal) */}
            <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
              <button
                type="button"
                onClick={() => handleOpenDemo(currentProject.id, currentProject.title)}
                className="px-5 sm:px-6 py-3 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                <span>{lang === 'pt' ? 'Ver Demo Ao Vivo' : 'View Demo'}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2]" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenReview(currentProject)}
                className="px-4 sm:px-5 py-3 rounded-full border border-zinc-300 dark:border-white/15 bg-white/80 dark:bg-white/5 text-xs sm:text-sm font-medium text-zinc-800 dark:text-white flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors shadow-sm cursor-pointer"
              >
                <span>{t.portfolio.viewCaseReview}</span>
              </button>
            </div>

          </div>

          {/* ======================================================================= */}
          {/* BOTTOM PAGINATION CONTROLS (Pills & Mobile Chevrons)                    */}
          {/* ======================================================================= */}
          <div className="mt-6 pt-6 border-t border-zinc-200/70 dark:border-white/10 flex items-center justify-between gap-4">
            
            {/* Mobile swipe helper text */}
            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <MousePointer className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'pt' ? 'Deslize ou clique para alternar' : 'Swipe or click card to navigate'} ({activeIndex + 1}/{numProjects})</span>
            </div>

            {/* Segmented Dots / Pill Selectors (01 through 06) */}
            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-full border border-zinc-200 dark:border-white/10">
              <button
                type="button"
                onClick={handlePrev}
                className="sm:hidden w-7 h-7 rounded-full flex items-center justify-center text-zinc-700 dark:text-white/80 hover:bg-white dark:hover:bg-white/15 transition-all"
                title="Previous"
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
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
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
                className="sm:hidden w-7 h-7 rounded-full flex items-center justify-center text-zinc-700 dark:text-white/80 hover:bg-white dark:hover:bg-white/15 transition-all"
                title="Next"
              >
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

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
