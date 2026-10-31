import { AnimatePresence, motion } from 'motion/react';
import { toggleTheme, useTheme } from '../lib/theme';
import { EASE_OUT } from '../lib/tokens';

/** Sun / moon switch. The icon spins through as the new theme sweeps out from this button. */
export function ThemeToggle() {
  const theme = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-line-strong text-fg transition-[transform,background-color,color,border-color] duration-300 ease-[var(--ease-out)] hover:scale-110 hover:border-accent hover:bg-accent-soft hover:text-accent active:scale-110"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.svg
          key={theme}
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          initial={{ rotate: -120, scale: 0.4, opacity: 0, y: 14 }}
          animate={{ rotate: 0, scale: 1, opacity: 1, y: 0 }}
          exit={{ rotate: 120, scale: 0.4, opacity: 0, y: -14 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          {dark ? (
            // Moon
            <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7z" />
          ) : (
            // Sun
            <>
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}
