import { NutritionPlan, AthleteProfile, RaceDetails, Strategy } from '../types';
import NutritionTargets from './NutritionTargets';
import BrandRecommendations from './BrandRecommendations';
import CompareScenarios from './CompareScenarios';
import ShareCard from './ShareCard';
import PDFExportPanel from './PDFExportPanel';

interface OutputPanelProps {
  plan: NutritionPlan;
  athlete: AthleteProfile;
  race: RaceDetails;
  strategy: Strategy;
  onBack: () => void;
}

export default function OutputPanel({ plan, athlete, race, strategy, onBack }: OutputPanelProps) {
  const intensityLabel = plan.intensityLevel.replace('_', ' ').toUpperCase();

  const raceSummary: Array<[string, string]> = [
    ['Intensity', `${intensityLabel} (${plan.intensityScore})`],
    ['Temperature', `${plan.weather.category} (${plan.weather.temperature}°C)`],
    ['Objective', strategy.objective],
    ['Distance', `${race.distance} km`],
    ['Elevation', `+${race.elevationPos}m / -${race.elevationNeg}m`],
    ['Duration', `${race.duration} hours`],
  ];

  return (
    <div className="pb-16 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 mb-4 flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-green-800">Your nutrition plan is ready!</p>
            <p className="text-sm text-green-600">
              Weather: {plan.weather.category} ({plan.weather.temperature}°C) · Intensity: {intensityLabel} · Pace: {plan.paceKmh} km/h
            </p>
          </div>
        </div>

        {!plan.weather.isLive && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mb-6 text-sm text-amber-700">
            ⚠️ Live weather unavailable for "{race.location}" — using a Mild 15°C default. Adjust the location and regenerate for precise hydration.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-5">
            <h3 className="font-bold text-brand-navy mb-3">📋 Nutrition Summary</h3>
            <p className="text-sm text-gray-600 mb-1">
              Total Calories: <strong className="text-brand-navy">{plan.caloriesTotal.toLocaleString()} kcal</strong>
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Carbs Split: <strong className="text-brand-blue">{plan.glucosePercent}% glucose + {plan.fructosePercent}% fructose</strong>
            </p>
            <p className="text-xs text-gray-400 italic">
              {plan.carbsPerHour >= 60
                ? 'Dual-transporter strategy: maximizes absorption and reduces GI distress on long efforts.'
                : 'Single-transporter intake: clean and simple at your carb level.'}
            </p>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-bold text-brand-navy mb-3">🛑 Refueling Strategy</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Stops</p>
                <p className="font-bold text-brand-navy text-lg">{strategy.refuels}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Interval</p>
                <p className="font-bold text-brand-navy text-lg">{plan.intervalHours}h</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">💧 Per stop</p>
                <p className="font-bold text-brand-blue">{plan.perStopHydration} ml</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">🍞 Per stop</p>
                <p className="font-bold text-brand-blue">{plan.perStopCarbs} g</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">🧂 Per stop</p>
                <p className="font-bold text-brand-blue">{plan.perStopSodium} mg</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Objective</p>
                <p className="font-semibold text-gray-600 text-sm">{strategy.objective}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 mb-6">
          <h3 className="font-bold text-brand-navy mb-3">📊 Race Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {raceSummary.map(([k, v]) => (
              <div key={k}>
                <p className="text-gray-400 text-xs">{k}</p>
                <p className="font-bold text-brand-navy">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NutritionTargets plan={plan} race={race} />
      <BrandRecommendations plan={plan} />
      <CompareScenarios plan={plan} />
      <ShareCard plan={plan} race={race} />
      <PDFExportPanel plan={plan} athlete={athlete} race={race} strategy={strategy} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="glass-card p-5 mb-6">
          <details>
            <summary className="font-bold text-brand-navy cursor-pointer">📋 Full Plan Data (JSON)</summary>
            <pre className="mt-3 text-xs text-gray-600 overflow-auto max-h-64 bg-gray-50 p-3 rounded-lg">
{JSON.stringify({ athlete, race, strategy, weather: plan.weather, nutrition: plan }, null, 2)}
            </pre>
          </details>
        </div>
        <button
          onClick={onBack}
          className="w-full border-2 border-brand-blue text-brand-blue font-bold py-4 rounded-2xl hover:bg-brand-light transition text-lg"
        >
          ← Back to Inputs
        </button>
      </div>
    </div>
  );
}
