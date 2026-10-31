/**
 * Three complete, believable industry websites, rendered at real size inside the showcase frame.
 * `m` switches each to its phone layout (390px wide) so mobile visitors see a real mobile site.
 */

const Star = () => <span aria-hidden="true">★</span>;

/* ------------------------------------------------------------------ Dental */
export function DentalSite({ m }: { m: boolean }) {
  const ink = '#0f2a2a';
  const mint = '#2b8a7e';
  return (
    <div style={{ background: '#f6f9f8', color: ink }} className="font-sans">
      <nav className={`flex items-center justify-between ${m ? 'px-5 py-4' : 'px-16 py-6'}`}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ background: mint }}>
            ◡
          </span>
          <span className="text-[19px] font-semibold tracking-tight">Lumen Dental</span>
        </div>
        {!m && (
          <div className="flex items-center gap-9 text-[15px] opacity-75">
            <span>Treatments</span>
            <span>Fees</span>
            <span>Our team</span>
            <span>Nervous patients</span>
          </div>
        )}
        <span className="rounded-full px-5 py-2.5 text-[14px] font-medium text-white" style={{ background: mint }}>
          Book online
        </span>
      </nav>

      <section className={`grid items-center gap-10 ${m ? 'grid-cols-1 px-5 pt-4' : 'grid-cols-2 px-16 pt-10'}`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] shadow-sm">
            <span style={{ color: '#f5a524' }}>
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </span>
            4.9 from 380 Google reviews
          </span>
          <h1 className={`mt-5 font-semibold leading-[1.02] tracking-tight ${m ? 'text-[40px]' : 'text-[64px]'}`}>
            Calm, modern dentistry. Booked in 60 seconds.
          </h1>
          <p className={`mt-5 leading-relaxed opacity-70 ${m ? 'text-[16px]' : 'text-[19px]'}`}>
            Same-week appointments in Ranelagh, Dublin 6. Clear prices, no surprises, and a team that is genuinely gentle.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="rounded-full px-6 py-3.5 text-[15px] font-medium text-white" style={{ background: mint }}>
              Book a check-up · €75
            </span>
            <span className="rounded-full border px-6 py-3.5 text-[15px]" style={{ borderColor: '#cfe1dd' }}>
              Nervous? Start here
            </span>
          </div>
        </div>
        <div className="relative">
          <img src="/showcase/dental-hero.webp" alt="" className={`w-full rounded-[28px] object-cover ${m ? 'h-[260px]' : 'h-[460px]'}`} />
          <div className="absolute -bottom-5 left-6 rounded-2xl bg-white px-5 py-4 shadow-xl">
            <div className="text-[12px] opacity-60">Next free appointment</div>
            <div className="text-[18px] font-semibold">Today, 15:40</div>
          </div>
        </div>
      </section>

      <section className={m ? 'px-5 pt-20' : 'px-16 pt-28'}>
        <h2 className={`font-semibold tracking-tight ${m ? 'text-[28px]' : 'text-[40px]'}`}>Treatments, priced upfront</h2>
        <div className={`mt-8 grid gap-4 ${m ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {[
            ['Check-up & clean', 'From €75', '45 min · includes X-rays'],
            ['Invisalign', 'From €2,900', 'Free 3D smile scan'],
            ['Whitening', '€350', 'Results in one visit'],
          ].map(([t, p, d]) => (
            <div key={t} className="rounded-3xl bg-white p-7 shadow-sm">
              <div className="h-10 w-10 rounded-2xl" style={{ background: '#dbe9e6' }} />
              <div className="mt-5 text-[20px] font-semibold">{t}</div>
              <div className="mt-1 text-[15px] font-medium" style={{ color: mint }}>
                {p}
              </div>
              <div className="mt-2 text-[14px] opacity-60">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={`grid items-center gap-10 ${m ? 'grid-cols-1 px-5 pt-20' : 'grid-cols-2 px-16 pt-28'}`}>
        <img src="/showcase/dental-xray.webp" alt="" className={`w-full rounded-[28px] object-cover ${m ? 'h-[220px]' : 'h-[380px]'}`} />
        <div>
          <h2 className={`font-semibold tracking-tight ${m ? 'text-[28px]' : 'text-[40px]'}`}>In pain? We’ll see you today.</h2>
          <p className="mt-4 text-[17px] leading-relaxed opacity-70">
            Same-day emergency slots every morning. Message us on WhatsApp with a photo and we’ll tell you what to do next.
          </p>
          <span className="mt-6 inline-block rounded-full bg-[#25d366] px-6 py-3.5 text-[15px] font-medium text-white">
            WhatsApp the clinic
          </span>
        </div>
      </section>

      <section className={m ? 'px-5 py-20' : 'px-16 py-28'}>
        <div className="rounded-[32px] px-10 py-14 text-center text-white" style={{ background: mint }}>
          <h2 className={`font-semibold tracking-tight ${m ? 'text-[28px]' : 'text-[44px]'}`}>Your smile, on your schedule.</h2>
          <span className="mt-7 inline-block rounded-full bg-white px-7 py-3.5 text-[15px] font-medium" style={{ color: ink }}>
            Book online in 60 seconds
          </span>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ Law firm */
export function LawSite({ m }: { m: boolean }) {
  const navy = '#0e1b2c';
  const gold = '#c8a96a';
  const ivory = '#f7f3ea';
  return (
    <div style={{ background: ivory, color: navy }}>
      <section className="relative" style={{ background: navy, color: ivory }}>
        <img src="/showcase/law-hero.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${navy}cc, ${navy}66 50%, ${navy})` }} />
        <nav className={`relative flex items-center justify-between ${m ? 'px-5 py-5' : 'px-16 py-7'}`}>
          <span className="font-serif text-[24px] italic">Hale &amp; Mercer</span>
          {!m && (
            <div className="flex items-center gap-9 text-[14px] uppercase tracking-[0.18em] opacity-80">
              <span>Practice areas</span>
              <span>Results</span>
              <span>People</span>
            </div>
          )}
          <span className="border px-4 py-2 text-[13px] uppercase tracking-[0.16em]" style={{ borderColor: gold, color: gold }}>
            Free consultation
          </span>
        </nav>
        <div className={`relative ${m ? 'px-5 pb-20 pt-16' : 'px-16 pb-32 pt-28'}`}>
          <div className="text-[13px] uppercase tracking-[0.3em]" style={{ color: gold }}>
            Solicitors · Dublin 2 · Since 1997
          </div>
          <h1 className={`mt-6 max-w-[900px] font-serif leading-[0.98] ${m ? 'text-[48px]' : 'text-[96px]'}`}>
            Clear advice. Decisive results.
          </h1>
          <p className={`mt-6 max-w-[560px] leading-relaxed opacity-75 ${m ? 'text-[16px]' : 'text-[19px]'}`}>
            Employment, property and family law, handled by partners who answer their own phone.
          </p>
          <span className="mt-9 inline-block px-7 py-4 text-[14px] font-medium uppercase tracking-[0.16em]" style={{ background: gold, color: navy }}>
            Book a free 15-minute call
          </span>
        </div>
      </section>

      <section className={`grid border-b ${m ? 'grid-cols-1 px-5' : 'grid-cols-3 px-16'}`} style={{ borderColor: '#e4dccb' }}>
        {[
          ['€42M', 'recovered for clients'],
          ['28 years', 'in Dublin 2'],
          ['96%', 'settled before court'],
        ].map(([v, l]) => (
          <div key={l} className={`py-10 ${m ? 'border-b' : ''}`} style={{ borderColor: '#e4dccb' }}>
            <div className={`font-serif ${m ? 'text-[44px]' : 'text-[56px]'}`}>{v}</div>
            <div className="text-[14px] uppercase tracking-[0.16em] opacity-60">{l}</div>
          </div>
        ))}
      </section>

      <section className={m ? 'px-5 pt-16' : 'px-16 pt-24'}>
        <h2 className={`font-serif ${m ? 'text-[36px]' : 'text-[56px]'}`}>How we can help</h2>
        <div className="mt-8">
          {['Employment & unfair dismissal', 'Property & conveyancing', 'Family law & mediation', 'Personal injury'].map((a, i) => (
            <div key={a} className="flex items-center justify-between border-t py-6" style={{ borderColor: '#e4dccb' }}>
              <div className="flex items-baseline gap-6">
                <span className="text-[14px]" style={{ color: gold }}>
                  0{i + 1}
                </span>
                <span className={`font-serif ${m ? 'text-[24px]' : 'text-[32px]'}`}>{a}</span>
              </div>
              <span className="text-[22px]">→</span>
            </div>
          ))}
        </div>
      </section>

      <section className={`grid items-center gap-10 ${m ? 'grid-cols-1 px-5 py-16' : 'grid-cols-[1fr_1.2fr] px-16 py-24'}`}>
        <img src="/showcase/law-justice.webp" alt="" className={`w-full object-cover ${m ? 'h-[240px]' : 'h-[420px]'}`} />
        <figure>
          <blockquote className={`font-serif italic leading-[1.15] ${m ? 'text-[28px]' : 'text-[40px]'}`}>
            “They explained everything in plain English and settled in six weeks.”
          </blockquote>
          <figcaption className="mt-5 text-[14px] uppercase tracking-[0.16em] opacity-60">Employment client, 2025</figcaption>
          <img src="/showcase/law-sign.webp" alt="" className="mt-8 h-[140px] w-[220px] object-cover" />
        </figure>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ Real estate */
export function EstateSite({ m }: { m: boolean }) {
  const sand = '#f4efe7';
  const ink = '#171513';
  const clay = '#b4683f';
  const listings = [
    ['/showcase/home-2.webp', 'Villa Brisa · Tavira', '€1,250,000', '4 bed · 3 bath · 280 m²'],
    ['/showcase/home-3.webp', 'Casa Pinhal · Loulé', '€895,000', '3 bed · 3 bath · 210 m²'],
    ['/showcase/home-interior.webp', 'Lumen Loft · Faro', '€540,000', '2 bed · 2 bath · 140 m²'],
  ];
  return (
    <div style={{ background: sand, color: ink }}>
      <nav className={`flex items-center justify-between ${m ? 'px-5 py-4' : 'px-16 py-6'}`}>
        <span className="font-display text-[20px] font-bold uppercase tracking-[0.08em]">Coastline</span>
        {!m && (
          <div className="flex items-center gap-9 text-[15px] opacity-75">
            <span>Buy</span>
            <span>Sell</span>
            <span>New builds</span>
            <span>Journal</span>
          </div>
        )}
        <span className="rounded-full px-5 py-2.5 text-[14px] text-white" style={{ background: ink }}>
          Book a viewing
        </span>
      </nav>

      <section className={m ? 'px-3' : 'px-8'}>
        <div className="relative overflow-hidden rounded-[28px]">
          <img src="/showcase/home-hero.webp" alt="" className={`w-full object-cover ${m ? 'h-[420px]' : 'h-[620px]'}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className={`absolute inset-x-0 bottom-0 text-white ${m ? 'p-5' : 'p-12'}`}>
            <h1 className={`font-display font-semibold leading-[0.95] tracking-tight ${m ? 'text-[40px]' : 'text-[84px]'}`}>
              Homes by the sea, chosen with care.
            </h1>
            <div className={`mt-6 flex items-center gap-2 rounded-full bg-white p-2 text-[14px] ${m ? 'flex-wrap' : 'w-[640px]'}`} style={{ color: ink }}>
              <span className="flex-1 px-4 py-2">Algarve · any town</span>
              {!m && <span className="flex-1 border-l px-4 py-2 opacity-60">Villa or apartment</span>}
              <span className="rounded-full px-5 py-2.5 text-white" style={{ background: clay }}>
                Search 240 homes
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={m ? 'px-5 pt-16' : 'px-16 pt-24'}>
        <div className="flex items-end justify-between">
          <h2 className={`font-display font-semibold tracking-tight ${m ? 'text-[30px]' : 'text-[48px]'}`}>New this week</h2>
          {!m && <span className="text-[15px] underline underline-offset-4">View all listings</span>}
        </div>
        <div className={`mt-8 grid gap-5 ${m ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {listings.map(([img, name, price, spec]) => (
            <div key={name}>
              <div className="relative overflow-hidden rounded-[22px]">
                <img src={img} alt="" className="h-[260px] w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[12px] font-medium">Sea view</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-[18px] font-semibold">{name}</span>
                <span className="text-[18px] font-semibold" style={{ color: clay }}>
                  {price}
                </span>
              </div>
              <div className="mt-1 text-[14px] opacity-60">{spec}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={m ? 'px-5 py-16' : 'px-16 py-24'}>
        <div className={`grid items-center gap-8 rounded-[28px] text-white ${m ? 'grid-cols-1 p-8' : 'grid-cols-2 p-14'}`} style={{ background: ink }}>
          <h2 className={`font-display font-semibold leading-tight tracking-tight ${m ? 'text-[30px]' : 'text-[44px]'}`}>
            Thinking of selling? Get a valuation in 24 hours.
          </h2>
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-white/10 px-5 py-3.5 text-[15px] opacity-80">Your property address</span>
            <span className="rounded-full px-5 py-3.5 text-center text-[15px] font-medium" style={{ background: clay }}>
              Request my valuation
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
