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

export function PortfolioReviewGrid() {
  const { t } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1); // 1 = down, -1 = up
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number>(0);

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
  // Responsive track depth: 220vh (~24vh scroll per card) so each project card
  // passes briskly and sooner without requiring excessive scroll effort.
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

  const handleOpenReview = (project: PortfolioProject) => {
    setSelectedProject(project);
  };

  const handleVisitPage = (e: React.MouseEvent, url: string, title: string) => {
    e.stopPropagation();
    toast.success(`Opening ${title} Live Staging`, {
      description: 'Routing to live edge preview deployment...',
    });
    window.open(url, '_blank');
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
      className="relative w-full h-[220vh] bg-zinc-950 text-white select-none z-20"
    >
      {/* ========================================================================= */}
      {/* STICKY VIEWPORT CONTAINER                                                  */}
      {/* Stays pinned to 100vh during the responsive 220vh scroll depth.            */}
      {/* The section does not move; instead, the projects pass by as you scroll!    */}
      {/* ========================================================================= */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden bg-zinc-950 text-white flex flex-col justify-between">
        
        {/* Subtle Top Edge Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white/10 z-40 overflow-hidden">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 origin-left"
          />
        </div>

        {/* Dynamic Background Media Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence custom={direction} mode="wait">
            {isLastProject ? (
              /* Project 5: Interactive 3D WebGL Canvas in Background */
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
                  className="w-full h-full object-cover brightness-[0.22] contrast-[1.2] absolute inset-0"
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
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full pointer-events-none z-10"
                />
              </motion.div>
            ) : (
              /* Projects 1-4: High-Resolution Edge Media */
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
                  className="w-full h-full object-cover brightness-[0.45] contrast-[1.15]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/75 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black/80 pointer-events-none z-10" />
        </div>

        {/* ========================================================================= */}
        {/* 1. TOP HEADER BAR: Project Index + Categories                              */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full flex items-center justify-between gap-4 p-6 sm:p-10 md:p-14 pt-20 sm:pt-14">
          {/* Left Glass Pill: Index + Year */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full flex items-center gap-2.5 text-xs font-mono tracking-wider text-white shadow-lg">
            <span className="font-semibold text-emerald-400">{currentProject.index}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/80">{currentProject.year}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/60 font-sans hidden sm:inline">{currentProject.client}</span>
          </div>

          {/* Right Category Tag Pills */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {(currentProject.categories || []).map((cat) => (
              <div
                key={cat}
                className="bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/90 shadow-md"
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
          onClick={() => handleOpenReview(currentProject)}
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{currentProject.verifiedBadge}</span>
              </div>

              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white/95 group-hover:text-white transition-colors font-display leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
                {currentProject.title}
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-white/70 mt-5 tracking-normal font-sans max-w-2xl group-hover:text-white transition-colors flex items-center gap-2">
                <span>{t.portfolio.expandHint}</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 stroke-[1.75] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM BAR: Project Indicators, Metadata & Navigation Pill              */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-10 md:p-14 pb-8 sm:pb-8 border-t border-white/10 pt-5">
          {/* Left Metadata Label */}
          <div className="text-xs sm:text-sm font-mono text-white/70 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentProject.metadataLabel}</span>
            <span className="text-white/30 hidden md:inline">|</span>
            <span className="text-white/40 text-[11px] font-mono hidden md:inline-flex items-center gap-1.5">
              <MousePointer className="w-3 h-3 text-emerald-400" />
              Scroll to pass through ({activeIndex + 1}/{numProjects})
            </span>
          </div>

          {/* Center: Apple HIG Project Segmented Pill Navigation */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 backdrop-blur-xl border border-white/15 p-1 rounded-full shadow-2xl self-center sm:self-auto">
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
                  ? 'text-white/20 cursor-not-allowed'
                  : 'text-white/70 hover:text-white hover:bg-white/15 cursor-pointer'
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
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
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
                  ? 'text-white/20 cursor-not-allowed'
                  : 'text-white/70 hover:text-white hover:bg-white/15 cursor-pointer'
              }`}
              title="Next Project"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* Right CTA Button: Open Review Modal */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenReview(currentProject);
              }}
              className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs sm:text-sm font-medium text-white flex items-center gap-2 hover:bg-white hover:text-black transition-all cursor-pointer shadow-lg"
            >
              <span>{t.portfolio.viewCaseReview}</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.75]" />
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
                className="fixed inset-0 bg-black/80 backdrop-blur-xl"
              />

              {/* Apple-style squircle glass modal with spring dynamics */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 bg-zinc-900/90 backdrop-blur-2xl border border-white/15 rounded-[36px] p-8 md:p-10 text-white shadow-2xl max-w-2xl w-full select-text"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label={t.portfolio.modalClose}
                >
                  <X className="w-4 h-4 stroke-[1.75]" />
                </button>

                {/* Modal Header: 5 golden stars + verified outcome badge */}
                <div className="flex flex-wrap items-center gap-3 pr-10">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 stroke-[1.75]" />
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[1.75]" />
                    <span>{selectedProject.verifiedBadge}</span>
                  </div>
                </div>

                {/* Modal Body: Client quote/review in elegant large italic typography */}
                <div className="my-8">
                  <p className="text-lg sm:text-xl font-light italic text-white/90 leading-relaxed font-serif">
                    "{selectedProject.review.quote}"
                  </p>
                </div>

                {/* Modal Footer: Client name & title (Left) | White Capsule 'VISIT PAGE' CTA (Right) */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-white tracking-tight font-display">
                      {selectedProject.review.author}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/60 font-sans mt-0.5">
                      {selectedProject.review.role}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleVisitPage(e, selectedProject.link, selectedProject.title)}
                    className="w-full sm:w-auto rounded-full bg-white text-black font-semibold text-xs sm:text-sm px-6 py-3 uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-shadow flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>{t.portfolio.visitPage}</span>
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
