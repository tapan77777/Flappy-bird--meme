'use client';
import experiences from '@/data/experiences.json';
import trips from '@/data/trips.json';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ExperienceCard from './ExperienceCard';
import TripCard from './TripCard';

/* ─── WhatsApp icon (reused in bottom bar) ──────────────────────────────── */
const WaIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ─── Star icon ─────────────────────────────────────────────────────────── */
const Star = () => (
  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

/* ─── Testimonial data (extracted to avoid re-creation on render) ────────── */
const TESTIMONIALS = [
  {
    name: 'Aisha Sharma',
    from: 'Delhi',
    trip: 'Jibhi Valley Escape',
    rating: 5,
    quote: "I didn't expect to cry when we left Jibhi. It just became home so fast. StayLocal doesn't show you places — it makes you feel them.",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
  },
  {
    name: 'Rohan Mehta',
    from: 'Mumbai',
    trip: 'Simlipal Wild Stay',
    rating: 5,
    quote: 'Eight people, four days, and I made friends I still talk to every week. The forest was the backdrop — the people were the real experience.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
  },
  {
    name: 'Priya Nair',
    from: 'Bengaluru',
    trip: 'Netarhat Plateau Escape',
    rating: 5,
    quote: "The Netarhat sunrise is something I'll describe for the rest of my life — and it cost less than a weekend hotel in Bengaluru.",
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
  },
];

/* ─── Testimonial Card ──────────────────────────────────────────────────── */
const TestimonialCard = ({ name, from, trip, rating, quote, avatar }) => (
  <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex flex-col gap-4
                  min-w-[82vw] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink">
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => <Star key={i} />)}
    </div>
    <p className="text-slate-600 text-sm leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
    <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-stone-100"
        loading="lazy"
      />
      <div className="leading-tight min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
        <p className="text-xs text-slate-400 truncate">{from} · {trip}</p>
      </div>
    </div>
  </div>
);

/* ─── Trip categories for filter bar ────────────────────────────────────── */
const TRIP_CATEGORIES = ['All', 'Mountains', 'Beach', 'Trek', 'Wildlife', 'Islands'];

/* ═══════════════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════════════ */
const StayLocal = () => {
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const [activeSection,    setActiveSection]    = useState('home');
  const [scrolled,         setScrolled]         = useState(false);
  const [pastHero,         setPastHero]         = useState(false);
  const [activeCategory,   setActiveCategory]   = useState('All');

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setPastHero(y > window.innerHeight * 0.75);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { type: 'scroll', id: 'home',    label: 'Home'          },
    { type: 'scroll', id: 'about',   label: 'About'         },
    { type: 'scroll', id: 'trips',   label: 'Explore Trips' },
    { type: 'link',   href: '/experience', label: 'Experience' },
    { type: 'scroll', id: 'contact', label: 'Contact'       },
  ];

  return (
    /* pb-20 lg:pb-0 — reserves space below fixed bottom bar on mobile */
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-900 pb-20 lg:pb-0">

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => scrollToSection('home')}
              className="font-serif text-xl"
            >
              <span className="text-slate-900">Stay</span><span className="text-emerald-600">Local</span>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) =>
                item.type === 'link' ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-slate-600 hover:text-emerald-600 transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`transition-all duration-300 ${
                      activeSection === item.id
                        ? 'text-emerald-600 font-semibold'
                        : 'text-slate-600 hover:text-emerald-600'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>

            {/* WhatsApp pill — mobile */}
            <a
              href="https://wa.me/919178628894"
              className="md:hidden bg-emerald-600 text-white text-xs font-medium px-4 py-2 rounded-full"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section id="home" className="relative h-[42vh] min-h-[300px] max-h-[380px] flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80')",
            opacity: 0.15,
            filter: 'blur(2px)',
            transform: 'scale(1.05)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d3d2e]/95 via-[#1a5c40]/90 to-[#0f4d35]/95" />
        <div className="relative z-10 w-full text-center text-white px-5 max-w-sm mx-auto">
          <p className="text-[10px] tracking-[0.18em] uppercase text-emerald-300 mb-2">Slow travel · Real places</p>
          <h1 className="font-serif text-4xl font-semibold leading-tight mb-3">
            Stay local.<br />
            <span className="text-emerald-400">Move slow.</span>
          </h1>
          <p className="text-sm text-white/70 leading-relaxed mb-5 max-w-[280px] mx-auto">
            Small groups. Homestays. Places most tourists never find.
          </p>
          <div className="flex bg-white/10 rounded-xl overflow-hidden border border-white/10 mt-5">
            <div className="flex-1 py-2.5 text-center border-r border-white/10">
              <p className="text-base font-medium text-white">Max 8</p>
              <p className="text-[9px] uppercase tracking-wider text-white/50 mt-0.5">Per group</p>
            </div>
            <div className="flex-1 py-2.5 text-center border-r border-white/10">
              <p className="text-base font-medium text-white">25+</p>
              <p className="text-[9px] uppercase tracking-wider text-white/50 mt-0.5">Destinations</p>
            </div>
            <div className="flex-1 py-2.5 text-center">
              <p className="text-base font-medium text-white">100%</p>
              <p className="text-[9px] uppercase tracking-wider text-white/50 mt-0.5">Real reviews</p>
            </div>
          </div>
        </div>
      </section>


      {/* ── Explore Trips ───────────────────────────────────────────────── */}
      <section id="trips" className="bg-[#f8f7f4] pb-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="flex justify-between items-center px-5 py-4">
            <h2 className="text-[15px] font-medium text-slate-900">Explore Trips</h2>
            <a href="#" className="text-xs text-emerald-600 font-medium">See all</a>
          </div>

          {/* ── Category filter bar ── */}
          <div className="flex overflow-x-auto hide-scrollbar bg-white border-b border-slate-100 py-3">
            {[
              { cat: 'All',       emoji: '🗺️' },
              { cat: 'Mountains', emoji: '⛰️' },
              { cat: 'Beach',     emoji: '🏖️' },
              { cat: 'Trek',      emoji: '🥾' },
              { cat: 'Wildlife',  emoji: '🐘' },
              { cat: 'Islands',   emoji: '🏝️' },
            ].map(({ cat, emoji }) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 pb-2 flex flex-col items-center gap-1.5 flex-shrink-0 transition-all duration-200 ${
                  activeCategory === cat ? 'border-b-2 border-emerald-500' : ''
                }`}
              >
                <span className={`w-11 h-11 rounded-full flex items-center justify-center text-[20px] ${
                  activeCategory === cat ? 'bg-emerald-50' : 'bg-slate-50'
                }`}>
                  {emoji}
                </span>
                <span className={`text-[10px] whitespace-nowrap ${
                  activeCategory === cat ? 'text-emerald-600 font-medium' : 'text-slate-400'
                }`}>
                  {cat}
                </span>
              </button>
            ))}
          </div>

          {/* ── Horizontal scroll row (all screen sizes) ── */}
          <div className="flex gap-2.5 overflow-x-auto pt-3 pb-5 px-4 sm:px-6 snap-x snap-mandatory scroll-smooth hide-scrollbar">
            {(activeCategory === 'All' ? trips : trips.filter((t) => t.category === activeCategory)).map((trip) => (
              <div key={trip.slug} className="w-[270px] min-w-[270px] snap-start flex-shrink-0">
                <TripCard trip={trip} />
              </div>
            ))}
            <div className="min-w-[1rem] flex-shrink-0" aria-hidden="true" />
          </div>

          {/* Scroll hint dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {(activeCategory === 'All' ? trips : trips.filter((t) => t.category === activeCategory)).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-400 text-sm mt-8 md:mt-12 px-4 sm:px-6">
            More destinations coming soon —{' '}
            <a
              href="https://wa.me/919178628894"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline font-medium"
            >
              WhatsApp us for custom journeys
            </a>
          </p>
        </div>
      </section>

      {/* ── About Us ────────────────────────────────────────────────────── */}
      <section id="about" className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-emerald-50/50" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-10 md:mb-16 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Why StayLocal
          </h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
            {[
              { title: "Not a commercial tour",  desc: "We don't run tourist packages. This is a slow, intentional journey with people who value depth over distance." },
              { title: "Small groups only",       desc: "6–8 travelers maximum. Enough for connection, small enough to stay intimate with the place." },
              { title: "Local stays, local food", desc: "Homestays with families who've lived here for generations. Meals cooked in home kitchens, not restaurants." },
              { title: "Experience > itinerary",  desc: "We follow the weather, the mood, the moment. No rigid timelines. Just presence." },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-emerald-100"
              >
                <h3 className="text-xl sm:text-2xl font-serif text-slate-800 mb-3 sm:mb-4 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Trust & Testimonials ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-stone-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-10 md:mb-14 px-4 sm:px-6">
            <span className="inline-block text-emerald-600 font-semibold text-xs tracking-widest uppercase mb-3">
              Traveler Stories
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-slate-900 mb-3 sm:mb-4">
              Trusted by slow travelers
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-base leading-relaxed">
              Real people. Real journeys. No filters.
            </p>
          </div>

          {/* Stats — 2×2 on mobile, 4-col on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 md:mb-16 px-4 sm:px-6">
            {[
              { value: '4.8', label: 'Average Rating',    suffix: '★' },
              { value: '50',  label: 'Happy Travelers',   suffix: '+'  },
              { value: '12',  label: 'Trips Completed',   suffix: '+'  },
              { value: '100', label: 'Small Groups Only', suffix: '%'  },
            ].map(({ value, label, suffix }) => (
              <div
                key={label}
                className="bg-white rounded-2xl px-4 sm:px-6 py-5 sm:py-7 text-center border border-stone-100 shadow-sm"
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-none mb-1">
                  {value}<span className="text-emerald-500 ml-0.5">{suffix}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Mobile: horizontal snap scroll ── */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-5 px-4 snap-x snap-mandatory scroll-smooth hide-scrollbar">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
            <div className="min-w-[1rem] flex-shrink-0" aria-hidden="true" />
          </div>

          {/* ── Desktop: 3-col grid ── */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 px-4 sm:px-6">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>

          {/* Scroll hint dots — mobile only */}
          <div className="flex md:hidden justify-center gap-1.5 mt-4">
            {TESTIMONIALS.map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            ))}
          </div>

          <p className="text-center text-slate-400 text-xs mt-8 md:mt-10 px-4">
            All reviews are from real travelers who completed a StayLocal journey.
          </p>
        </div>
      </section>

      {/* ── Travel With Me ──────────────────────────────────────────────── */}
      <section id="host" className="py-16 md:py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Image — top on mobile, right on desktop */}
            <div className="order-first md:order-last">
              <Link href="/experience" className="block group">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer">
                  <img
                    src="https://i.pinimg.com/736x/2b/d8/00/2bd8000efe08de79ebade73e154df2f4.jpg"
                    alt="Founder traveling"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Base gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Tap-to-explore badge — fades in on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-600"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Explore real experiences
                    </span>
                  </div>

                  {/* Quote overlay */}
                  <div className="absolute bottom-4 left-4 right-4 transition-opacity duration-300 group-hover:opacity-0">
                    <p className="text-white text-sm font-medium italic bg-black/30 backdrop-blur-sm rounded-xl px-4 py-3 leading-relaxed">
                      &ldquo;I don&apos;t lead tours. I share places I genuinely love.&rdquo;
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Text */}
            <div className="order-last md:order-first">
              <span className="inline-block text-emerald-600 font-semibold text-xs tracking-widest uppercase mb-4">
                Your Host
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-slate-900 mb-3 leading-tight">
                My Travel Experiences I&apos;ve Actually Been
              </h2>
              <p className="text-emerald-600 font-semibold text-sm mb-5 tracking-wide">
                Real places. Real costs. No filters.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                Everything here comes from my own journeys — no guides, no sponsorships, just real experience. first — stayed in,
                spent money in, and decided was worth coming back to.
              </p>

              {/* Stats */}
              <div className="flex gap-8 mb-8">
                {[
                  { value: '2+', label: 'Years of Experience' },
                  { value: '25+',  label: 'Places Visited' },
                  { value: '50+', label: 'Destinations' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
                    <p className="text-xs text-slate-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Place preview chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['Jibhi', 'Simlipal', 'Netarhat', 'Dharamkot'].map((place) => (
                  <Link
                    key={place}
                    href={`/experience?q=${place}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5
                               bg-white border border-slate-200 text-slate-600 rounded-full
                               hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50
                               transition-all duration-200 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    {place}
                  </Link>
                ))}
              </div>

              <Link
                href="/experience"
                className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700
                           active:scale-95 text-white px-7 py-4 rounded-xl font-semibold text-base
                           transition-all duration-200 shadow-md shadow-emerald-100 hover:shadow-lg hover:shadow-emerald-100
                           min-h-[52px]"
              >
                See Real Experiences
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── From My Experience (cards preview) ─────────────────────────── */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-8 md:mb-14 px-4 sm:px-6">
            <span className="inline-block text-emerald-600 font-semibold text-xs tracking-widest uppercase mb-3">
              First-hand Accounts
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-slate-900 mb-3 sm:mb-4">
              Places I&apos;ve Explored
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-base leading-relaxed">
              Real notes from the field. Budget breakdowns, honest observations, day-by-day accounts.
            </p>
          </div>

          {/* Mobile: horizontal snap scroll */}
          <div className="sm:hidden flex gap-4 overflow-x-auto pb-5 px-4 snap-x snap-mandatory scroll-smooth hide-scrollbar">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.slug} experience={exp} />
            ))}
            <div className="min-w-[1rem] flex-shrink-0" aria-hidden="true" />
          </div>

          {/* Desktop: 3-col grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.slug} experience={exp} />
            ))}
          </div>

          {/* Scroll hint dots — mobile only */}
          <div className="flex sm:hidden justify-center gap-1.5 mt-4">
            {experiences.map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12 px-4 sm:px-6">
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm
                         hover:text-emerald-700 transition-colors"
            >
              Read all experiences
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────────── */}
      <section id="contact" className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-900 to-emerald-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4">Let's Talk</h2>
          <p className="text-slate-300 mb-8 sm:mb-10 text-base sm:text-lg leading-relaxed">
            Questions before booking? Curious about a trip? We're real people — reach us directly.
          </p>
          {/* Thumb-friendly CTA: min-height 56px */}
          <a
            href="https://wa.me/919178628894"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-7 sm:px-8 py-4 rounded-full text-base sm:text-lg font-semibold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 min-h-[56px]"
          >
            <WaIcon className="w-6 h-6 flex-shrink-0" />
            Chat on WhatsApp
          </a>
          <p className="text-slate-400 text-sm mt-5">Typically replies within 2 hours</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="py-10 sm:py-12 px-4 sm:px-6 bg-slate-950 text-slate-400">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-serif mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              StayLocal
            </h3>
            <p className="text-slate-500 text-sm">Travel with intention</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-6 sm:mb-8">
            {navItems.map((item) =>
              item.type === 'link' ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-500 hover:text-emerald-400 transition-colors text-sm py-1"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-slate-500 hover:text-emerald-400 transition-colors text-sm py-1"
                >
                  {item.label}
                </button>
              )
            )}
          </div>
          <div className="text-center border-t border-slate-800 pt-6 sm:pt-8">
            <p className="text-xs text-slate-600">© 2026 StayLocal. Made with care for slow travelers.</p>
          </div>
        </div>
      </footer>

      {/* ── Mobile fixed bottom bar (homepage) ──────────────────────────── */}
      {/* Shows after scrolling 75% of the hero; hidden on lg+ */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-400 ${
          pastHero
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Safe-area padding for phones with home indicator */}
        <div className="bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <div className="flex gap-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919178628894"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 flex-1 bg-[#25D366] text-white py-3.5 rounded-2xl font-semibold text-sm min-h-[52px] active:scale-95 transition-transform"
            >
              <WaIcon className="w-5 h-5 flex-shrink-0" />
              WhatsApp
            </a>
            {/* Explore trips */}
            <button
              onClick={() => scrollToSection('trips')}
              className="flex items-center justify-center flex-1 bg-emerald-600 text-white py-3.5 rounded-2xl font-semibold text-sm min-h-[52px] active:scale-95 transition-all hover:bg-emerald-700"
            >
              Explore Trips
            </button>
          </div>
        </div>
      </div>

      {/* ── Keyframe animations ──────────────────────────────────────────── */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes zoomSlow {
          from { transform: scale(1);    }
          to   { transform: scale(1.08); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0);    }
          50%      { transform: translateY(-12px); }
        }
        .animate-fadeIn     { animation: fadeIn    0.3s ease            forwards; }
        .animate-fadeInUp   { animation: fadeInUp  1s   ease            forwards; }
        .animate-slideDown  { animation: slideDown 1s   ease  0.2s both;          }
        .animate-slideUp    { animation: slideUp   1s   ease  0.4s both;          }
        .animate-zoomSlow   { animation: zoomSlow  8s   ease-in-out infinite alternate; }
        .animate-float      { animation: float     4s   ease-in-out infinite;           }
        .animate-pulse-slow { animation: pulse     3s   cubic-bezier(0.4,0,0.6,1) infinite; }

        /* Hide scrollbar on horizontal scroll containers */
        .hide-scrollbar { -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default StayLocal;
