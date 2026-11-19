/**
 * Search metadata for every public page. Used twice: the app updates the head as visitors
 * navigate, and the build writes a static HTML file per page (vite.config.ts) so crawlers and
 * link previews see the right title, description and canonical URL without running JavaScript.
 */
export const SITE_URL = 'https://www.ax07.dev';

export interface PageMeta {
  title: string;
  description: string;
}

export const PAGES: Record<string, PageMeta> = {
  '/': {
    title: 'ax07.dev | Websites with a booking system, Ireland & the Algarve',
    description:
      'Websites that turn visitors into booked clients, with the system behind them: every booking request in one inbox for your team, and a page for each client. See a working preview in 48 hours, before you pay.',
  },
  '/work': {
    title: 'Selected work | ax07.dev',
    description:
      'Websites built from a blank page for tour operators, cafés and local businesses in Ireland and the Algarve, with the results they delivered.',
  },
  '/about': {
    title: 'About the studio | ax07.dev',
    description:
      'ax07 is an independent web studio in Ireland and the Algarve. One small team designs and engineers fast, custom websites with a booking inbox and a page for every client.',
  },
};

/** Point the head's title, description, canonical and social tags at the current page. */
export function applyPageMeta(path: string) {
  const meta = PAGES[path] ?? PAGES['/'];
  const url = SITE_URL + (path === '/' ? '/' : path);
  document.title = meta.title;
  setTag('meta[name="description"]', 'content', meta.description);
  setTag('meta[property="og:title"]', 'content', meta.title);
  setTag('meta[property="og:description"]', 'content', meta.description);
  setTag('meta[property="og:url"]', 'content', url);
  setTag('link[rel="canonical"]', 'href', url);
}

function setTag(selector: string, attr: string, value: string) {
  document.querySelector(selector)?.setAttribute(attr, value);
}
