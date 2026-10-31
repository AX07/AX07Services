export const WHATSAPP_NUMBER = '353894419127';

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi ax07, I'd like my free 48-hour website preview. My business is: ";

export const processSteps = [
  {
    step: '01',
    title: 'Tell us about your business',
    body: 'A 15-minute WhatsApp chat. Who your customers are, how they find you, what makes you different. That’s the brief.',
    meta: 'Day 0',
  },
  {
    step: '02',
    title: 'We build your preview',
    body: 'Real design, real copy, real code. Not a mock-up. You get a private link that works on your phone within 48 hours.',
    meta: 'Within 48h',
  },
  {
    step: '03',
    title: 'Approve it, and it’s live',
    body: 'We connect your domain, hosting and analytics. Then we keep it fast, secure and up to date while you run the business.',
    meta: 'Launch day',
  },
] as const;

export type ProjectCategory = 'tours' | 'hospitality' | 'in-house';

export const projects: readonly {
  id: string;
  category: ProjectCategory;
  description: string;
  shot: string;
  title: string;
  place: string;
  kind: string;
  stat: string;
  statLabel: string;
  quote: string;
  author: string;
  url: string;
}[] = [
  {
    id: 'flyfoil',
    category: 'tours',
    description:
      'E-foil rental site with a 3D board viewer, so riders can inspect the gear before they book, and one-tap WhatsApp booking straight to the owner.',
    shot: '/work/flyfoil',
    title: 'FlyFoil Formosa',
    place: 'Cabanas de Tavira',
    kind: 'E-foil rentals',
    stat: '+40%',
    statLabel: 'direct bookings in month one',
    quote: 'The 3D board visualiser lets clients inspect our gear before they book.',
    author: 'Nuno, founder',
    url: 'https://flyfoilformosa.com/',
  },
  {
    id: 'la-kafeteria',
    category: 'hospitality',
    description:
      'A warm, fast site for a coffee and breakfast spot: the menu, photos of the space and table reservations, all built for the phone in your hand.',
    shot: '/work/la-kafeteria',
    title: 'La Kafeteria',
    place: 'San Pedro',
    kind: 'Coffee & breakfast',
    stat: '3.2×',
    statLabel: 'daily table reservations',
    quote: 'Guests preview our brunch space right on their iPhones before they come in.',
    author: 'Elena Rossi, managing partner',
    url: 'https://la-kafeteria.vercel.app/',
  },
  {
    id: 'cryptoax07',
    category: 'in-house',
    description:
      'Our own crypto education brand. Clear explainers and a booking flow that turns readers into 1:1 coaching sessions.',
    shot: '/work/cryptoax07',
    title: 'CryptoAX07',
    place: 'In-house venture',
    kind: 'Crypto education',
    stat: '1:1',
    statLabel: 'coaching booked straight from the site',
    quote: '',
    author: '',
    url: 'https://cryptoax07.com/',
  },
  {
    id: 'altura',
    category: 'tours',
    description:
      'Booking site for a kitesurf school: lessons, rentals and downwinders reserved directly with the coaches, with no booking platform in the middle.',
    shot: '/work/altura',
    title: 'Altura Kites',
    place: 'Altura, Algarve',
    kind: 'Kitesurf school',
    stat: '65+',
    statLabel: 'rentals booked in peak season',
    quote: 'Loads in 0.6 seconds and looks like a €10,000 build.',
    author: 'Tiago Silva, operations',
    url: 'https://altura-kite-school.vercel.app/',
  },
  {
    id: 'albania',
    category: 'tours',
    description:
      'Tour operator site with 3D route previews and a WhatsApp booking concierge that connects travellers directly with local guides.',
    shot: '/work/albania',
    title: 'Albania Fácil',
    place: 'Tirana & Riviera',
    kind: 'Tour operator',
    stat: '€4.2K',
    statLabel: 'in sales in the first 14 days',
    quote: 'The 3D route previews gave our brand instant authority.',
    author: 'Kreshnik B., founder',
    url: 'https://albania-facil.vercel.app/',
  },
];

export const plans = [
  {
    id: 'own',
    name: 'Own it outright',
    price: '€1,270',
    cadence: 'one-time build',
    extra: '+ €47/month hosting, security & monitoring. Or take the code and host it yourself.',
    pitch: 'For businesses that want the code in their hands from day one.',
    features: [
      'Custom design and build, from a blank page',
      'Sub-second mobile performance guarantee',
      'One-tap WhatsApp booking and enquiry routing',
      'Cookie-free, GDPR-compliant analytics',
      'Full code handover: host it anywhere you like',
    ],
    cta: 'Choose one-time',
    message: "Hi ax07, I'm interested in the one-time build (€1,270 + €47/mo).",
    featured: false,
  },
  {
    id: 'partner',
    name: 'Partnership',
    price: '€174',
    cadence: 'per month',
    extra: '€0 upfront · 12 months and it’s yours. Cancel any time.',
    pitch: 'Everything included, nothing to pay before launch. We host it, run it and keep improving it.',
    features: [
      'Everything in the one-time build',
      'Unlimited content, price and menu updates',
      'Quarterly speed and conversion reviews',
      'Priority line to the developer who built it',
      'Hosting, security and global CDN included',
      'Own the code after 12 months (cancel earlier and we keep hosting it)',
    ],
    cta: 'Start with €0 upfront',
    message: "Hi ax07, I'd like to start the €174/month partnership with €0 upfront.",
    featured: true,
  },
] as const;

export const faqs = [
  {
    q: 'Is the preview really free?',
    a: 'Yes. We build a working version of your site in 48 hours at our own risk. If it isn’t right for you, you owe nothing and we delete it.',
  },
  {
    q: 'Do I own my website and domain?',
    a: 'Your domain is always yours. With the one-time build you get the code from day one and can host it yourself. With the partnership the site stays on our hosting; after 12 months the build is yours. You can cancel earlier at any time, but the build isn’t handed over.',
  },
  {
    q: 'I don’t have photos or copy. Is that a problem?',
    a: 'No. We write the copy with you on WhatsApp and source or shoot imagery that fits your brand. Most clients send us a few phone photos and a voice note.',
  },
  {
    q: 'How do bookings and enquiries work?',
    a: 'Every call to action routes straight to your WhatsApp or booking system with the customer’s details pre-filled. No forms that disappear into an inbox.',
  },
  {
    q: 'Can I change things after launch?',
    a: 'Partnership clients get unlimited updates: prices, menus, photos, opening hours. One-time clients can book changes whenever they need them.',
  },
] as const;
