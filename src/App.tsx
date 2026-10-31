import { lazy, Suspense, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { Nav } from './components/Nav';
import { Footer } from './sections/Footer';
import { HomePage } from './pages/HomePage';
import { usePath } from './lib/router';

// Secondary pages load on demand so the home page stays light
const WorkPage = lazy(() => import('./pages/WorkPage').then((m) => ({ default: m.WorkPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));
const DemoPage = lazy(() => import('./pages/DemoPage').then((m) => ({ default: m.DemoPage })));

const TITLES: Record<string, string> = {
  '/': 'ax07 — Websites built for one business. Yours.',
  '/work': 'Selected work — ax07',
  '/about': 'About the studio — ax07',
  '/admin': 'Admin — ax07',
};

export default function App() {
  const path = usePath();
  const demoSlug = path.startsWith('/demo/') ? decodeURIComponent(path.slice(6).split('/')[0]) : null;
  const isPrivate = path === '/admin' || !!demoSlug;

  useEffect(() => {
    document.title = demoSlug ? `Preview — ${demoSlug} | ax07` : (TITLES[path] ?? TITLES['/']);
    // Admin and client previews stay out of search results
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (isPrivate) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, nofollow';
    } else {
      robots?.remove();
    }
  }, [path, demoSlug, isPrivate]);

  if (demoSlug) {
    return (
      <Suspense fallback={null}>
        <DemoPage slug={demoSlug} />
      </Suspense>
    );
  }

  if (path === '/admin') {
    return (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain">
        <Nav />
        {path === '/work' || path === '/about' ? (
          <Suspense fallback={<div className="min-h-[100svh]" />}>{path === '/work' ? <WorkPage /> : <AboutPage />}</Suspense>
        ) : (
          <HomePage />
        )}
        <div className="relative z-10 bg-ink">
          <Footer />
        </div>
      </div>
    </MotionConfig>
  );
}
