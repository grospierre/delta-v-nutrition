import { TESTIMONIALS } from '../utils/constants';

export default function Testimonials() {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-navy text-center mb-2">What ultra-runners say</h2>
      <p className="text-gray-500 text-center mb-10">Trusted by trail runners across 40+ countries</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="glass-card glass-card-hover p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {t.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm text-brand-navy">{t.name}</p>
                <p className="text-xs text-gray-400">{t.source} · {t.race}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 italic leading-relaxed flex-grow">"{t.quote}"</p>
            <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
