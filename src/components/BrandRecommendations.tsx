import { NutritionPlan } from '../types';
import { BRANDS } from '../utils/constants';

interface BrandRecommendationsProps {
  plan: NutritionPlan;
}

export default function BrandRecommendations({ plan }: BrandRecommendationsProps) {
  const relevant = BRANDS.filter((b) => {
    if (b.category === 'carbs') return true;
    if (b.category === 'sodium') return plan.sodiumPerHour > 400;
    if (b.category === 'caffeine') return plan.caffeineTotal > 0;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 mb-8">
      <h2 className="text-xl font-bold text-brand-navy mb-1">🏪 Recommended Products</h2>
      <p className="text-sm text-gray-500 mb-4">Curated to match your specific nutrition targets</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relevant.map((b) => (
          <div key={b.id} className="glass-card glass-card-hover p-5 flex flex-col">
            <div className="flex items-start justify-between mb-2 gap-2">
              <div>
                <p className="text-xs text-brand-blue font-semibold uppercase tracking-wide">{b.brand}</p>
                <p className="font-bold text-brand-navy">{b.name}</p>
              </div>
              <span className="bg-brand-light text-brand-blue text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                {b.badge}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3 flex-grow">{b.description}</p>
            <div className="flex gap-3 text-xs text-gray-400 mb-3 flex-wrap">
              <span>🍞 {b.carbs}g</span>
              <span>⚡ {b.kcal} kcal</span>
              <span>🧂 {b.sodium}mg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5" aria-label={`Rated ${b.rating} of 5`}>
                {Array.from({ length: Math.round(b.rating) }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xs">★</span>
                ))}
              </div>

              <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-blue hover:underline font-semibold">Visit site →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
