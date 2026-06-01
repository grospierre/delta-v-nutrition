import { useState } from 'react';
import { NutritionPlan } from '../types';
import { getScenarios } from '../utils/calculations';

interface CompareScenariosProps {
  plan: NutritionPlan;
}

/* ── Metric row ─────────────────────────────────────────────────────────── */
function MetricRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-black tabular-nums" style={{ color: accent ?? '#111827' }}>{value}</span>
    </div>
  );
}

/* ── Pros / Risks list ──────────────────────────────────────────────────── */
function BulletList({
  items,
  icon,
  heading,
  headingColor,
}: {
  items: string[];
  icon: string;
  heading: string;
  headingColor: string;
}) {
  return (
    <div className="mb-3">
      <p className="text-xs font-black mb-1.5" style={{ color: headingColor }}>
        {icon} {heading}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item} className="flex gap-1.5 items-start">
            <span className="mt-[3px] text-[10px] text-gray-400 shrink-0">▸</span>
            <span className="text-xs font-semibold text-gray-900 leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function CompareScenarios({ plan }: CompareScenariosProps) {
  const [open, setOpen] = useState(false);
  const scenarios = getScenarios(plan);

  return (
    <div className="max-w-6xl mx-auto px-6 mb-8">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 px-6 flex items-center justify-between transition-all rounded-3xl"
        style={{
          background:           'rgba(255,255,255,0.85)',
          backdropFilter:       'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border:               '1px solid rgba(255,255,255,0.75)',
          borderRadius:         26,
          boxShadow:            '0 16px 48px rgba(40,55,90,0.16), 0 2px 8px rgba(40,55,90,0.08), inset 0 1px 1px rgba(255,255,255,0.95)',
        }}
        aria-expanded={open}
      >
        <span className="font-black text-brand-navy text-lg">🔀 Compare Strategies</span>
        <span
          className="text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200"
          style={{
            background: 'rgba(65,105,225,0.12)',
            color: '#4169E1',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </span>
      </button>

      {/* Cards grid */}
      {open && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {scenarios.map((s) => {
            const isBalanced = s.isYourPlan;
            return (
              <div
                key={s.label}
                className="scenario-card group flex flex-col rounded-3xl p-5"
                style={{
                  background:           'rgba(255,255,255,0.85)',
                  backdropFilter:       'blur(28px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                  border: isBalanced
                    ? `2px solid ${s.color}60`
                    : '1px solid rgba(255,255,255,0.70)',
                  borderTop: `4px solid ${s.color}`,
                  boxShadow: isBalanced
                    ? `0 0 0 4px ${s.color}0E, 0 12px 40px rgba(60,70,90,0.18), inset 0 1px 1px rgba(255,255,255,0.90)`
                    : '0 12px 40px rgba(60,70,90,0.15), inset 0 1px 1px rgba(255,255,255,0.90)',
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="font-black text-base flex items-center gap-1.5 leading-tight"
                    style={{ color: s.color }}
                  >
                    <span className="icon-pop text-lg">{s.label.split(' ')[0]}</span>
                    <span>{s.label.split(' ').slice(1).join(' ')}</span>
                  </h3>
                  {isBalanced && (
                    <span
                      className="text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wide uppercase"
                      style={{
                        background: s.color,
                        color: 'white',
                      }}
                    >
                      ★ Recommended
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div
                  className="rounded-xl px-3 py-1 mb-4"
                  style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}
                >
                  <MetricRow label="Carbs"     value={`${s.carbsPerHour} g/h`}                  accent={s.color} />
                  <MetricRow label="Hydration" value={`${s.hydrationPerHour} ml/h`}              accent={s.color} />
                  <MetricRow label="Sodium"    value={`${s.sodiumPerHour} mg/h`}                 accent={s.color} />
                  <MetricRow label="Calories"  value={`${s.calories.toLocaleString()} kcal`}     accent={s.color} />
                </div>

                {/* Pros / Risks */}
                <div className="flex-grow">
                  <BulletList
                    items={s.pros}
                    icon="✅"
                    heading="Pros"
                    headingColor="#16a34a"
                  />
                  <BulletList
                    items={s.risks}
                    icon="⚠️"
                    heading="Risks"
                    headingColor="#d97706"
                  />
                </div>

                {/* Best for */}
                <p
                  className="text-xs font-bold italic pt-3 mt-auto border-t"
                  style={{ color: s.color, borderColor: `${s.color}20` }}
                >
                  🎯 {s.bestFor}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
