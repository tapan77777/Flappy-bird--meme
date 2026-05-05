import Link from 'next/link';

const ExperienceCard = ({ experience }) => (
  <Link
    href={`/experience/${experience.slug}`}
    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100
               shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
               min-w-[80vw] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink"
  >
    {/* Image */}
    <div className="relative overflow-hidden h-48 sm:h-52 flex-shrink-0">
      <img
        src={experience.image}
        alt={experience.place}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        {experience.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>

    {/* Body */}
    <div className="flex flex-col flex-1 p-5">
      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold mb-2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7 14S2.5 9 2.5 5.5a4.5 4.5 0 019 0C11.5 9 7 14 7 14z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
        <span>{experience.place}</span>
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 leading-snug
                     group-hover:text-emerald-700 transition-colors">
        {experience.title}
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
        {experience.shortDesc}
      </p>

      <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-semibold
                       group-hover:gap-2.5 transition-all duration-200">
        Read Experience
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-0.5 transition-transform"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    </div>
  </Link>
);

export default ExperienceCard;
