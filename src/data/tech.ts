// The tools ax07 builds with, for the logo strip in "How it fits together". `slug` is the icon's name on
// Simple Icons (simpleicons.org, CC0); each logo belongs to its brand.
export const TECH: readonly { name: string; slug: string }[] = [
  { name: 'Next.js', slug: 'nextdotjs' },
  { name: 'React', slug: 'react' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Three.js', slug: 'threedotjs' },
  { name: 'Tailwind CSS', slug: 'tailwindcss' },
  { name: 'Vite', slug: 'vite' },
  { name: 'Firebase', slug: 'firebase' },
  { name: 'Node.js', slug: 'nodedotjs' },
  { name: 'Gemini AI', slug: 'googlegemini' },
  { name: 'WhatsApp', slug: 'whatsapp' },
];

// Where a site can be found: the search engines and AI answer engines it's built to be read by (the Proof banner)
// slug '' = no logo on Simple Icons (OpenAI's was removed at its request): the strip shows a plain mark instead
export const FOUND_ON: readonly { name: string; slug: string }[] = [
  { name: 'Google', slug: 'google' },
  { name: 'ChatGPT', slug: '' },
  { name: 'Gemini', slug: 'googlegemini' },
  { name: 'Perplexity', slug: 'perplexity' },
  { name: 'Claude', slug: 'claude' },
  { name: 'DuckDuckGo', slug: 'duckduckgo' },
  { name: 'Google Maps', slug: 'googlemaps' },
  { name: 'Lighthouse', slug: 'lighthouse' },
  { name: 'Search Console', slug: 'googlesearchconsole' },
];
