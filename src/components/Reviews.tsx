import React from 'react';
import { motion } from 'motion/react';
import { Star, MessageCircle, TrendingUp, CheckCircle, Quote, ArrowUpRight } from 'lucide-react';

interface Review {
  client: string;
  role: string;
  business: string;
  location: string;
  projectTag: string;
  quote: string;
  metric: string;
  metricLabel: string;
  verifiedBooking: boolean;
}

const reviews: Review[] = [
  {
    client: 'Rui Mendes',
    role: 'Founder & Head Instructor',
    business: 'FlyFoil Formosa',
    location: 'Faro / Ria Formosa, PT',
    projectTag: 'E-Foil & Wingfoil Watersports',
    quote:
      'FlyFoil Formosa got +40% direct WhatsApp bookings in month 1. The interactive 3D board visualizer lets clients inspect our hydrofoil gear before booking, which doubled our deposit closure rate on mobile without spending a single extra euro on ads.',
    metric: '+40%',
    metricLabel: 'Direct WhatsApp Bookings',
    verifiedBooking: true,
  },
  {
    client: 'Tiago Silva',
    role: 'Operations Director',
    business: 'Altura Kites',
    location: 'Altura Beach, Algarve',
    projectTag: 'Wind & Kitesurf Academy',
    quote:
      'We replaced our slow, outdated WordPress site with AX07’s 3D experience. During peak wind season, over 65 tourist rentals were secured directly through the 1-click WhatsApp funnel. The site loads in 0.6 seconds and looks like a €10,000 custom agency project.',
    metric: '65+',
    metricLabel: 'Tourist Rentals in Month 1',
    verifiedBooking: true,
  },
  {
    client: 'Elena Rossi',
    role: 'Managing Partner',
    business: 'La Kafeteria',
    location: 'Tavira Historic Center',
    projectTag: 'Boutique Specialty Café & Brunch',
    quote:
      'Our daily table reservations jumped 3x. Guests love previewing our brunch space in kinetic 3D right on their iPhones. Receiving a fully functional live staging link in 48 hours with zero upfront deposit made working with AX07 completely risk-free.',
    metric: '3x',
    metricLabel: 'Table Reservations',
    verifiedBooking: true,
  },
  {
    client: 'Kreshnik B.',
    role: 'Founder & Tour Operator',
    business: 'Albania Fácil',
    location: 'Tirana & Riviera',
    projectTag: 'Luxury Expeditions & Excursions',
    quote:
      'We stopped losing high-net-worth travelers to generic template sites. The smooth 3D route previews gave our brand instant international authority. Over €4,200 in private group expeditions were closed via WhatsApp within two weeks of launch.',
    metric: '€4.2k',
    metricLabel: 'First 14-Day Direct Sales',
    verifiedBooking: true,
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#070708] border-t border-white/5 relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <div className="text-micro mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>REAL-WORLD REVENUE & ROI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
              Results from Our 3D Builds.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 mt-2 max-w-xl font-sans">
              High-motion design engineered for one objective: converting local foot traffic and online visitors into immediate, paid reservations.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 bg-white/[0.02] border border-white/10 rounded-2xl p-4 self-start md:self-auto">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span>5.0 Average Rating across 18+ Active Staging Builds</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] via-white/[0.015] to-transparent p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300 group"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] group-hover:bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none transition-all" />

              <div>
                {/* Top Row: Business Name & Key ROI Metric Pill */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1">
                      {rev.projectTag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      {rev.business}
                    </h3>
                    <span className="text-xs text-zinc-500 font-mono">
                      {rev.location}
                    </span>
                  </div>

                  {/* Impact Metric Box */}
                  <div className="text-right shrink-0 rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-2">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 block leading-tight">
                      {rev.metric}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight">
                      {rev.metricLabel}
                    </span>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Body */}
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans">
                    {rev.client}
                  </h4>
                  <p className="text-xs text-zinc-500 font-mono">
                    {rev.role}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Client Build</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp Conversion Strip */}
        <div className="mt-12 p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Want similar conversion results for your brand?</h4>
              <p className="text-xs text-zinc-400">We engineer the 3D prototype for free in 48 hours before you spend anything.</p>
            </div>
          </div>

          <a
            href="https://wa.me/351912345678?text=Hello%20AX07,%20I%20saw%20your%20portfolio%20reviews%20and%20would%20like%20a%2048h%20spec%20build"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-400 text-black hover:bg-emerald-300 transition-colors text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Request WhatsApp Spec</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}

export default Reviews;
