import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from '../lib/content';
import { scrollToY } from '../lib/smooth-scroll';
import { goToSection, linkProps, navigate, usePath } from '../lib/router';
import { SPRING } from '../lib/tokens';

const links = [
  { id: 'showcase', label: 'Showcase' },
  { id: 'features', label: 'Features' },
  { id: 'proof', label: 'Speed test' },
  { id: 'work', label: 'Work' },
  { id: 'pricing', label: 'Pricing' },
];

// Separate pages, shown after the section links
const pages = [{ path: '/about', label: 'About' }];

export function Nav() {
  const path = usePath();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
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
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
      <nav
        className={`flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border px-2 py-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled ? 'border-line bg-surface/75 shadow-float backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
        aria-label="Main"
      >
        <button type="button" onClick={() => (path === '/' ? scrollToY(0) : navigate('/'))} className="flex cursor-pointer items-center gap-2.5" aria-label="ax07, back to top">
          <img src="/logo-mark.png" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
          <span className="font-display text-[17px] font-semibold tracking-tight">ax07</span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.id} className="relative">
              {active === l.id && (
                <motion.span
                  layoutId="nav-active"
                  transition={SPRING}
                  className="absolute inset-0 rounded-full bg-raised"
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
              {path === pg.path && <span className="absolute inset-0 rounded-full bg-raised" />}
              <a
                {...linkProps(pg.path)}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200 hover:text-fg ${path === pg.path ? 'text-fg' : 'text-muted'}`}
              >
                {pg.label}
              </a>
            </li>
          ))}
        </ul>

        <a href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-[40px] !px-5 text-sm">
          Free preview
        </a>
      </nav>
    </header>
  );
}
