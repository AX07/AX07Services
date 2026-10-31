import { useEffect, useState } from 'react';
import { scrollToId } from './smooth-scroll';

/**
 * A tiny pushState router: the site has a handful of pages, so a dependency would weigh more
 * than it saves. Old country-prefixed links (/ie, /ie/work, /pt/about) resolve to the same pages.
 */
const COUNTRY_PREFIX = /^\/(ie|pt)(?=\/|$)/i;

export function normalisePath(pathname: string) {
  const path = pathname.replace(COUNTRY_PREFIX, '').replace(/\/+$/, '');
  return path || '/';
}

export function usePath() {
  const [path, setPath] = useState(() => normalisePath(window.location.pathname));

  useEffect(() => {
    const onChange = () => setPath(normalisePath(window.location.pathname));
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  return path;
}

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.search + window.location.hash) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  if (!to.includes('#')) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

/** Props for an <a> that navigates in-app but still works with middle-click and "open in new tab". */
export function linkProps(to: string) {
  return {
    href: to,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to);
    },
  };
}

/** Scroll to a home-page section, or go home first when on another page. */
export function goToSection(id: string) {
  if (normalisePath(window.location.pathname) === '/' && document.getElementById(id)) {
    scrollToId(id);
    if (window.location.hash) window.history.replaceState({}, '', '/');
  } else {
    navigate(`/#${id}`);
  }
}
