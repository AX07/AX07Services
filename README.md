# ax07.dev — High-Motion 3D Web & Spec Studio

> **"We build custom 3D web experiences that convert."**  
> Bespoke WebGL architecture, 48-hour interactive staging sandboxes, sub-second Vercel edge deployment, and direct WhatsApp booking engines engineered by creative technologist **Alex Pintos Mollahan**.

[![Website](https://img.shields.io/badge/Website-ax07.dev-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.ax07.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ax07.dev-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/ax07dev/)
[![Founder](https://img.shields.io/badge/Founder-Alex_Pintos_Mollahan-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/alexpintosmollahan/)
[![Status](https://img.shields.io/badge/Performance-Sub--Second_Edge-10B981?style=for-the-badge)](https://www.ax07.dev)

---

## 🏛️ About ax07.dev

**ax07.dev** is a high-motion creative engineering studio operating between **Dublin, Ireland** and **The Algarve, Portugal**. 

Traditional agency models rely on static PDFs, weeks of wireframing, and generic SaaS templates. **ax07.dev** inverts this entirely through the **Spec-First Engine**:
1. **48-Hour Live Prototypes:** Fully interactive, clickable 3D staging environments hosted directly on Vercel edge URLs (`ax07.dev/demo/[client]`).
2. **Kinetic 3D & Particle Physics:** Proprietary WebGL / Three.js engines with dynamic velocity-based particle dispersion, specular cursor tracking, and continuous 360° scroll physics.
3. **High-Conversion Sales Architecture:** Direct-to-WhatsApp booking flows, localized multi-region support (English `en-IE` and Portuguese `pt-PT`), and transparent fixed-scope delivery tiers.

---

## ⚡ Performance & Optimization Architecture

The entire codebase is engineered for maximum speed, minimal payload, and instant interactivity:

### 1. Draco 3D Geometry Compression
- **Asset:** `public/logo.glb` (84,019 vertices, 153,174 triangles).
- **Optimization:** Compressed using Khronos standard **Draco compression** (`KHR_draco_mesh_compression`) via `@gltf-transform`.
- **Result:** **82% file size reduction** — down from **5.04 MB to 913 KB**.
- **Runtime:** Integrated with Three.js `DRACOLoader` using local WASM binaries in `/public/draco/` for zero-latency, offline-capable decoding.

### 2. Modern WebP Image Pipeline
- All hero backgrounds, photography, and open-graph preview assets are compressed into high-efficiency **WebP** formats:
  - Hero backdrops: **554 KB → 49 KB** (91% reduction).
  - Founder portrait: **189 KB → 19 KB** (90% reduction).
  - Social & OG preview mockups: **2.45 MB → 179 KB** (93% reduction).

### 3. Modular ESM Bundle Splitting
Configured via `vite.config.ts` with custom Rollup `manualChunks` to ensure sub-second First Contentful Paint (FCP) and optimal caching:
- `vendor-three`: Three.js core & DRACOLoader.
- `vendor-motion`: Motion 12 spring and scroll physics engine.
- `vendor-gsap`: GSAP ScrollTrigger timeline management.
- `vendor-icons`: Lucide icon graph.
- `vendor-react`: React 19 core runtime.
- **Route-level dynamic imports (`React.lazy`):** Case study portfolio (`/work`), studio documentation (`/about`), client staging sandboxes (`/demo/[client]`), and admin portals (`/admin`) load strictly on-demand.

---

## 🎨 Design System & Aesthetic Laws

- **Color Discipline:** True pitch black (`#050505` / `#0A0A0B`) backdrop, ultra-clean white typography (`#FFFFFF`), zinc secondaries (`#A1A1AA`), and hair-thin metallic glassmorphic borders (`border-white/10 bg-white/[0.02] backdrop-blur-xl`).
- **Typography:** High-contrast pairing of *Playfair Display*, *Syne*, and *Plus Jakarta Sans* combined with monospaced micro-labeling (`text-[10px] uppercase tracking-[0.25em] font-mono`).
- **Tactile Interactions:**
  - **Lockscreen Shield:** 0.5-second minimum interaction threshold with ambient glow, rejection alerts, and smooth camera zoom-through.
  - **Scroll Progress & Transformations:** Scroll-linked translations and camera scrubbing powered by Motion & GSAP.

---

## ⚡ Google PageSpeed Insights Speed Utility & Conversion Hook

The app includes a dedicated floating dock button (`<SpeedAuditDock />`) integrating Google's official free PageSpeed Insights API (v5):
- **Live Mobile Audit:** Tests any entered domain for mobile performance score (0-100), First Contentful Paint (FCP), Largest Contentful Paint (LCP), Total Blocking Time (TBT), and Cumulative Layout Shift (CLS).
- **The Conversion Hook:** Displays the user's unoptimized website score in red/orange alongside a static preview of an optimized **ax07.dev benchmark score (98/100 with sub-second 0.4s load times)**.
- **Conversion Impact Callout:** Calculates estimated visitor drop-off (e.g., *~53% lost mobile visitors*) with a direct, prefilled WhatsApp booking CTA to request a 48h custom 3D staging prototype from Alex Pintos Mollahan.

## 🚀 Live Showcase & Case Studies

| Client / Brand | Sector | Experience & Features |
| :--- | :--- | :--- |
| **FlyFoil Formosa** | Luxury Marine & E-Foil | Kinetic hydrofoil 3D visualization, tide integration, WhatsApp rental booking engine. |
| **CryptoAX07** | Institutional Web3 | Real-time liquidity charts, particle telemetry, institutional vault security tiers. |
| **FinTrack AI** | Predictive Wealth & Fintech | Interactive AI-powered simulation sandbox, portfolio yield calculators. |
| **Altura Kites** | Extreme Watersports | Live Algarve wind forecasting, adrenaline video backgrounds, quick booking dock. |
| **Albania Fácil** | Real Estate & Relocation | High-motion villa gallery, residency legal concierge, VIP WhatsApp onboarding. |

---

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/), [TypeScript 5.8](https://www.typescriptlang.org/), [Vite 6](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **3D & Animation:** [Three.js](https://threejs.org/) (r186), [DRACOLoader](https://threejs.org/docs/#examples/en/loaders/DRACOLoader), [Motion 12](https://motion.dev/), [GSAP ScrollTrigger](https://greensock.com/)
- **UI Components & Icons:** [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/)
- **Telemetry & Insights:** [@vercel/analytics](https://vercel.com/analytics), [@vercel/speed-insights](https://vercel.com/speed-insights)

---

## 📂 Project Structure

```text
├── public/
│   ├── draco/                    # Local Draco WASM decoders for instant 3D decompression
│   ├── logo.glb                  # Compressed 3D metallic emblem asset (913 KB)
│   ├── mockup-no-background.webp # Optimized OG social card & mockup
│   ├── alex-profile.webp         # Founder profile photography
│   └── robots.txt / sitemap.xml  # Production SEO indexing rules
├── src/
│   ├── assets/images/            # WebP backgrounds and logos
│   ├── components/
│   │   ├── Hero.tsx              # Scroll-driven hero with lowered mobile anchor
│   │   ├── Lockscreen.tsx        # 0.5s tactile hold-to-unlock gesture screen
│   │   ├── LogoCanvas.tsx        # React Three.js canvas wrapper
│   │   ├── PortfolioReviewGrid.tsx # Desktop & mobile symmetrical project showcase
│   │   ├── WorkPortfolioPage.tsx # Full portfolio & case study routes
│   │   ├── AboutStudioPage.tsx   # Studio thesis, founder bio & stack specs
│   │   ├── CommandIsland.tsx     # Floating glassmorphic dock
│   │   └── VercelDeployIsland.tsx # Instant staging deployment modal
│   ├── google ai stuido export/
│   │   ├── logo3D.js             # Three.js particle & scroll engine with DracoLoader
│   │   └── standalone-demo.html  # Standalone zero-dependency showcase
│   ├── lib/
│   │   ├── content.ts            # Multi-region copy (Ireland en-IE / Portugal pt-PT)
│   │   └── design-system.ts      # Apple-grade spring physics constants
│   ├── App.tsx                   # Lazy-loaded router with Suspense fallback
│   └── main.tsx                  # Application bootstrap entry
└── vite.config.ts                # Rollup vendor-chunking & esnext optimization
```

---

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Lint & typecheck:**
   ```bash
   npm run lint
   ```

---

## 📬 Contact & Inquiries

- **Lead 3D Architect & Founder:** Alex Pintos Mollahan
- **Website:** [ax07.dev](https://www.ax07.dev)
- **LinkedIn Studio:** [linkedin.com/company/ax07dev](https://www.linkedin.com/company/ax07dev/)
- **LinkedIn Founder:** [linkedin.com/in/alexpintosmollahan](https://www.linkedin.com/in/alexpintosmollahan/)
- **Direct WhatsApp:** [+353 89 441 9127](https://wa.me/353894419127)
- **Email:** [ax07.dev@gmail.com](mailto:ax07.dev@gmail.com)

---

*Designed and engineered with surgical precision by ax07.dev.*
