import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { PAGES, SITE_URL } from './src/lib/seo';

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
          .replace(/\s*<link rel="preload" href="\/logo\.glb"[^>]*>/, '')
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
