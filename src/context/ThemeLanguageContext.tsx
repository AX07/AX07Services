import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'pt';
export type Theme = 'dark' | 'light';

export interface Translations {
  nav: {
    works: string;
    process: string;
    pricing: string;
    faq: string;
    about: string;
    claim48h: string;
    langToggle: string;
    themeDark: string;
    themeLight: string;
  };
  hero: {
    beat1: {
      eyebrow: string;
      titlePart1: string;
      titlePart2: string;
      subtitle: string;
      badge: string;
      primaryCta: string;
      secondaryCta: string;
      scrollHint: string;
    };
    beat2: {
      badge: string;
      title: string;
      desc: string;
      stat1Value: string;
      stat1Label: string;
      stat2Value: string;
      stat2Label: string;
    };
    beat3: {
      badge: string;
      title: string;
      desc: string;
      guarantee: string;
      cta: string;
    };
  };
  ticker: {
    heading: string;
    clientTag: string;
    ventureTag: string;
  };
  process: {
    tag: string;
    title: string;
    quote: string;
    scrollCycle: string;
    activeStep: string;
    scrollOrClick: string;
    steps: Array<{
      num: string;
      stepLabel: string;
      title: string;
      shortTitle: string;
      desc: string;
      badge: string;
      timeline: string;
      highlights: string[];
    }>;
  };
  portfolio: {
    snapScroll: string;
    expandHint: string;
    viewCaseReview: string;
    visitPage: string;
    verifiedResult: string;
    modalClose: string;
    projects: Array<{
      id: string;
      index: string;
      title: string;
      client: string;
      year: string;
      categories: string[];
      stat: string;
      statLabel: string;
      verifiedBadge: string;
      metadataLabel: string;
      link: string;
      review: {
        quote: string;
        author: string;
        role: string;
      };
    }>;
  };
  pricing: {
    tag: string;
    title: string;
    subtitle: string;
    signature: {
      badge: string;
      subBadge: string;
      title: string;
      desc: string;
      oneTime: string;
      approvalBadge: string;
      perMonth: string;
      subNote: string;
      features: string[];
      cta: string;
    };
    growth: {
      badge: string;
      subBadge: string;
      title: string;
      desc: string;
      oneTime: string;
      perMonth: string;
      features: string[];
      cta: string;
    };
    guarantees: {
      g1Title: string;
      g1Desc: string;
      g2Title: string;
      g2Desc: string;
      g3Title: string;
      g3Desc: string;
    };
    reassurance: {
      card1Title: string;
      card1Badge: string;
      card1Desc: string;
      card1Tag: string;
      card2Title: string;
      card2Badge: string;
      card2Desc: string;
      card2Cta: string;
      card3Title: string;
      card3Badge: string;
      card3Desc: string;
      card3Cta: string;
    };
  };
  faq: {
    tag: string;
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      num: string;
      tag: string;
      question: string;
      answer: string;
    }>;
    bottomCardTitle: string;
    bottomCardSubtitle: string;
    bottomCardCta: string;
  };
  cta: {
    badge: string;
    title: string;
    desc: string;
    placeholder: string;
    button: string;
    badges: {
      riskFree: string;
      staging48h: string;
      whatsApp: string;
    };
  };
  footer: {
    brandSub: string;
    location: string;
    edgeStatus: string;
  };
  dock: {
    aiTooltip: string;
    magicTooltip: string;
    aiTitle: string;
    magicTitle: string;
    aiDesc: string;
    magicDesc: string;
    aiPlaceholder: string;
    magicPlaceholder: string;
    execute: string;
    openSandbox: string;
  };
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      works: 'Works',
      process: 'Process',
      pricing: 'Pricing',
      faq: 'FAQ',
      about: 'About',
      claim48h: '48h Spec',
      langToggle: 'PT',
      themeDark: 'Dark Mode',
      themeLight: 'Light Mode',
    },
    hero: {
      beat1: {
        eyebrow: 'HIGH-MOTION 3D DIGITAL EXPERIENCES',
        titlePart1: 'We build custom 3D web experiences',
        titlePart2: 'that convert.',
        subtitle:
          'Interactive 3D visuals, sub-second edge performance, and direct 1-click WhatsApp booking systems crafted for business owners.',
        badge: 'ZERO DEPOSIT RISK · LIVE IN 48 HOURS',
        primaryCta: 'Claim Your 48h 3D Preview',
        secondaryCta: 'Explore Case Studies',
        scrollHint: 'Scroll down to see the difference',
      },
      beat2: {
        badge: 'THE CURRENT REALITY',
        title: 'A standard site is invisible.',
        desc:
          '90% of local businesses rely on generic templates, slow loads, and confusing forms. When high-value visitors and clients search on their phones, they bounce in 3 seconds.',
        stat1Value: '3.2s',
        stat1Label: 'Average local site load time',
        stat2Value: '68%',
        stat2Label: 'Lost bookings due to friction',
      },
      beat3: {
        badge: 'THE AX07 SPEC ENGINE',
        title: 'From first impression to instant WhatsApp booking.',
        desc:
          'We build a complete interactive 3D prototype for your business within 48 hours. You test it live on your own phone before spending a single euro.',
        guarantee: 'NO UPFRONT PAYMENT REQUIRED',
        cta: 'Request Private Staging Link',
      },
    },
    ticker: {
      heading: 'Brands & Technologies Powering Our High-Motion Builds',
      clientTag: 'Client Spec',
      ventureTag: 'In-House Venture',
    },
    process: {
      tag: 'THE 48-HOUR SPEC PROTOCOL',
      title: 'How It Works.',
      quote: 'We build your 3D website before you pay anything.',
      scrollCycle: 'Scroll to Cycle',
      activeStep: 'Active Step',
      scrollOrClick: 'Scroll or Click',
      steps: [
        {
          num: '01',
          stepLabel: 'Step 01 // The Build',
          title: 'We Build Before You Pay',
          shortTitle: '01 Build Spec',
          desc: 'We extract your brand assets, Google Business profile, and customer reviews to craft an interactive 3D WebGL website prototype tailored to your Algarve business.',
          badge: '48H Turnaround',
          timeline: 'Hours 0 – 48',
          highlights: [
            'Zero upfront deposit required',
            'Automated Google review scraping',
            'Custom WebGL 3D asset engineering',
          ],
        },
        {
          num: '02',
          stepLabel: 'Step 02 // The Test',
          title: 'The Test',
          shortTitle: '02 The Test',
          desc: 'You receive a private staging URL. Open it directly on your device, test the 1-click WhatsApp booking flow, and inspect the kinetic 3D visuals with zero pressure.',
          badge: 'Zero Risk Trial',
          timeline: 'Days 3 – 10',
          highlights: [
            'Private Vercel preview link',
            'Live 3D kinetic interaction test',
            '60 FPS smooth interactive experience',
          ],
        },
        {
          num: '03',
          stepLabel: 'Step 03 // Launch & Edge Ops',
          title: 'Launch If You Love It',
          shortTitle: '03 Launch Live',
          desc: 'Only pay €500 once approved. Then €20/month for ultra-fast Vercel edge global hosting, continuous SSL certificates, and on-demand content updates.',
          badge: 'Full Ownership',
          timeline: 'Day 10 & Beyond',
          highlights: [
            '1-click DNS domain attach',
            'Global Edge CDN & SSL included',
            '€20/mo flat maintenance',
          ],
        },
      ],
    },
    portfolio: {
      snapScroll: 'SNAP SCROLL',
      expandHint: 'Click anywhere to expand client review & verified outcome',
      viewCaseReview: 'View Case Review',
      visitPage: 'VISIT PAGE',
      verifiedResult: 'VERIFIED RESULT',
      modalClose: 'Close modal',
      projects: [
        {
          id: 'flyfoil',
          index: '01 / 05',
          title: 'FlyFoil Formosa',
          client: 'FlyFoil Formosa',
          year: '2025',
          categories: ['WEBGL & 3D', 'AUTOMATION'],
          stat: '+40%',
          statLabel: 'Direct Bookings',
          verifiedBadge: 'VERIFIED RESULT: +40% Direct Bookings',
          metadataLabel: 'Cabanas de Tavira, Portugal · High-Motion E-Foil Spec',
          link: 'https://ax07services.com/preview/flyfoil',
          review: {
            quote:
              'Direct WhatsApp bookings increased by +40% in our first month. The 3D board visualizer lets clients inspect our hydrofoil gear before booking.',
            author: 'Nuno',
            role: 'Altura Kites / FlyFoil Formosa',
          },
        },
        {
          id: 'altura',
          index: '02 / 05',
          title: 'Altura Kites',
          client: 'Altura Kites',
          year: '2025',
          categories: ['WEBGL & 3D', 'AUTOMATION'],
          stat: '65+',
          statLabel: 'Tourist Rentals',
          verifiedBadge: 'VERIFIED RESULT: 65+ Direct Tourist Bookings',
          metadataLabel: 'Altura Beach, Algarve · 0.6s Edge Load & Live Wind API',
          link: 'https://ax07services.com/preview/altura',
          review: {
            quote:
              'During peak wind season, over 65 tourist rentals were secured directly through the 1-click WhatsApp funnel. Loads in 0.6s and looks like a €10,000 build.',
            author: 'Tiago Silva',
            role: 'Operations Director — Altura Kites',
          },
        },
        {
          id: 'la-kafeteria',
          index: '03 / 05',
          title: 'La Kafeteria',
          client: 'La Kafeteria',
          year: '2025',
          categories: ['BRANDING', 'WEBGL & 3D'],
          stat: '3.2x',
          statLabel: 'Direct Bookings',
          verifiedBadge: 'VERIFIED RESULT: 3.2x Direct Bookings',
          metadataLabel: 'Tavira Historic Center · Kinetic Table Atmosphere',
          link: 'https://ax07services.com/preview/lakafeteria',
          review: {
            quote:
              'Our daily table reservations jumped 3.2x. Guests love previewing our brunch space in kinetic 3D right on their iPhones. Zero deposit risk.',
            author: 'Elena Rossi',
            role: 'Managing Partner — La Kafeteria',
          },
        },
        {
          id: 'albania',
          index: '04 / 05',
          title: 'Albania Fácil',
          client: 'Albania Fácil',
          year: '2026',
          categories: ['AUTOMATION', 'WEBGL & 3D'],
          stat: '€4.2K',
          statLabel: 'Direct Sales',
          verifiedBadge: 'VERIFIED RESULT: €4.2K First 14-Day Sales',
          metadataLabel: 'Tirana & Riviera · 3D Topographical Expedition Explorer',
          link: 'https://ax07services.com/preview/albania',
          review: {
            quote:
              'Over €4,200 in private group expeditions were closed via WhatsApp within two weeks of launch. The smooth 3D route previews gave our brand instant authority.',
            author: 'Kreshnik B.',
            role: 'Founder & Tour Operator — Albania Fácil',
          },
        },
        {
          id: 'cryptoax07',
          index: '05 / 05',
          title: 'CryptoAX07',
          client: 'AX07 Labs · In-House Venture',
          year: '2026',
          categories: ['AUTOMATION', 'WEBGL & 3D'],
          stat: '100K+',
          statLabel: 'Simulations Run',
          verifiedBadge: 'VERIFIED RESULT: 100K+ Edge Stress-Test Simulations',
          metadataLabel: 'AX07 Labs Core · Real-Time Kinetic Market Topologies',
          link: 'https://ax07services.com/preview/cryptoax07',
          review: {
            quote:
              'Proprietary in-house algorithmic engine with kinetic WebGL 3D asset topologies and sub-second edge telemetry. 100K+ live simulation cycles stress-tested.',
            author: 'AX07 Core Labs',
            role: 'In-House Venture & Simulation Model',
          },
        },
      ],
    },
    pricing: {
      tag: 'TRANSPARENT VALUE ENGINE',
      title: 'Clear, Risk-Free Pricing.',
      subtitle:
        'Zero upfront cost. You only pay after you hold the working 3D site on your phone and decide to launch.',
      signature: {
        badge: 'SIGNATURE SPEC // 48-HOUR LAUNCH',
        subBadge: 'Most Popular for Algarve Businesses',
        title: 'High-Motion 3D Web Spec',
        desc: 'Complete bespoke 3D WebGL website tailored to your business, optimized for instant mobile booking conversions.',
        oneTime: 'One-time build fee (paid AFTER approval)',
        approvalBadge: 'Zero Upfront Deposit',
        perMonth: '/ month',
        subNote: 'Includes high-speed Vercel edge hosting & updates',
        features: [
          'Custom Interactive 3D WebGL Logo & Product Asset',
          'High-Converting Direct WhatsApp 1-Click Booking Funnel',
          'Automated Google Business & Review Social Proof Integration',
          'Sub-second Edge Deployment on Global CDN (<0.8s load)',
          'Zero-Deprecation Mobile First Optimization (iPhone & Android)',
          'Free Custom Domain Connection & SSL Security Certificates',
          'Ongoing Monthly Content & Menu Photo Updates Included',
        ],
        cta: 'Claim Your 48h Spec on WhatsApp',
      },
      growth: {
        badge: 'GROWTH SYSTEM // MULTI-CHANNEL',
        subBadge: 'High-Volume Operations',
        title: 'Multi-Service & AI Booking Suite',
        desc: 'For rental fleets, boutique hotels, or multi-location venues needing custom automation and multi-language funnels.',
        oneTime: 'One-time build fee',
        perMonth: '+ €45/mo priority edge ops',
        features: [
          'Multiple 3D Interactive Asset Viewers (e.g. board models, villas)',
          'Bilingual (EN / PT / ES / FR) Conversion Routing',
          'Automated WhatsApp Calendar & Reservation Dispatcher',
          'Custom Video Reels & Dynamic Hero Motion Shaders',
          'Dedicated Priority Support SLA (< 2 Hour Turnaround)',
        ],
        cta: 'Inquire Growth Automation',
      },
      guarantees: {
        g1Title: 'Zero-Deposit Guarantee',
        g1Desc: 'We invest our own design & coding hours first. If you do not love the staging link, you walk away paying €0.',
        g2Title: '48-Hour Live Delivery',
        g2Desc: 'From sending your brand details to having a private staging link on your phone in under 48 hours.',
        g3Title: '100% Asset Ownership',
        g3Desc: 'You retain complete ownership of your domain, content, and code. No platform lock-in or surprise fees.',
      },
      reassurance: {
        card1Title: 'Zero-Deposit Guarantee',
        card1Badge: '100% Risk-Free Build',
        card1Desc: 'We invest our own design & coding hours upfront. If you do not love the 3D staging link on your phone, you walk away paying €0.',
        card1Tag: 'No Credit Card Needed',
        card2Title: '48-Hour Live Delivery',
        card2Badge: 'Rapid Mobile Staging',
        card2Desc: 'From sending your brand details to having a private staging link on your phone in under 48 hours.',
        card2Cta: 'View Live Case Studies',
        card3Title: 'Direct WhatsApp Chat',
        card3Badge: 'Speak to Lead Engineer',
        card3Desc: 'No sales reps or bot delays. Message our lead creative engineer directly to claim your 48h spec slot.',
        card3Cta: 'Message on WhatsApp',
      },
    },
    faq: {
      tag: 'CLARITY & ASSURANCE',
      title: 'Frequently Asked Questions.',
      subtitle:
        'Everything you need to know about our 48-hour 3D spec build, ownership rights, and the €500 + €20/month model.',
      items: [
        {
          id: 'faq-1',
          num: '01',
          tag: 'Ownership & Freedom',
          question: 'Do I own the website and my domain?',
          answer:
            'Yes, 100%. You retain full ownership of your domain, content, and brand assets. If you ever decide to move hosting elsewhere, we hand over all source code files with zero lock-in contracts or penalties.',
        },
        {
          id: 'faq-2',
          num: '02',
          tag: 'Maintenance & Edge Ops',
          question: 'What is included in the €20/month fee?',
          answer:
            'Our monthly subscription covers high-speed Vercel global edge hosting, automatic SSL security certificates, 24/7 uptime monitoring, and ongoing content updates (such as updating seasonal prices, swapping menu items, or adding new photos whenever you need).',
        },
        {
          id: 'faq-3',
          num: '03',
          tag: 'Zero-Effort Onboarding',
          question: "What if I don't have photos, videos, or written content ready?",
          answer:
            'You don’t need to write anything. We scrape your existing Google Business Profile, Instagram, and top reviews to generate high-converting copy and visual layouts automatically. You just review and test the live preview link on your phone.',
        },
        {
          id: 'faq-4',
          num: '04',
          tag: 'Direct Conversion',
          question: 'How do WhatsApp bookings work?',
          answer:
            'Instead of complex, clunky email contact forms that get lost in spam folders, we embed a high-converting 1-click WhatsApp CTA. When a customer taps it on their phone, it opens a pre-filled reservation inquiry directly in your WhatsApp chat so you can confirm bookings and take deposits instantly.',
        },
        {
          id: 'faq-5',
          num: '05',
          tag: 'Fast Turnaround',
          question: 'How long does it take from start to launch?',
          answer:
            'You receive your private live staging preview link within 48 hours of contacting us. Once you approve the build and connect your domain, your website goes live in less than 24 hours.',
        },
      ],
      bottomCardTitle: 'Have a specific question about your site?',
      bottomCardSubtitle: 'Ask our lead developer directly on WhatsApp—no sales reps or bot delays.',
      bottomCardCta: 'Chat on WhatsApp',
    },
    cta: {
      badge: 'ZERO RISK · ZERO DEPOSIT · 48H DELIVERY',
      title: 'Ready to see your business in 3D?',
      desc:
        'Send us your current site or Google Maps profile. We’ll build and host a private, interactive 3D staging preview within 48 hours. If you don’t love it, you pay nothing.',
      placeholder: 'Your business name or website URL...',
      button: 'Claim 48h Preview',
      badges: {
        riskFree: '100% Risk-Free Staging',
        staging48h: '48h Direct Staging Link',
        whatsApp: 'Direct WhatsApp Chat',
      },
    },
    footer: {
      brandSub: 'High-Motion Spec Studio',
      location: 'Tavira & Algarve, PT',
      edgeStatus: 'Vercel Edge Active',
    },
    dock: {
      aiTooltip: 'AI Inspiration Search',
      magicTooltip: 'Vercel Staging Previewer',
      aiTitle: 'AI Inspiration Search',
      magicTitle: 'Client Magic Link Generator',
      aiDesc: 'Input a business niche or competitor to pull high-converting motion benchmarks.',
      magicDesc: 'Input Vercel URL to generate a live ax07services.com/preview staging iframe.',
      aiPlaceholder: "e.g., 'Luxury Kitesurf School'...",
      magicPlaceholder: 'https://project-id.vercel.app',
      execute: 'Execute',
      openSandbox: 'Open Staging Sandbox',
    },
  },
  pt: {
    nav: {
      works: 'Projetos',
      process: 'Processo',
      pricing: 'Preços',
      faq: 'Perguntas',
      about: 'Sobre',
      claim48h: 'Amostra 48h',
      langToggle: 'EN',
      themeDark: 'Modo Escuro',
      themeLight: 'Modo Claro',
    },
    hero: {
      beat1: {
        eyebrow: 'EXPERIÊNCIAS DIGITAIS 3D DE ALTO IMPACTO',
        titlePart1: 'Criamos experiências web 3D sob medida',
        titlePart2: 'que convertem.',
        subtitle:
          'Visuais 3D interativos, performance edge abaixo de um segundo e sistemas de reserva direta por WhatsApp criados para donos de negócios.',
        badge: 'RISCO ZERO · DISPONÍVEL EM 48 HORAS',
        primaryCta: 'Pedir Amostra 3D em 48h',
        secondaryCta: 'Explorar Projetos',
        scrollHint: 'Deslize para ver a diferença',
      },
      beat2: {
        badge: 'A REALIDADE ATUAL',
        title: 'Um site comum é invisível.',
        desc:
          '90% dos negócios locais usam modelos genéricos, páginas lentas e formulários confusos. Quando visitantes e clientes pesquisam no telemóvel, abandonam em 3 segundos.',
        stat1Value: '3.2s',
        stat1Label: 'Tempo médio de carregamento local',
        stat2Value: '68%',
        stat2Label: 'Reservas perdidas por atrito',
      },
      beat3: {
        badge: 'O MOTOR DE ESPECIFICAÇÃO AX07',
        title: 'Do primeiro impacto à reserva direta no WhatsApp.',
        desc:
          'Construímos um protótipo 3D interativo completo para o seu negócio em 48 horas. Testa-o no seu próprio telemóvel antes de pagar um único cêntimo.',
        guarantee: 'SEM QUALQUER PAGAMENTO ADIANTADO',
        cta: 'Solicitar Link de Teste Privado',
      },
    },
    ticker: {
      heading: 'Marcas e Tecnologias que Impulsionam os Nossos Projetos 3D',
      clientTag: 'Projeto Cliente',
      ventureTag: 'Empreendimento Interno',
    },
    process: {
      tag: 'O PROTOCOLO DE 48 HORAS',
      title: 'Como Funciona.',
      quote: 'Criamos o seu site 3D antes de pagar qualquer valor.',
      scrollCycle: 'Deslize para Navegar',
      activeStep: 'Passo Ativo',
      scrollOrClick: 'Deslize ou Clique',
      steps: [
        {
          num: '01',
          stepLabel: 'Passo 01 // Criação',
          title: 'Criamos Antes de Pagar',
          shortTitle: '01 Criar Amostra',
          desc: 'Recolhemos os elementos da sua marca, perfil do Google Maps e avaliações de clientes para criar um protótipo web 3D interativo feito sob medida para o seu negócio no Algarve.',
          badge: 'Entrega em 48h',
          timeline: 'Horas 0 – 48',
          highlights: [
            'Sem qualquer depósito adiantado',
            'Recolha automática de avaliações do Google',
            'Modelagem e shader 3D WebGL personalizado',
          ],
        },
        {
          num: '02',
          stepLabel: 'Passo 02 // O Teste',
          title: 'O Teste',
          shortTitle: '02 O Teste',
          desc: 'Recebe um link de teste privado. Abra diretamente no seu dispositivo, teste o fluxo de reservas em 1 clique por WhatsApp e veja a fluidez dos gráficos 3D sem qualquer pressão.',
          badge: 'Teste Sem Risco',
          timeline: 'Dias 3 – 10',
          highlights: [
            'Link privado na Vercel',
            'Teste de interação cinética 3D ao vivo',
            'Experiência interativa fluida a 60 FPS',
          ],
        },
        {
          num: '03',
          stepLabel: 'Passo 03 // Lançamento e Edge',
          title: 'Lance Apenas Se Adorar',
          shortTitle: '03 Lançar Online',
          desc: 'Pague €500 apenas após aprovar. Depois, €20/mês para alojamento edge global de alta velocidade na Vercel, certificados SSL automáticos e suporte contínuo.',
          badge: 'Posse Total',
          timeline: 'Dia 10 em Diante',
          highlights: [
            'Conexão do seu domínio em 1 clique',
            'CDN Edge global e SSL incluídos',
            'Manutenção fixa de €20/mês',
          ],
        },
      ],
    },
    portfolio: {
      snapScroll: 'DESLIZE',
      expandHint: 'Clique em qualquer lugar para ver a avaliação e resultado comprovado',
      viewCaseReview: 'Ver Análise de Caso',
      visitPage: 'VISITAR PÁGINA',
      verifiedResult: 'RESULTADO COMPROVADO',
      modalClose: 'Fechar modal',
      projects: [
        {
          id: 'flyfoil',
          index: '01 / 05',
          title: 'FlyFoil Formosa',
          client: 'FlyFoil Formosa',
          year: '2025',
          categories: ['WEBGL & 3D', 'AUTOMAÇÃO'],
          stat: '+40%',
          statLabel: 'Reservas Diretas',
          verifiedBadge: 'RESULTADO COMPROVADO: +40% Reservas Diretas',
          metadataLabel: 'Cabanas de Tavira, Portugal · Especificação E-Foil 3D',
          link: 'https://ax07services.com/preview/flyfoil',
          review: {
            quote:
              'As reservas diretas por WhatsApp aumentaram +40% logo no primeiro mês. O visualizador 3D permite que os clientes inspecionem as pranchas antes de reservar.',
            author: 'Nuno',
            role: 'Altura Kites / FlyFoil Formosa',
          },
        },
        {
          id: 'altura',
          index: '02 / 05',
          title: 'Altura Kites',
          client: 'Altura Kites',
          year: '2025',
          categories: ['WEBGL & 3D', 'AUTOMAÇÃO'],
          stat: '65+',
          statLabel: 'Alugueres a Turistas',
          verifiedBadge: 'RESULTADO COMPROVADO: 65+ Alugueres Diretos',
          metadataLabel: 'Praia de Altura, Algarve · Carregamento em 0,6s & API de Vento',
          link: 'https://ax07services.com/preview/altura',
          review: {
            quote:
              'Durante o pico de vento, mais de 65 alugueres de turistas foram fechados diretamente pelo WhatsApp. Abre em 0,6s e parece um projeto de €10.000.',
            author: 'Tiago Silva',
            role: 'Diretor de Operações — Altura Kites',
          },
        },
        {
          id: 'la-kafeteria',
          index: '03 / 05',
          title: 'La Kafeteria',
          client: 'La Kafeteria',
          year: '2025',
          categories: ['BRANDING', 'WEBGL & 3D'],
          stat: '3.2x',
          statLabel: 'Reservas de Mesas',
          verifiedBadge: 'RESULTADO COMPROVADO: 3.2x Reservas Diretas',
          metadataLabel: 'Centro Histórico de Tavira · Atmosfera 3D de Brunch',
          link: 'https://ax07services.com/preview/lakafeteria',
          review: {
            quote:
              'As nossas reservas diárias saltaram 3,2x. Os clientes adoram explorar o espaço em 3D interativo logo no telemóvel antes de nos visitar.',
            author: 'Elena Rossi',
            role: 'Sócia-Gerente — La Kafeteria',
          },
        },
        {
          id: 'albania',
          index: '04 / 05',
          title: 'Albania Fácil',
          client: 'Albania Fácil',
          year: '2026',
          categories: ['AUTOMAÇÃO', 'WEBGL & 3D'],
          stat: '€4.2K',
          statLabel: 'Vendas Diretas',
          verifiedBadge: 'RESULTADO COMPROVADO: €4.2K nas Primeiras 2 Semanas',
          metadataLabel: 'Tirana & Riviera · Explorador Topográfico 3D',
          link: 'https://ax07services.com/preview/albania',
          review: {
            quote:
              'Fechámos mais de €4.200 em expedições privadas pelo WhatsApp em apenas 14 dias. A apresentação 3D das rotas transmitiu confiança imediata.',
            author: 'Kreshnik B.',
            role: 'Fundador & Operador Turístico — Albania Fácil',
          },
        },
        {
          id: 'cryptoax07',
          index: '05 / 05',
          title: 'CryptoAX07',
          client: 'AX07 Labs · Projeto Interno',
          year: '2026',
          categories: ['AUTOMAÇÃO', 'WEBGL & 3D'],
          stat: '100K+',
          statLabel: 'Simulações',
          verifiedBadge: 'RESULTADO COMPROVADO: 100K+ Simulações Edge',
          metadataLabel: 'AX07 Labs Core · Topologias Cinéticas de Mercado em Tempo Real',
          link: 'https://ax07services.com/preview/cryptoax07',
          review: {
            quote:
              'Motor algorítmico interno com topologias cinéticas WebGL 3D e telemetria edge em milissegundos. Mais de 100.000 ciclos de simulação stress-testados.',
            author: 'AX07 Core Labs',
            role: 'Empreendimento Interno & Modelo de Simulação',
          },
        },
      ],
    },
    pricing: {
      tag: 'VALOR TRANSPARENTE E SEM RISCO',
      title: 'Preço Claro e Sem Risco.',
      subtitle:
        'Custo zero inicial. Só paga depois de ver o site 3D a funcionar no seu próprio telemóvel e decidir avançar.',
      signature: {
        badge: 'AMOSTRA DE ASSINATURA // LANÇAMENTO EM 48H',
        subBadge: 'O Mais Procurado por Negócios no Algarve',
        title: 'Website 3D de Alto Impacto',
        desc: 'Website completo sob medida em WebGL 3D para o seu negócio, focado em conversões diretas por telemóvel.',
        oneTime: 'Taxa única de criação (paga APÓS aprovação)',
        approvalBadge: 'Sem Depósito Adiantado',
        perMonth: '/ mês',
        subNote: 'Inclui alojamento global ultrarrápido na Vercel e atualizações',
        features: [
          'Logo e Ativo 3D Interativo WebGL Personalizado',
          'Funil de Conversão Direta em 1 Clique para WhatsApp',
          'Integração com Perfil do Google Maps e Avaliações Reais',
          'Alojamento Global na Rede Edge da Vercel (<0.8s de carregamento)',
          'Otimização Total Mobile-First para iPhone e Android',
          'Ligação Gratuita de Domínio Próprio e Certificados SSL',
          'Atualizações Mensais Contínuas de Menus, Fotos e Textos',
        ],
        cta: 'Pedir Amostra 48h pelo WhatsApp',
      },
      growth: {
        badge: 'SISTEMA GROWTH // MULTICANAL',
        subBadge: 'Operações de Grande Volume',
        title: 'Suíte Multi-Serviços e Automação IA',
        desc: 'Para frotas de aluguer, hotéis boutique ou espaços multilocais que precisam de automações e funis multilíngues.',
        oneTime: 'Taxa única de desenvolvimento',
        perMonth: '+ €45/mês suporte prioritário edge',
        features: [
          'Múltiplos visualizadores 3D interativos (ex: modelos de pranchas, vilas)',
          'Encaminhamento multilíngue (EN / PT / ES / FR)',
          'Despacho automatizado de reservas no WhatsApp com calendário',
          'Vídeos em alta definição e shaders dinâmicos de fundo',
          'SLA de suporte prioritário dedicado (< 2 Horas de resposta)',
        ],
        cta: 'Consultar Automação Growth',
      },
      guarantees: {
        g1Title: 'Garantia de Depósito Zero',
        g1Desc: 'Investimos o nosso tempo de design e código primeiro. Se não adorar a amostra, encerramos com custo €0.',
        g2Title: 'Entrega Real em 48 Horas',
        g2Desc: 'Do envio dos dados da sua empresa até ter o link de teste privado a funcionar no seu telemóvel em 48 horas.',
        g3Title: 'Posse Total a 100%',
        g3Desc: 'Mantém a posse integral do domínio, conteúdos e código. Sem contratos de fidelização nem taxas escondidas.',
      },
      reassurance: {
        card1Title: 'Garantia de Depósito Zero',
        card1Badge: 'Criação 100% Sem Risco',
        card1Desc: 'Investimos o nosso tempo de design e código primeiro. Se não adorar a amostra no telemóvel, encerramos com custo €0.',
        card1Tag: 'Sem Cartão de Crédito',
        card2Title: 'Entrega Real em 48 Horas',
        card2Badge: 'Amostra Rápida no Telemóvel',
        card2Desc: 'Do envio dos dados da sua empresa até ter o link de teste privado a funcionar no seu telemóvel em 48 horas.',
        card2Cta: 'Ver Casos de Sucesso',
        card3Title: 'Chat Direto por WhatsApp',
        card3Badge: 'Fale com o Desenvolvedor',
        card3Desc: 'Sem comerciais nem chatbots. Envie mensagem diretamente ao engenheiro criativo para reservar a sua amostra.',
        card3Cta: 'Conversar no WhatsApp',
      },
    },
    faq: {
      tag: 'CLAREZA E CONFIANÇA',
      title: 'Perguntas Frequentes.',
      subtitle:
        'Tudo o que precisa de saber sobre a amostra 3D em 48 horas, direitos de autor e o modelo de €500 + €20/mês.',
      items: [
        {
          id: 'faq-1',
          num: '01',
          tag: 'Posse & Liberdade',
          question: 'O site e o domínio pertencem-me a 100%?',
          answer:
            'Sim, 100%. Mantém a posse total do seu domínio, conteúdos e elementos da marca. Se um dia desejar mudar de alojamento, entregamos todos os ficheiros de código sem contratos de fidelização nem penalizações.',
        },
        {
          id: 'faq-2',
          num: '02',
          tag: 'Manutenção & Edge',
          question: 'O que está incluído na mensalidade de €20/mês?',
          answer:
            'A nossa subscrição mensal cobre alojamento global de alta velocidade na Vercel Edge, certificados SSL automáticos, monitorização 24/7 e alterações de conteúdos (como atualizar preços de época, trocar itens do menu ou adicionar novas fotografias).',
        },
        {
          id: 'faq-3',
          num: '03',
          tag: 'Sem Esforço',
          question: 'E se eu não tiver fotos profissionais ou textos prontos?',
          answer:
            'Não precisa de escrever nada. Recolhemos o conteúdo do seu Perfil Google Maps atual, Instagram e melhores avaliações para criar textos apelativos e layouts visuais automaticamente. Apenas testa a amostra no seu telemóvel.',
        },
        {
          id: 'faq-4',
          num: '04',
          tag: 'Conversão Direta',
          question: 'Como funcionam as reservas pelo WhatsApp?',
          answer:
            'Em vez de formulários de contacto lentos que vão parar ao spam, colocamos um botão de WhatsApp em 1 clique de alta conversão. Quando o cliente toca no telemóvel, abre uma mensagem pré-preenchida no seu chat para confirmar reservas e receber sinais na hora.',
        },
        {
          id: 'faq-5',
          num: '05',
          tag: 'Rapidez de Entrega',
          question: 'Quanto tempo demora desde o pedido até estar online?',
          answer:
            'Recebe o seu link de teste privado em menos de 48 horas após entrar em contacto. Assim que aprovar e ligarmos o seu domínio, o seu novo website fica online em menos de 24 horas.',
        },
      ],
      bottomCardTitle: 'Tem uma dúvida específica sobre o seu negócio?',
      bottomCardSubtitle: 'Fale diretamente com o nosso desenvolvedor principal no WhatsApp—sem intermediários nem chatbots.',
      bottomCardCta: 'Conversar no WhatsApp',
    },
    cta: {
      badge: 'RISCO ZERO · SEM ENTRADA · ENTREGA EM 48H',
      title: 'Pronto para ver o seu negócio em 3D?',
      desc:
        'Envie-nos o seu site atual ou perfil do Google Maps. Criamos e alojamos um protótipo 3D interativo privado em 48 horas. Se não adorar, não paga nada.',
      placeholder: 'Nome do seu negócio ou link do website...',
      button: 'Pedir Amostra 48h',
      badges: {
        riskFree: 'Teste 100% Sem Risco',
        staging48h: 'Link de Teste em 48h',
        whatsApp: 'Chat Direto por WhatsApp',
      },
    },
    footer: {
      brandSub: 'Estúdio de Amostras 3D de Alto Impacto',
      location: 'Tavira & Algarve, PT',
      edgeStatus: 'Vercel Edge Ativo',
    },
    dock: {
      aiTooltip: 'Pesquisa de Inspiração IA',
      magicTooltip: 'Visualizador de Demonstrações Vercel',
      aiTitle: 'Pesquisa de Inspiração IA',
      magicTitle: 'Gerador de Links de Demonstração',
      aiDesc: 'Indique um setor de negócio ou concorrente para encontrar referências visuais de alta conversão.',
      magicDesc: 'Insira o URL da Vercel para gerar uma janela de teste no ax07services.com/preview.',
      aiPlaceholder: 'ex: "Escola de Kitesurf de Luxo"...',
      magicPlaceholder: 'https://projeto-id.vercel.app',
      execute: 'Executar',
      openSandbox: 'Abrir Demonstração',
    },
  },
};

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: Translations;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export interface AppProviderProps {
  children: React.ReactNode;
  initialLang?: Language;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, initialLang }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (initialLang) return initialLang;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ax07_lang') as Language;
      if (saved === 'en' || saved === 'pt') return saved;
      if (navigator.language.startsWith('pt')) return 'pt';
    }
    return 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const initialized = localStorage.getItem('ax07_theme_init_v2');
      if (initialized === 'true') {
        const saved = localStorage.getItem('ax07_theme') as Theme;
        if (saved === 'dark' || saved === 'light') return saved;
      } else {
        localStorage.setItem('ax07_theme_init_v2', 'true');
        localStorage.setItem('ax07_theme', 'light');
        return 'light';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('ax07_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('ax07_theme', theme);
    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'en' ? 'pt' : 'en'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        theme,
        setTheme,
        toggleTheme,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
