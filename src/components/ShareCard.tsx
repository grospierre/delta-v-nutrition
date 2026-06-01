import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { NutritionPlan, RaceDetails } from '../types';

interface ShareCardProps {
  plan: NutritionPlan;
  race: RaceDetails;
}

export default function ShareCard({ plan, race }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const intensityLabel = plan.intensityLevel.replace('_', ' ').toUpperCase();

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `Delta-V-Plan-${race.distance}km.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setBusy(false);
    }
  };

  const shareText = [
    'Just generated my race-day nutrition plan with Delta-V 🔺',
    `${race.distance}km | ${race.duration}h | ${intensityLabel}`,
    `💧 ${plan.hydrationTotal}ml · 🍞 ${plan.carbsTotal}g · 🧂 ${plan.sodiumTotal}mg`,
    '#ultratrail #running #nutrition',
  ].join('\n');

  const metrics: Array<{ e: string; v: string; l: string }> = [
    { e: '💧', v: `${plan.hydrationTotal}ml`, l: 'Hydration' },
    { e: '🍞', v: `${plan.carbsTotal}g`, l: 'Carbs' },
    { e: '🧂', v: `${plan.sodiumTotal}mg`, l: 'Sodium' },
    { e: '☕', v: `${plan.caffeineTotal}mg`, l: 'Caffeine' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 mb-8">
      <h2 className="text-3xl font-black section-title tracking-tight mb-5">📸 Share Your Plan</h2>

      <div ref={cardRef} className="print-card max-w-md mx-auto p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="./delta-v-logo.png" alt="Delta-V" className="w-12 h-12" />
          <div className="text-left">
            <p className="font-black text-brand-navy text-xl leading-none">DELTA-V</p>
            <p className="text-xs text-gray-700 font-semibold">Race Nutrition Plan</p>
          </div>
        </div>
        <div className="bg-brand-light rounded-xl p-4 mb-4">
          <p className="font-bold text-brand-navy text-lg">
            {race.distance}km · {race.duration}h
          </p>
          <p className="text-sm text-gray-800 font-semibold">
            +{race.elevationPos}m / -{race.elevationNeg}m · {intensityLabel}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {metrics.map((m) => (
            <div key={m.l} className="bg-white border border-gray-100 rounded-lg p-2">
              <p className="text-lg">{m.e}</p>
              <p className="font-bold text-brand-navy">{m.v}</p>
              <p className="text-xs text-gray-700 font-semibold">{m.l}</p>
            </div>
          ))}
        </div>
        <p className="text-base font-black text-gray-900 tracking-tight uppercase">Same physics. Different finish line.</p>
        <p className="text-xs text-brand-blue font-semibold">delta-v-nutrition.vercel.app</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-5">
        <button
          onClick={downloadImage}
          disabled={busy}
          className="text-sm font-bold text-gray-900 px-6 py-2.5 disabled:opacity-40
                     transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.70)',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(31,38,135,0.12), inset 0 1px 1px rgba(255,255,255,0.80)',
          }}
        >
          {busy ? '⏳ Generating…' : '📥 Download Image'}
        </button>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-gray-900 px-6 py-2.5
                     transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 inline-flex items-center"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.70)',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(31,38,135,0.12), inset 0 1px 1px rgba(255,255,255,0.80)',
          }}
        >𝕏 Share on X</a>

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-gray-900 px-6 py-2.5
                     transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 inline-flex items-center"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.70)',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(31,38,135,0.12), inset 0 1px 1px rgba(255,255,255,0.80)',
          }}
        >📱 Instagram</a>
      </div>
    </div>
  );
}
