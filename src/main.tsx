import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
// Self-hosted fonts: served from our own domain with the page, no third-party round trips.
// Each file is split by unicode-range, so browsers only download the Latin subset they need.
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/inter-tight/wght.css';
import '@fontsource/instrument-serif/400-italic.css';
import App from './App';
import './index.css';

// Admin and client previews are private: keep them out of the stats
const isPrivate = (url: string) => /\/(admin|demo\/)/.test(new URL(url, window.location.origin).pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics beforeSend={(event) => (isPrivate(event.url) ? null : event)} />
    <SpeedInsights beforeSend={(event) => (isPrivate(event.url) ? null : event)} />
  </StrictMode>,
);
