import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/content';
import { scrollToY } from '../lib/smooth-scroll';
import { goToSection, linkProps, navigate, usePath } from '../lib/router';
import { SPRING } from '../lib/tokens';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { id: 'showcase', label: 'See it work' },
  { id: 'work', label: 'Work' },
  { id: 'process', label: 'Free preview' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
];

// Separate pages, shown after the section links
const pages = [
  { path: '/about', label: 'About' },
];

// Phone menu: the main places, then the call to action
const menu = [
  { id: 'features', label: 'How it works' },
  { id: 'showcase', label: 'See it work' },
  { path: '/work', label: 'Work' },
  { path: '/about', label: 'About' },
  { id: 'pricing', label: 'Pricing' },
];

export function Nav() {
  const path = usePath();
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);
  // At the very top of the home page the hero has the stage to itself; the bar slides in on scroll
  const hidden = path === '/' && atTop;
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // The phone menu closes on a new page and on Escape
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setAtTop(window.scrollY <= 24);
      // Active link = the last section whose top has passed the upper third of the screen
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const l of links) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= line && el.getBoundingClientRect().bottom > line) current = l.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 transition-[transform,opacity] duration-500 ease-[var(--ease-out)] has-[:focus-visible]:translate-y-0 has-[:focus-visible]:opacity-100 sm:pt-4 ${
        hidden && !open ? 'pointer-events-none -translate-y-[130%] opacity-0' : ''
      }`}
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border px-2 py-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled || open ? 'glass' : 'border-transparent bg-transparent'
        }`}
        aria-label="Main"
      >
        <button type="button" onClick={() => (path === '/' ? scrollToY(0) : navigate('/'))} className="flex cursor-pointer items-center gap-2.5" aria-label="ax07.dev, back to top">
          <img src="/logo-mark.png" alt="" width={28} height={28} className="h-7 w-7 dark:invert" />
          <span className="font-display text-[20px] font-semibold tracking-tight">ax07<span className="text-muted">.dev</span></span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.id} className="relative">
              {active === l.id && (
                <motion.span
                  layoutId="nav-active"
                  transition={SPRING}
                  className="absolute inset-0 rounded-full bg-fg/[0.07]"
                />
              )}
              <button
                type="button"
                onClick={() => goToSection(l.id)}
                className={`relative cursor-pointer rounded-full px-3.5 py-2 text-sm transition-colors duration-200 hover:text-fg ${
                  active === l.id ? 'text-fg' : 'text-muted'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
          {pages.map((pg) => (
            <li key={pg.path} className="relative">
              {path === pg.path && <span className="absolute inset-0 rounded-full bg-fg/[0.07]" />}
              <a
                {...linkProps(pg.path)}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200 hover:text-fg ${path === pg.path ? 'text-fg' : 'text-muted'}`}
              >
                {pg.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-[40px] !px-5 text-sm max-lg:hidden">
            Free preview
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="phone-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full bg-fg text-on-fg lg:hidden"
          >
            <span className={`h-[2px] w-4 rounded-full bg-current transition-transform duration-300 ${open ? 'translate-y-[4px] rotate-45' : ''}`} />
            <span className={`h-[2px] w-4 rounded-full bg-current transition-transform duration-300 ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          id="phone-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass absolute inset-x-4 top-full mt-2 rounded-[28px] border p-3 lg:hidden"
        >
          <ul>
            {menu.map((m) => (
              <li key={m.label}>
                {m.path ? (
                  <a
                    href={m.path}
                    onClick={(e) => {
                      setOpen(false);
                      linkProps(m.path!).onClick(e);
                    }}
                    className="block rounded-2xl px-4 py-3 font-display text-[19px] font-semibold"
                  >
                    {m.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      goToSection(m.id!);
                    }}
                    className="block w-full cursor-pointer rounded-2xl px-4 py-3 text-left font-display text-[19px] font-semibold"
                  >
                    {m.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-2 w-full"
          >
            Get your free preview
          </a>
        </motion.div>
      )}
    </header>
  );
}
