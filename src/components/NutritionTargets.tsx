import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { NutritionPlan, RaceDetails } from '../types';
import { getHydrationSeries, getSodiumSeries, getCarbsSplit } from '../utils/calculations';

interface NutritionTargetsProps {
  plan: NutritionPlan;
  race: RaceDetails;
}

const tooltipStyle = { fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' };

export default function NutritionTargets({ plan, race }: NutritionTargetsProps) {
  const hydrationSeries = getHydrationSeries(plan, race.duration).slice(0, 8);
  const sodiumSeries = getSodiumSeries(plan, race.duration).slice(0, 8);
  const carbsSplit = getCarbsSplit(plan);

  return (
    <div className="max-w-6xl mx-auto px-6 mb-8">
      <h2 className="text-xl font-bold text-brand-navy mb-4">📊 Nutrition Targets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-brand-blue font-bold text-base mb-1">💧 Hydration</h3>
          <p className="text-2xl font-black text-brand-navy">{plan.hydrationPerHour} ml/h</p>
          <p className="text-xs text-gray-500">{plan.hydrationTotal.toLocaleString()} ml total</p>
          <p className="text-xs text-gray-500 mb-3">{plan.hydrationRefills} refills (500ml each)</p>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hydrationSeries} barCategoryGap="20%">
                <Bar dataKey="ml" fill="#4169E1" radius={[4, 4, 0, 0]} />
                <Tooltip formatter={(v: number) => [`${v} ml`, 'Per hour']} contentStyle={tooltipStyle} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-brand-blue font-bold text-base mb-1">🍞 Carbohydrates</h3>
          <p className="text-2xl font-black text-brand-navy">{plan.carbsPerHour} g/h</p>
          <p className="text-xs text-gray-500">{plan.carbsTotal} g total</p>
          <p className="text-xs text-gray-500 mb-3">{plan.carbsServings} servings (25g each)</p>
          <div className="h-20 w-full flex items-center gap-2">
            <div className="h-20 w-20 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={carbsSplit} cx="50%" cy="50%" innerRadius={18} outerRadius={32} dataKey="value" stroke="none">
                    <Cell fill="#4169E1" />
                    <Cell fill="#93c5fd" />
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-blue inline-block" /> {plan.glucosePercent}% Glucose
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-blue-300 inline-block" /> {plan.fructosePercent}% Fructose
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-brand-blue font-bold text-base mb-1">🧂 Sodium</h3>
          <p className="text-2xl font-black text-brand-navy">{plan.sodiumPerHour} mg/h</p>
          <p className="text-xs text-gray-500">{plan.sodiumTotal.toLocaleString()} mg total</p>
          <p className="text-xs text-gray-500 mb-3">{plan.sodiumTablets} tablets (500mg each)</p>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sodiumSeries}>
                <Area type="monotone" dataKey="mg" stroke="#4169E1" fill="#E6F1FB" strokeWidth={2} />
                <Tooltip formatter={(v: number) => [`${v} mg`, 'Cumulative']} contentStyle={tooltipStyle} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-brand-blue font-bold text-base mb-1">☕ Caffeine</h3>
          <p className="text-2xl font-black text-brand-navy">{plan.caffeineTotal} mg</p>
          <p className="text-xs text-gray-500">{plan.caffeineDoses} dose{plan.caffeineDoses > 1 ? 's' : ''}</p>
          <p className="text-xs text-gray-500 mb-3">{plan.caffeineTiming}</p>
          <div className="h-20 w-full flex items-center gap-2">
            {Array.from({ length: plan.caffeineDoses }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-brand-blue/15 rounded-lg h-12 flex flex-col items-center justify-center text-brand-blue"
              >
                <span className="text-xs font-bold">{plan.caffeineTotal / plan.caffeineDoses}mg</span>
                <span className="text-[10px] text-gray-400">{i === 0 ? 'Start' : 'Mid-race'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
