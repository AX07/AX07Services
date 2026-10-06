import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Star, CheckCircle2, ArrowUpRight, X, Sparkles, ChevronLeft, ChevronRight, MousePointer } from 'lucide-react';
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
  altura: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=85',
  'la-kafeteria': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=85',
  albania: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=85',
  cryptoax07: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=2000&q=85',
};

const PROJECT_DEMO_URLS: Record<string, string> = {
  cryptoax07: '/demo/cryptoax07?url=https%3A%2F%2Fcryptoax07.com%2F',
  flyfoil: '/demo/flyfoil?url=https%3A%2F%2Fflyfoilformosa.com%2F',
  altura: '/demo/altura?url=https%3A%2F%2Faltura-kite-school.vercel.app%2F',
  'altura-kites': '/demo/altura?url=https%3A%2F%2Faltura-kite-school.vercel.app%2F',
  'la-kafeteria': '/demo/la-kafeteria?url=https%3A%2F%2Fla-kafeteria.vercel.app%2F',
  lakafeteria: '/demo/la-kafeteria?url=https%3A%2F%2Fla-kafeteria.vercel.app%2F',
  albania: '/demo/albania?url=https%3A%2F%2Falbania-facil.vercel.app%2F',
  'albania-facil': '/demo/albania?url=https%3A%2F%2Falbania-facil.vercel.app%2F',
  fintrack: '/demo/fintrack?url=https%3A%2F%2Ffintrack-ai.vercel.app%2F',
  '8to8dental': '/demo/8to8dental?url=https%3A%2F%2F8to8dental-demo.vercel.app%2F',
};

export function PortfolioReviewGrid() {
  const { t, lang } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1); // 1 = down, -1 = up
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number>(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Combine translated text with project imagery
  const projects: PortfolioProject[] = (t.portfolio?.projects || []).map((p) => ({
    ...p,
    image: PROJECT_IMAGES[p.id] || PROJECT_IMAGES.flyfoil,
    review: {
      ...p.review,
      rating: 5,
      verified: true,
    },
  }));

  const numProjects = projects.length || 5;

  // =========================================================================
  // SCROLL-DRIVEN STICKY PIN TRACKING
  // Calibrated track depth: 800vh (700vh scroll travel across 5 projects = 140vh per card)
  // Each project card requires precisely two deliberate scrolls / two swipes to advance.
  // =========================================================================
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (selectedProject) return;
    // Map progress (0.0 to 1.0) cleanly to project indices (0 to numProjects - 1)
    const clamped = Math.max(0, Math.min(0.9999, progress));
    const nextIdx = Math.min(numProjects - 1, Math.floor(clamped * numProjects));

    if (nextIdx !== prevIndexRef.current) {
      setDirection(nextIdx > prevIndexRef.current ? 1 : -1);
      prevIndexRef.current = nextIdx;
      setActiveIndex(nextIdx);
    }
  });

  // Smooth scroll to a specific project slice when clicked in the pill or chevron navigation
  const handleSelectProject = (targetIndex: number) => {
    if (!containerRef.current) return;
    const clampedIndex = Math.max(0, Math.min(numProjects - 1, targetIndex));
    setDirection(clampedIndex >= activeIndex ? 1 : -1);
    prevIndexRef.current = clampedIndex;
    setActiveIndex(clampedIndex);

    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const sectionTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;
    const targetFraction = (clampedIndex + 0.5) / numProjects;
    const targetScroll = sectionTop + totalScrollable * targetFraction;

    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      handleSelectProject(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < numProjects - 1) {
      handleSelectProject(activeIndex + 1);
    }
  };

  // Keyboard navigation when user is focused inside this section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top <= 50 && rect.bottom >= window.innerHeight - 50;
      if (!inView) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (activeIndex < numProjects - 1) {
          e.preventDefault();
          handleSelectProject(activeIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (activeIndex > 0) {
          e.preventDefault();
          handleSelectProject(activeIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, numProjects, selectedProject]);

  const currentProject = projects[activeIndex] || projects[0];
  const isLastProject = activeIndex === numProjects - 1;
  const isFirstProject = activeIndex === 0;

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

  // Motion variants for text content passing by
  const slideVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 35 : -35,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        y: { type: 'spring', stiffness: 320, damping: 26 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 },
      },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -35 : 35,
      opacity: 0,
      scale: 0.98,
      transition: {
        y: { type: 'spring', stiffness: 320, damping: 26 },
        opacity: { duration: 0.22 },
        scale: { duration: 0.22 },
      },
    }),
  };

  // Motion variants for background media passing by
  const bgVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: dir > 0 ? 1.05 : 0.96,
    }),
    center: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: dir > 0 ? 0.96 : 1.05,
      transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section
      id="project-showcase"
      ref={containerRef}
      className="relative w-full h-[800vh] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white select-none z-20 transition-colors duration-300"
    >
      {/* ========================================================================= */}
      {/* STICKY VIEWPORT CONTAINER                                                  */}
      {/* Stays pinned to 100vh during the calibrated 800vh scroll depth.            */}
      {/* 700vh scroll travel / 5 projects = 140vh per card (2 deliberate scrolls).  */}
      {/* ========================================================================= */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col justify-between transition-colors duration-300">
        
        {/* Subtle Top Edge Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-zinc-200/80 dark:bg-white/10 z-40 overflow-hidden">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 origin-left"
          />
        </div>

        {/* Dynamic Background Media Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence custom={direction} mode="popLayout">
            {isLastProject && !isMobileScreen ? (
              /* Project 5 Desktop: Interactive 3D WebGL Canvas in Background */
              <motion.div
                key="cryptoax07-3d-bg"
                custom={direction}
                variants={bgVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full relative pointer-events-auto"
              >
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="w-full h-full object-cover brightness-[0.88] contrast-[1.05] dark:brightness-[0.22] dark:contrast-[1.2] absolute inset-0 transition-[filter] duration-300"
                />
                <div className="absolute inset-0 z-10 w-full h-full">
                  <LogoCanvas
                    canvasId="portfolio-last-logo-canvas"
                    autoRotate={true}
                    showControls={false}
                    showHint={false}
                    defaultMode="hybrid"
                    className="w-full h-full"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 blur-[150px] rounded-full pointer-events-none z-10"
                />
              </motion.div>
            ) : (
              /* Projects 1-4 (and Project 5 on mobile): High-Resolution Edge Media */
              <motion.div
                key={currentProject.id}
                custom={direction}
                variants={bgVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full relative"
              >
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="w-full h-full object-cover brightness-[0.85] contrast-[1.05] dark:brightness-[0.45] dark:contrast-[1.15] transition-[filter] duration-300"
                />
                {isLastProject && (
                  <div
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] h-[350px] bg-gradient-to-r from-blue-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:to-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-10"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cinematic Vignette Overlay: Luminous on light theme, deep and dark on night mode */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/90 via-zinc-50/25 to-zinc-50/70 dark:from-black/95 dark:via-black/35 dark:to-black/75 pointer-events-none z-10 transition-colors duration-300" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-zinc-50/20 to-zinc-50/70 dark:via-black/25 dark:to-black/80 pointer-events-none z-10 transition-colors duration-300" />
        </div>

        {/* ========================================================================= */}
        {/* 1. TOP HEADER BAR: Project Index + Categories                              */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full flex items-center justify-between gap-4 p-6 sm:p-10 md:p-14 pt-20 sm:pt-14">
          {/* Left Glass Pill: Index + Year */}
          <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md border border-zinc-200/80 dark:border-white/15 px-4 py-2 rounded-full flex items-center gap-2.5 text-xs font-mono tracking-wider text-zinc-900 dark:text-white shadow-lg transition-colors">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentProject.index}</span>
            <span className="text-zinc-400 dark:text-white/30">/</span>
            <span className="text-zinc-700 dark:text-white/80">{currentProject.year}</span>
            <span className="text-zinc-400 dark:text-white/30">·</span>
            <span className="text-zinc-600 dark:text-white/60 font-sans hidden sm:inline">{currentProject.client}</span>
          </div>

          {/* Right Category Tag Pills */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {(currentProject.categories || []).map((cat) => (
              <div
                key={cat}
                className="bg-white/80 dark:bg-white/10 backdrop-blur-md border border-zinc-200/80 dark:border-white/15 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-700 dark:text-white/90 shadow-md transition-colors"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CENTER HERO CONTENT: Typography & Interactive Card Trigger              */}
        {/* ========================================================================= */}
        <div 
          onClick={() => handleOpenDemo(currentProject.id, currentProject.title)}
          className="relative z-30 my-auto text-left max-w-5xl px-6 sm:px-10 md:px-14 cursor-pointer group pointer-events-auto"
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentProject.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-md transition-colors">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{currentProject.verifiedBadge}</span>
              </div>

              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-zinc-950 dark:text-white/95 group-hover:text-black dark:group-hover:text-white transition-colors font-display leading-[0.95] drop-shadow-[0_2px_18px_rgba(255,255,255,0.85)] dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
                {currentProject.title}
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-zinc-700 dark:text-white/70 mt-5 tracking-normal font-sans max-w-2xl group-hover:text-zinc-950 dark:group-hover:text-white transition-colors flex items-center gap-2 font-medium">
                <span>{lang === 'pt' ? 'Clique para abrir a demo interativa ao vivo' : 'Click to launch live demo staging'}</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.75] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM BAR: Project Indicators, Metadata & Navigation Pill              */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-10 md:p-14 pb-8 sm:pb-8 border-t border-zinc-200/80 dark:border-white/10 pt-5">
          {/* Left Metadata Label */}
          <div className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-white/70 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentProject.metadataLabel}</span>
            <span className="text-zinc-400 dark:text-white/30 hidden md:inline">|</span>
            <span className="text-zinc-500 dark:text-white/40 text-[11px] font-mono hidden md:inline-flex items-center gap-1.5">
              <MousePointer className="w-3 h-3 text-emerald-500" />
              Scroll to pass through ({activeIndex + 1}/{numProjects})
            </span>
          </div>

          {/* Center: Apple HIG Project Segmented Pill Navigation */}
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/90 dark:border-white/15 p-1 rounded-full shadow-xl self-center sm:self-auto">
            {/* Previous Arrow Button */}
            <button
              type="button"
              disabled={isFirstProject}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isFirstProject
                  ? 'text-zinc-300 dark:text-white/20 cursor-not-allowed'
                  : 'text-zinc-700 dark:text-white/70 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/15 cursor-pointer'
              }`}
              title="Previous Project"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Project Segment Pills (01 to 05) */}
            {projects.map((proj, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectProject(idx);
                  }}
                  className={`relative px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-black font-bold shadow-md'
                      : 'text-zinc-600 dark:text-white/60 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{proj.index}</span>
                </button>
              );
            })}

            {/* Next Arrow Button */}
            <button
              type="button"
              disabled={isLastProject}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isLastProject
                  ? 'text-zinc-300 dark:text-white/20 cursor-not-allowed'
                  : 'text-zinc-700 dark:text-white/70 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/15 cursor-pointer'
              }`}
              title="Next Project"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* Right CTA Button: Direct Demo Button + Review Modal Trigger */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDemo(currentProject.id, currentProject.title);
              }}
              className="px-5 py-2.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
              title="Open Live Interactive Demo"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>{lang === 'pt' ? 'Ver Demo Ao Vivo' : 'View Demo'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenReview(currentProject);
              }}
              className="px-4 py-2.5 rounded-full border border-zinc-300/80 dark:border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-md text-xs sm:text-sm font-medium text-zinc-900 dark:text-white flex items-center gap-1.5 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer shadow-lg"
              title="View Client Review"
            >
              <span>{t.portfolio.viewCaseReview}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. INTERACTIVE CASE STUDY & REVIEW MODAL                                   */}
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

              {/* Apple-style squircle glass modal with spring dynamics */}
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

                {/* Modal Body: Client quote/review in elegant large italic typography */}
                <div className="my-8">
                  <p className="text-lg sm:text-xl font-light italic text-zinc-800 dark:text-white/90 leading-relaxed font-serif">
                    "{selectedProject.review.quote}"
                  </p>
                </div>

                {/* Modal Footer: Client name & title (Left) | Capsule 'VISIT PAGE' CTA (Right) */}
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
      </div>
    </section>
  );
}

export default PortfolioReviewGrid;
