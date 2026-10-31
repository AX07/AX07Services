# ax07 Studio site

The ax07 studio website: one light design system, Lenis smooth scrolling, Motion scroll choreography,
and the ax07 logo as a GPU particle system (React Three Fiber).

## Run

```bash
npm install
npm run dev      # http://localhost:3008
npm run build    # type-check + production build into dist/
```

## Where things live

- `src/index.css`: design tokens (colours, type, radius, easing) and the two button styles. Change the look here.
- `src/lib/content.ts`: all copy, projects, pricing and FAQ. Edit words and numbers here, not in components.
- `src/three/`: the particle logo. `ParticleLogo.tsx` holds the shader and the scroll choreography.
- `src/lib/smooth-scroll.ts`: Lenis plus the scroll driver that tells the 3D scene where the reader is.
- `src/sections/`: one file per chapter, in page order (Hero → Lag race → Showcase → Features → Proof → Process → Work →
  Pricing → FAQ → Final CTA → Footer).

## Pages

- `/`: the home page. `/work`: full portfolio. `/about`: studio and founder.
- `/admin`: create client demo links. Set `VITE_ADMIN_PASSWORD` in Vercel (the default is `adminadmin`). The check runs in
  the browser, so it keeps casual visitors out but is not real security, and links are saved in that browser only.
- `/demo/<slug>?url=<staging site>`: the client sees their staging site full screen with an "Approve & launch" button.
  `vercel.json` routes these paths to the app.

## Live speed test

The "How fast is your site?" card calls Google PageSpeed Insights from the browser. Google's shared
no-key quota is usually exhausted, so add a free key:

1. Google Cloud Console → enable **PageSpeed Insights API** → create an API key.
2. Restrict the key to your domain (HTTP referrers), since it ships in the page.
3. Put it in `.env` locally and in Vercel's environment variables as `VITE_PAGESPEED_KEY`.

## Deploy (Vercel)

1. Push this folder to a new GitHub repository (it is the repository root):

   ```bash
   git init
   git add .
   git commit -m "ax07 studio site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. In Vercel: **Add New → Project**, import the repository. Vite is detected automatically
   (build `npm run build`, output `dist`); leave Root Directory empty.
3. Under Settings → Environment Variables, add `VITE_ADMIN_PASSWORD` (and optionally `VITE_PAGESPEED_KEY`), then redeploy.
