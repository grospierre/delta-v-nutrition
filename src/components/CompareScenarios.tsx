import { useState } from 'react';
import { NutritionPlan } from '../types';
import { getScenarios } from '../utils/calculations';

interface CompareScenariosProps {
  plan: NutritionPlan;
}

export default function CompareScenarios({ plan }: CompareScenariosProps) {
  const [open, setOpen] = useState(false);
  const scenarios = getScenarios(plan);

  return (
    <div className="max-w-6xl mx-auto px-6 mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full glass-card py-4 px-6 flex items-center justify-between hover:bg-brand-light/40 transition-all"
        aria-expanded={open}
      >
        <span className="font-bold text-brand-navy text-lg">🔀 Compare Strategies</span>
        <span className="text-brand-blue font-bold text-xl">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {scenarios.map((s) => (
            <div
              key={s.label}
              className="glass-card p-5"
              style={{
                borderColor: s.color,
                borderWidth: s.isYourPlan ? 2 : 1,
              }}
            >
              <h3 className="font-bold mb-3" style={{ color: s.color }}>
                {s.label}
              </h3>
              <div className="space-y-1 text-sm mb-4">
                <p>
                  <span className="text-gray-400">Carbs:</span> <strong>{s.carbsPerHour} g/h</strong>
                </p>
                <p>
                  <span className="text-gray-400">Hydration:</span> <strong>{s.hydrationPerHour} ml/h</strong>
                </p>
                <p>
                  <span className="text-gray-400">Sodium:</span> <strong>{s.sodiumPerHour} mg/h</strong>
                </p>
                <p>
                  <span className="text-gray-400">Calories:</span> <strong>{s.calories.toLocaleString()} kcal</strong>
                </p>
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-brand-success mb-1">✅ Pros</p>
                {s.pros.map((p) => (
                  <p key={p} className="text-xs text-gray-500">
                    • {p}
                  </p>
                ))}
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-brand-error mb-1">⚠️ Risks</p>
                {s.risks.map((r) => (
                  <p key={r} className="text-xs text-gray-500">
                    • {r}
                  </p>
                ))}
              </div>
              <p className="text-xs text-brand-blue font-semibold">🎯 {s.bestFor}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
