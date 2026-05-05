'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  MapPin,
  Shield,
  Users,
  X,
} from 'lucide-react';
import experiences from '@/data/experiences.json';

const WA_NUMBER = '919178628894';

/* ─── WhatsApp SVG ──────────────────────────────────────────────────────── */
const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ─── Booking Card ──────────────────────────────────────────────────────── */
const BookingCard = ({
  trip,
  selectedDuration,
  setSelectedDuration,
  selectedPackage,
  setSelectedPackage,
  activePrice,
  waLink,
}) => {
  const filled   = trip.totalSpots - trip.spotsLeft;
  const progress = (filled / trip.totalSpots) * 100;
  const durations = trip.durations ?? [];

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

      {/* ── Price header ── */}
      <div className="p-6 pb-5 border-b border-slate-100">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-emerald-700">
            ₹{activePrice.toLocaleString('en-IN')}
          </span>
          <span className="text-slate-400 mb-1 text-sm">/ person</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">All inclusive · No hidden charges</p>
      </div>

      <div className="p-6 space-y-5">

        {/* ── Duration selector ── */}
        {durations.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
              Select Duration
            </p>
            <div className="flex flex-col gap-2">
              {durations.map((d, i) => (
                <button
                  key={d.label}
                  onClick={() => setSelectedDuration(i)}
                  className={`relative flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    selectedDuration === i
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{d.label}</span>
                  <div className="flex items-center gap-2">
                    {d.popular && (
                      <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    <span className={`font-semibold ${selectedDuration === i ? 'text-emerald-600' : 'text-slate-500'}`}>
                      ₹{d.price[selectedPackage].toLocaleString('en-IN')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Package selector ── */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            Select Package
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'standard', label: 'Standard', badge: null },
              { key: 'deluxe',   label: 'Deluxe',   badge: 'Best Value' },
            ].map(({ key, label, badge }) => (
              <button
                key={key}
                onClick={() => setSelectedPackage(key)}
                className={`relative flex flex-col items-center justify-center px-3 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  selectedPackage === key
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {badge && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                    {badge}
                  </span>
                )}
                <span>{label}</span>
                {durations.length > 0 && (
                  <span className={`text-xs mt-0.5 ${selectedPackage === key ? 'text-emerald-500' : 'text-slate-400'}`}>
                    ₹{(durations[selectedDuration]?.price[key] ?? trip.price).toLocaleString('en-IN')}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Spots progress ── */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Seats booked</span>
            <span className="font-semibold text-slate-800">
              {filled}/{trip.totalSpots} confirmed
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          {trip.spotsLeft <= 3 && (
            <p className="text-red-500 text-xs font-semibold mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
              Only {trip.spotsLeft} spot{trip.spotsLeft !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>

        {/* ── Details ── */}
        <div className="space-y-3 text-sm divide-y divide-slate-50">
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Next departure</span>
            <span className="font-medium text-slate-800">{trip.nextDeparture}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Advance to confirm</span>
            <span className="font-semibold text-amber-600">
              ₹{trip.advance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* ── Advance note ── */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            Advance is non-refundable and secures your spot. Balance is due 7 days before departure.
          </p>
        </div>

        {/* ── Primary CTA ── */}
        <a
          href={trip.bookingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-100"
        >
          Reserve Your Spot
        </a>

        {/* ── WhatsApp CTA ── */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-700 py-3 rounded-2xl font-medium text-sm hover:border-emerald-300 hover:text-emerald-700 transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
};

/* ─── Main Detail Component ─────────────────────────────────────────────── */
const TripDetail = ({ trip }) => {
  const [openFaq,        setOpenFaq]        = useState(null);
  const [expandedDay,    setExpandedDay]    = useState(0);
  const [activeGallery,  setActiveGallery]  = useState(0);

  /* ── Pricing state ── */
  const durations = trip.durations ?? [];
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [selectedPackage,  setSelectedPackage]  = useState('standard');

  const activeDuration = durations[selectedDuration];
  const activePrice    = activeDuration?.price?.[selectedPackage] ?? trip.price;

  const waMessage = `Hi, I'm interested in the ${trip.title} trip.\n\nDuration: ${activeDuration?.label ?? trip.shortDuration}\nPackage: ${selectedPackage === 'standard' ? 'Standard' : 'Deluxe'}\nPrice: ₹${activePrice.toLocaleString('en-IN')}\n\nPlease share more details.`;
  const waLink    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  const experience = experiences.find((e) => e.slug === trip.slug);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] md:h-[68vh] overflow-hidden">
        <img
          src={trip.heroImage}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <Link
          href="/#trips"
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Trips
        </Link>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 tracking-wider uppercase">
              {trip.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-3 leading-tight">
              {trip.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {trip.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {trip.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {trip.groupSize}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* ── Left: content ───────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-12 md:space-y-16">

            {/* Overview */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-3">Overview</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">{trip.tagline}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Duration',   value: trip.shortDuration,  Icon: Clock    },
                  { label: 'Group Size', value: trip.groupSize,      Icon: Users    },
                  { label: 'Difficulty', value: trip.difficulty,     Icon: Shield   },
                  { label: 'Next Trip',  value: trip.nextDeparture,  Icon: Calendar },
                ].map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100"
                  >
                    <Icon className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* From My Experience */}
            {experience && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl p-5 sm:p-6">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3">
                  From My Experience
                </p>
                <p className="text-slate-700 italic text-base leading-relaxed mb-4">
                  &ldquo;{experience.founderNote}&rdquo;
                </p>
                <Link
                  href={`/experience/${trip.slug}`}
                  className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors"
                >
                  Read my full account
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-5">Trip Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {trip.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4"
                  >
                    <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium text-sm">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Day-wise Itinerary */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-5">Day by Day</h2>
              <div className="space-y-2">
                {trip.itinerary.map((day, idx) => (
                  <div
                    key={day.day}
                    className="border border-slate-200 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                      className="w-full flex items-center justify-between px-4 sm:px-5 py-4 min-h-[60px] text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {day.day}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{day.title}</p>
                          <p className="text-xs text-emerald-600 mt-0.5">{day.location}</p>
                        </div>
                      </div>
                      <svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                        className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                          expandedDay === idx ? 'rotate-180' : ''
                        }`}
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {expandedDay === idx && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50">
                        <ul className="space-y-2.5 mt-3">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Includes / Excludes */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-5">What&apos;s Included</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                  <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Check className="w-4 h-4" /> Included
                  </h3>
                  <ul className="space-y-3">
                    {trip.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                  <h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <X className="w-4 h-4" /> Not Included
                  </h3>
                  <ul className="space-y-3">
                    {trip.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-5">Gallery</h2>
              <div className="rounded-2xl overflow-hidden mb-3 aspect-video">
                <img
                  src={trip.gallery[activeGallery]}
                  alt={`${trip.title} photo ${activeGallery + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {trip.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveGallery(i)}
                    className={`relative overflow-hidden rounded-xl aspect-square min-h-[64px] transition-all duration-200 ${
                      activeGallery === i
                        ? 'ring-2 ring-emerald-500 ring-offset-1'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-serif text-slate-900 mb-5">
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {trip.faqs.map((faq, i) => (
                  <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 sm:px-5 py-4 min-h-[60px] text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-800 text-sm pr-4">{faq.q}</span>
                      <svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                        className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                          openFaq === i ? 'rotate-180' : ''
                        }`}
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50">
                        <p className="text-slate-600 text-sm leading-relaxed mt-3">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* WhatsApp CTA banner */}
            <section className="bg-gradient-to-br from-slate-900 to-emerald-900 rounded-3xl p-8 text-center text-white">
              <h3 className="text-2xl font-serif mb-2">Still have questions?</h3>
              <p className="text-slate-300 mb-7 text-sm leading-relaxed">
                Talk to us before booking. No bots, no scripts — just people who love slow travel.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg"
              >
                <WhatsAppIcon className="w-6 h-6" />
                Ask on WhatsApp
              </a>
              <p className="text-slate-400 text-xs mt-4">Typically replies within 2 hours</p>
            </section>

            {/* Bottom padding for mobile bar */}
            <div className="h-28 lg:hidden" />
          </div>

          {/* ── Right: sticky booking card (desktop) ────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <BookingCard
                trip={trip}
                selectedDuration={selectedDuration}
                setSelectedDuration={setSelectedDuration}
                selectedPackage={selectedPackage}
                setSelectedPackage={setSelectedPackage}
                activePrice={activePrice}
                waLink={waLink}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ─────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 leading-tight">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">
              {activeDuration?.label ?? trip.shortDuration} · {selectedPackage === 'standard' ? 'Standard' : 'Deluxe'}
            </p>
            <p className="text-xl font-bold text-emerald-700">
              ₹{activePrice.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-400">per person</p>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 flex-1 bg-[#25D366] text-white py-3.5 rounded-2xl font-bold text-base active:scale-95 transition-transform"
          >
            <WhatsAppIcon className="w-5 h-5" />
            WhatsApp
          </a>
          <a
            href={trip.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-base active:scale-95 transition-all"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
