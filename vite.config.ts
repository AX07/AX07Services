import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { PAGES, SITE_URL } from './src/lib/seo';
import demoPreviews from './src/data/demo-previews.json';

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Writes dist/<page>/index.html for every public page with its own title, description and
 * canonical URL. Vercel serves real files before the SPA rewrite, so crawlers and link previews
 * get the right metadata for /work and /about without running JavaScript.
 */
function pageHtml(): Plugin {
  return {
    name: 'ax07-page-html',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist');
      // Preload the two Latin text faces so the headline paints in its real font, without a swap
      const fonts = readdirSync(resolve(outDir, 'assets')).filter((f) => /^inter(-tight)?-latin-wght-normal-.*\.woff2$/.test(f));
      const preloads = fonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`).join('\n    ');
      const base = readFileSync(resolve(outDir, 'index.html'), 'utf8').replace('</title>', `</title>\n    ${preloads}`);
      writeFileSync(resolve(outDir, 'index.html'), base);
      for (const [path, meta] of Object.entries(PAGES)) {
        if (path === '/') continue;
        const url = SITE_URL + path;
        const html = base
          // No 3D on the inner pages: skip the model download
          .replace(/\s*<link rel="preload" href="\/logo-points\.bin"[^>]*>/, '')
          .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
          .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(meta.description)}$2`)
          .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escape(meta.title)}$2`)
          .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escape(meta.description)}$2`)
          .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`);
        const file = resolve(outDir, `.${path}/index.html`);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, html);
      }
      // Client demo links: the link preview and tab icon are the client's own (from their site's /assets), not ax07's
      for (const d of demoPreviews) {
        for (const sub of ['', '/admin', '/user']) {
          const url = `${SITE_URL}/demo/${d.slug}${sub}`;
          const metas: Record<string, string> = {
            'og:site_name': d.name, 'og:locale': d.locale, 'og:title': d.title, 'og:description': d.description, 'og:url': url,
            'og:image': `${d.site}assets/og.jpg`, 'og:image:alt': d.name,
          };
          let html = base
            .replace(/\s*<link rel="preload" href="\/logo-points\.bin"[^>]*>/, '')
            .replace(/\s*<link\s+rel="canonical"[^>]*>/, '')
            .replace(/\s*<link rel="(?:icon|apple-touch-icon)"[^>]*>/g, '')
            .replace(/<title>[^<]*<\/title>/, `<title>${escape(d.title)}</title>
    <meta name="robots" content="noindex" />
    <link rel="icon" type="image/png" sizes="32x32" href="${d.site}assets/icons/favicon-32.png" />
    <link rel="apple-touch-icon" href="${d.site}assets/icons/apple-touch-icon.png" />`)
            .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(d.description)}$2`);
          for (const [key, value] of Object.entries(metas)) html = html.replace(new RegExp(`(<meta\\s+property="${key}"\\s+content=")[^"]*(")`), `$1${escape(value)}$2`);
          const file = resolve(outDir, `./demo/${d.slug}${sub}/index.html`);
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(file, html);
        }
      }
      // Vercel serves dist/404.html, with a 404 status, for any address that has no file and no
      // rewrite. The app sees the unknown path and renders the not-found page.
      const notFound = base
        .replace(/\s*<link rel="preload" href="\/logo-points\.bin"[^>]*>/, '')
        .replace(/<title>[^<]*<\/title>/, '<title>Page not found | ax07.dev</title>\n    <meta name="robots" content="noindex" />')
        .replace(/\s*<link\s+rel="canonical"[^>]*>/, '');
      writeFileSync(resolve(outDir, '404.html'), notFound);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pageHtml()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        // Keep three.js out of the critical path: it ships in its own chunk, loaded after first paint
        manualChunks(id) {
          if (/node_modules\/(three|@react-three|react-reconciler|its-fine|suspend-react|react-use-measure|zustand)\//.test(id)) return 'three';
          if (/node_modules\/(motion|framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion';
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
        },
      },
    },
  },
});
