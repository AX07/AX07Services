# ax07 3D Logo & Particle Physics Export Package

This standalone package contains everything needed to replicate the 3D logo asset, kinetic mouse hover dispersion, and GSAP scroll zoom animation in any project (including other Google AI Studio projects, Next.js, Vite, Webflow, or plain HTML).

---

## 📁 What's Inside This Folder (`/export`)

| File | Purpose |
| :--- | :--- |
| **`logo.glb`** | The 3D metallic logo binary model asset (also provided as `stylized+logo+3d+model.glb`). |
| **`logo3D.js`** | The complete Three.js & GSAP animation engine. Handles asset centering, hollow contour particle extraction, 3D tilt, mouse glint lighting, repulsion on hover, restorative lerping, and scroll scrubbing. |
| **`LogoCanvas.tsx`** | Ready-to-use drop-in component for React / Next.js projects. |
| **`standalone-demo.html`** | A standalone preview demonstrating the 3D logo and scroll effect with zero boilerplate. |
| **`README.md`** | This integration guide. |

---

## 🚀 How to Import into Another Google AI Studio Project

### Option A: Direct Copy & Paste into an AI Studio Prompt
In your new Google AI Studio project, you can upload `logo.glb` and `logo3D.js` (or tell the AI assistant):
> *"I have uploaded `logo.glb` and `logo3D.js` from my previous project into `/public/logo.glb` and `/src/logo3D.js`. Please render this 3D logo in the hero section with the mouse hover particle dispersion and the GSAP scroll-through animation."*

### Option B: Drop-in Vanilla JS / HTML
1. Place `logo.glb` in your public folder (e.g. `/public/logo.glb`).
2. Add Three.js and GSAP to your `<head>`:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
   ```
3. Initialize in your JavaScript:
   ```javascript
   import { init3DLogo } from './logo3D.js';

   init3DLogo({
     container: document.getElementById('my-canvas-container'),
     scrollTriggerEl: document.getElementById('my-scroll-section'),
     modelUrl: '/logo.glb',
     mode: 'hybrid' // 'hybrid' | 'particles' | 'mesh'
   });
   ```

### Option C: React / Next.js
1. Install dependencies in your new project:
   ```bash
   npm install three gsap
   npm install -D @types/three
   ```
2. Copy `LogoCanvas.tsx` into your components folder and `logo.glb` into `/public/logo.glb`.
3. Render it inside any section:
   ```tsx
   import { LogoCanvas } from './components/LogoCanvas';

   export default function Hero() {
     return (
       <div id="hero-scroll" className="relative w-full h-[200vh]">
         <div className="sticky top-0 w-full h-screen">
           <LogoCanvas modelUrl="/logo.glb" scrollWrapperId="hero-scroll" />
         </div>
       </div>
     );
   }
   ```

---

## ⚙️ Physics & Animation Tuning (in `logo3D.js`)

- **Dynamic Velocity-Based Mouse Interaction**:
  - `baseDispersalRadius = 0.18`: When the mouse is moved slowly or hovers, the deformation sphere is tight and pinpoint (nearly the size of the mouse cursor itself).
  - `maxDispersalRadius = 1.15`: When the mouse moves quickly across the emblem, the dispersal sphere dynamically expands to create an explosive kinetic particle blast.
  - `velocityBoost`: Calculated in real-time from mouse cursor velocity (`speedPxPerMs`).
- **360° Continuous Scroll Rotation**:
  - The 3D asset turns continuously a full 360° (`Math.PI * 2`) across the scroll duration from start to bottom.
- **Burst Strength**: Scaled dynamically (`0.12` to `0.22`) based on cursor speed.
- **Restorative Lerp**: `returnLerp = 0.05` *(particles float back into their contour positions)*.
- **Display Modes**:
  - `'hybrid'`: 3D metallic asset + contour particles + hover burst (Default)
  - `'particles'`: Gaps-hollowed particle emblem only
  - `'mesh'`: Pure 3D metallic model with dynamic cursor glint
