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
      <h2 className="text-xl font-bold text-brand-navy mb-4">📸 Share Your Plan</h2>

      <div ref={cardRef} className="print-card max-w-md mx-auto p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="./delta-v-logo.svg" alt="Delta-V" className="w-10 h-10" />
          <div className="text-left">
            <p className="font-black text-brand-navy text-xl leading-none">DELTA-V</p>
            <p className="text-xs text-gray-400">Race Nutrition Plan</p>
          </div>
        </div>
        <div className="bg-brand-light rounded-xl p-4 mb-4">
          <p className="font-bold text-brand-navy text-lg">
            {race.distance}km · {race.duration}h
          </p>
          <p className="text-sm text-gray-500">
            +{race.elevationPos}m / -{race.elevationNeg}m · {intensityLabel}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {metrics.map((m) => (
            <div key={m.l} className="bg-white border border-gray-100 rounded-lg p-2">
              <p className="text-lg">{m.e}</p>
              <p className="font-bold text-brand-navy">{m.v}</p>
              <p className="text-xs text-gray-400">{m.l}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">Same physics. Different finish line.</p>
        <p className="text-xs text-brand-blue font-semibold">delta-v-nutrition.vercel.app</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-4">
        <button
          onClick={downloadImage}
          disabled={busy}
          className="bg-brand-blue text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-brand-blue-dark transition disabled:opacity-60"
        >
          {busy ? '⏳ Generating…' : '📥 Download Image'}
        </button>

          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="border border-brand-blue text-brand-blue px-5 py-2 rounded-xl text-sm font-semibold hover:bg-brand-light transition">𝕏 Share on X</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="border border-brand-blue text-brand-blue px-5 py-2 rounded-xl text-sm font-semibold hover:bg-brand-light transition">📱 Instagram</a>
      </div>
    </div>
  );
}
