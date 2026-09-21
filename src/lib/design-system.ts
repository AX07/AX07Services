/**
 * APPLE iOS/macOS HIG & EMIL KOWALSKI DESIGN ENGINEERING SPECIFICATION
 * 
 * Core Tenets (Apple HIG):
 * 1. Motion Physics: mass: 1, stiffness: 170, damping: 26
 * 2. Bottom Sheet: stiffness: 300, damping: 30 with drag handle (w-12 h-1 bg-white/20 rounded-full mb-4 mx-auto)
 * 3. Card Hover: whileHover={{ scale: 1.02 }}
 * 4. Primary Capsule CTA: whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} + glow
 * 5. Glass System Control: whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
 * 6. Circular Action Button: w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:scale-105
 * 7. Segmented Control: bg-zinc-900/80 p-1 rounded-full border border-white/10 + sliding bg-white/15 pill
 * 8. SF Symbols Alignment: stroke-[1.75], gap-2 flex items-center
 * 9. Vibrancy Stack: text-white, text-white/60, text-white/40, tracking-tight
 */

export const appleSprings = {
  // Apple Standard HIG Fluid Spring
  default: {
    type: 'spring' as const,
    mass: 1,
    stiffness: 170,
    damping: 26,
  },
  // Apple Bottom Sheet slide-up physics
  bottomSheet: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  // Snappy: Segmented controls, quick buttons, pills
  snappy: {
    type: 'spring' as const,
    stiffness: 380,
    damping: 30,
    mass: 0.8,
  },
  // Smooth: Modals, overlays, sheet dialogs
  smooth: {
    type: 'spring' as const,
    stiffness: 240,
    damping: 28,
    mass: 1,
  },
  // Gentle: Accordion panels, layout shifts
  gentle: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 26,
    mass: 1.1,
  }
};

export const emilSprings = appleSprings;

export const appleGestures = {
  // Interactive cards scale to 1.02 on hover
  cardHover: {
    scale: 1.02,
    transition: appleSprings.default,
  },
  // Capsule Action Buttons (Primary CTA)
  primaryButton: {
    hover: { scale: 1.03, transition: appleSprings.default },
    tap: { scale: 0.96, transition: appleSprings.default },
  },
  // Glass System Controls (Secondary CTA)
  secondaryButton: {
    hover: { scale: 1.03, transition: appleSprings.default },
    tap: { scale: 0.96, transition: appleSprings.default },
  },
  // Icon-only circular button
  circularButton: {
    hover: { scale: 1.05, transition: appleSprings.default },
    tap: { scale: 0.94, transition: appleSprings.default },
  },
  // Generic tap button
  tapButton: {
    scale: 0.96,
    transition: appleSprings.default,
  },
  tapCard: {
    scale: 0.99,
    transition: appleSprings.default,
  },
  tapRow: {
    scale: 0.995,
    transition: appleSprings.default,
  },
};

export const emilGestures = appleGestures;

export const emilEasings = {
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeOutQuart: [0.25, 1, 0.5, 1] as const,
  easeInOutCubic: [0.65, 0, 0.35, 1] as const,
  appleFluid: [0.32, 0.72, 0, 1] as const
};

export const appleModalVariants = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.22, ease: emilEasings.easeOutExpo } },
    exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }
  },
  // Detached bottom sheet that slides up on the Y-axis (stiffness: 300, damping: 30)
  bottomSheet: {
    initial: { y: '100%', opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: appleSprings.bottomSheet,
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    }
  },
  dialog: {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: appleSprings.smooth
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: 4,
      transition: { duration: 0.15, ease: 'easeIn' }
    }
  }
};

export const emilModalVariants = appleModalVariants;

