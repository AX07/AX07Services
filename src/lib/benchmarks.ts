export interface IndustryBenchmark {
  id: string;
  slug: string;
  name: string;
  icon: string;
  category: string;
  splineUrl: string;
  splineCodeUrl?: string;
  webflowUrl: string;
  description: string;
  speedMetric: string;
  growthMetric: string;
  feeMetric: string;
}

export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  {
    id: 'dentist',
    slug: 'dentist',
    name: 'Dentist & Medical Clinic',
    icon: '🦷',
    category: 'Healthcare',
    splineUrl: 'https://my.spline.design/interactivegeometricshapes-957fbb11ad5d11f8eec4c5409a633ba4/',
    splineCodeUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
    webflowUrl: 'https://8to8dental-demo.vercel.app',
    description: 'Interactive 3D dental implant visualizer & sub-second patient appointment booking engine.',
    speedMetric: '⚡ 280ms Load',
    growthMetric: '📈 +45% Direct Leads',
    feeMetric: '💼 0% Booking Fee',
  },
  {
    id: 'landscape',
    slug: 'landscape',
    name: 'Landscape & Architecture',
    icon: '🌿',
    category: 'Architecture & Design',
    splineUrl: 'https://my.spline.design/interactivegeometricshapes-957fbb11ad5d11f8eec4c5409a633ba4/',
    splineCodeUrl: 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
    webflowUrl: 'https://albania-facil.vercel.app/',
    description: '3D topographical route visualizer & interactive landscape design explorer with WhatsApp quote dispatch.',
    speedMetric: '⚡ 310ms Load',
    growthMetric: '📈 +52% Inquiries',
    feeMetric: '💼 0% Intermediary',
  },
  {
    id: 'restaurant',
    slug: 'restaurant',
    name: 'Restaurant & Specialty Dining',
    icon: '🍷',
    category: 'Hospitality',
    splineUrl: 'https://my.spline.design/interactivegeometricshapes-957fbb11ad5d11f8eec4c5409a633ba4/',
    splineCodeUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
    webflowUrl: 'https://altura-kite-school.vercel.app/',
    description: 'Interactive 3D table atmosphere reservation & sensory cocktail menu with instant WhatsApp booking.',
    speedMetric: '⚡ 340ms Load',
    growthMetric: '📈 3.2x Bookings',
    feeMetric: '💼 0% TheFork Cut',
  },
  {
    id: 'watersports',
    slug: 'watersports',
    name: 'Watersports & Hydrofoil Academy',
    icon: '🏄',
    category: 'Extreme Sports',
    splineUrl: 'https://my.spline.design/interactivegeometricshapes-957fbb11ad5d11f8eec4c5409a633ba4/',
    splineCodeUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
    webflowUrl: 'https://flyfoilformosa.com/',
    description: 'Electric hydrofoil kinetic 3D configurator with real-time wave, tidal, and wind telemetry.',
    speedMetric: '⚡ 360ms Load',
    growthMetric: '📈 +40% Rentals',
    feeMetric: '💼 0% OTA Fees',
  },
  {
    id: 'gym',
    slug: 'gym',
    name: 'Gym & High-Performance Fitness',
    icon: '🏋️',
    category: 'Fitness & Wellness',
    splineUrl: 'https://my.spline.design/interactivegeometricshapes-957fbb11ad5d11f8eec4c5409a633ba4/',
    splineCodeUrl: 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
    webflowUrl: 'https://cryptoax07.com/',
    description: 'High-motion kinetic training membership portal with private coach checkout in 1 click.',
    speedMetric: '⚡ 290ms Load',
    growthMetric: '📈 +60% Members',
    feeMetric: '💼 0% App Store Cut',
  },
  {
    id: 'real-estate',
    slug: 'real estate',
    name: 'Real Estate & Luxury Architecture',
    icon: '🏡',
    category: 'Real Estate',
    splineUrl: 'https://my.spline.design/interactivegeometricshapes-957fbb11ad5d11f8eec4c5409a633ba4/',
    splineCodeUrl: 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
    webflowUrl: 'https://fintrack-ai.vercel.app',
    description: '3D spatial architectural walkthrough & private property reservation concierge for high-net-worth buyers.',
    speedMetric: '⚡ 320ms Load',
    growthMetric: '📈 +70% VIP Leads',
    feeMetric: '💼 0% Broker Fee',
  },
  {
    id: 'cafe',
    slug: 'cafe',
    name: 'Specialty Café & Micro-Roastery',
    icon: '☕',
    category: 'Hospitality',
    splineUrl: 'https://my.spline.design/interactivegeometricshapes-957fbb11ad5d11f8eec4c5409a633ba4/',
    splineCodeUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
    webflowUrl: 'https://altura-kite-school.vercel.app/',
    description: 'Interactive 3D origin map & bean subscription store with instantaneous mobile WhatsApp checkout.',
    speedMetric: '⚡ 330ms Load',
    growthMetric: '📈 +38% Subscriptions',
    feeMetric: '💼 0% Platform Tax',
  },
  {
    id: 'tech',
    slug: 'tech',
    name: 'Fintech, Web3 & AI Startups',
    icon: '⚡',
    category: 'Technology',
    splineUrl: 'https://my.spline.design/interactivegeometricshapes-957fbb11ad5d11f8eec4c5409a633ba4/',
    splineCodeUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
    webflowUrl: 'https://cryptoax07.com/',
    description: 'Real-time cryptographic asset telemetry & predictive volatility nodes in 60fps WebGL canvas.',
    speedMetric: '⚡ 275ms Load',
    growthMetric: '📈 100K+ Runs',
    feeMetric: '💼 0% Middleman',
  },
];

export function getBenchmarkByQuery(rawQuery: string): IndustryBenchmark {
  const q = rawQuery.trim().toLowerCase();
  const match = INDUSTRY_BENCHMARKS.find(
    (b) =>
      b.id === q ||
      b.slug.toLowerCase() === q ||
      b.name.toLowerCase().includes(q) ||
      q.includes(b.id)
  );

  if (match) return match;

  // Dynamic fallback for any custom query entered by user
  const formattedName = q.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    id: q,
    slug: q,
    name: `${formattedName} Bespoke Experience`,
    icon: '✦',
    category: 'Custom Industry Spec',
    splineUrl: 'https://my.spline.design/interactivegeometricshapes-957fbb11ad5d11f8eec4c5409a633ba4/',
    splineCodeUrl: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
    webflowUrl: `https://${q.replace(/\s+/g, '')}.webflow.io`,
    description: `Custom 3D kinetic digital prototype built specifically for ${formattedName} with zero upfront risk.`,
    speedMetric: '⚡ < 300ms',
    growthMetric: '📈 +40% Inquiries',
    feeMetric: '💼 0% Intermediary',
  };
}
