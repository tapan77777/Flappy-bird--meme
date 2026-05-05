'use client';
import Link from 'next/link';
import { useState } from 'react';

const TripCard = ({ trip }) => {
  const savingsPct = Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100);
  const photos = trip.gallery?.length ? trip.gallery : [trip.image];
  const [photoIdx, setPhotoIdx] = useState(0);

  const prevPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIdx((i) => (i - 1 + photos.length) % photos.length);
  };
  const nextPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIdx((i) => (i + 1) % photos.length);
  };

  return (
    <Link
      href={`/trip/${trip.slug}`}
      className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 transition-all duration-200 hover:shadow-md"
      style={{ width: '240px', flexShrink: 0 }}
    >
      {/* Image carousel */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '150px' }}>
        <img
          src={photos[photoIdx]}
          alt={trip.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Category badge */}
        <span className="absolute top-2.5 left-2.5 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur">
          {trip.category}
        </span>

        {/* Spots remaining badge */}
        {trip.spotsLeft <= 3 && (
          <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">
            {trip.spotsLeft} left
          </span>
        )}

        {/* Prev arrow */}
        {photos.length > 1 && (
          <button
            onClick={prevPhoto}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-black/40 flex items-center justify-center"
            aria-label="Previous photo"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M6 2L4 5l2 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Next arrow */}
        {photos.length > 1 && (
          <button
            onClick={nextPhoto}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-black/40 flex items-center justify-center"
            aria-label="Next photo"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M4 2l2 3-2 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Dot indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`rounded-full transition-all ${
                  i === photoIdx ? 'w-[14px] h-[5px] bg-white' : 'w-[5px] h-[5px] bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-3">
        {/* Route */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
          <span className="w-2 h-2 rounded-full border border-slate-300 inline-block flex-shrink-0" />
          <span className="truncate">{trip.route}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-slate-900 mb-1.5 leading-snug">
          {trip.title}
        </h3>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-2.5">
          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-100">
            {trip.shortDuration}
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-100">
            {trip.difficulty}
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-auto">
          <div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wide">from</p>
            <p className="text-[11px] text-slate-400 line-through leading-none">
              ₹{(Math.round(trip.price * 1.4 / 500) * 500).toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-lg font-medium text-slate-900 leading-none">
                ₹{trip.price.toLocaleString('en-IN')}
              </p>
              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">40% off</span>
            </div>
            <p className="text-[10px] text-slate-400">per person</p>
          </div>
          <button className="bg-emerald-600 text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full">
            Book →
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
