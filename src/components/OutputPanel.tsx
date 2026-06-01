import { NutritionPlan, AthleteProfile, RaceDetails, Strategy, IntensityLevel } from '../types';
import { CountUp } from '../utils/CountUp';
import NutritionTargets from './NutritionTargets';
import BrandRecommendations from './BrandRecommendations';
import CompareScenarios from './CompareScenarios';
import ShareCard from './ShareCard';
import PDFExportPanel from './PDFExportPanel';

// ── Terrain labels ────────────────────────────────────────────────────────────
const TERRAIN_LABELS: Record<string, string> = {
  'technical-trail': 'Technical Trail',
  'rolling-path':    'Rolling Path',
  'road':            'Road',
};

// Background is the full-page sky gradient defined in App.tsx PAGE_BG.output.
// No local cloud overlay needed — the fixed gradient IS the entire background.

// ── Glass card spec ───────────────────────────────────────────────────────────
// Opacity bumped to 0.72 (from 0.62) so cards stay crisp and readable over
// the darker blue portion of the sky gradient near the top of the page.
const GLASS: React.CSSProperties = {
  background:           'rgba(255,255,255,0.85)',
  backdropFilter:       'blur(32px) saturate(180%)',
  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
  border:               '1px solid rgba(255,255,255,0.75)',
  boxShadow:
    '0 16px 48px rgba(20,40,80,0.18), 0 2px 8px rgba(20,40,80,0.10), inset 0 1px 1px rgba(255,255,255,0.95)',
  borderRadius: 26,
};

// ── Nested stat / data box ────────────────────────────────────────────────────
const INNER: React.CSSProperties = {
  background:   'rgba(255,255,255,0.45)',
  border:       '1px solid rgba(255,255,255,0.60)',
  borderRadius: 16,
};

// ── Palette ────────────────────────────────────────────────────────────────────
const BLUE        = '#4169E1';
const BLUE_DEEP   = '#2952CC';
const VIOLET      = '#7C5ACE';
const VIOLET_DEEP = '#5B3FA8';
const TEAL        = '#0CA5B5';

// ── Blue→Violet gradient text (big hero numbers) ─────────────────────────────
// 90deg = pure left-to-right sweep so the blue→violet transition is fully
// visible across every digit, matching the home-hero brand gradient.
const GRAD_NUM: React.CSSProperties = {
  background:           `linear-gradient(90deg, ${BLUE} 0%, ${VIOLET} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor:  'transparent',
  backgroundClip:       'text',
};

// ── Icon halo helper ──────────────────────────────────────────────────────────
// Soft accent-tinted square behind each section emoji, 9px all-round padding.
function Halo({ accent, emoji }: { accent: string; emoji: string }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-2xl"
      style={{ background: `${accent}18`, padding: 9, lineHeight: 1 }}
    >
      <span className="text-xl leading-none">{emoji}</span>
    </div>
  );
}

// ── Staggered card entrance ───────────────────────────────────────────────────
function cardIn(delay = 0): React.CSSProperties {
  return { animation: `fadeIn 0.45s ease-out ${delay}s both` };
}

// ── Intensity colour palette ──────────────────────────────────────────────────
const INTENSITY_CFG: Record<IntensityLevel, { color: string; bg: string; icon: string; desc: string }> = {
  easy:      { color: '#166534', bg: 'rgba(220,252,231,0.90)', icon: '🟢', desc: 'Aerobic zone · fat-burning effort' },
  moderate:  { color: BLUE_DEEP, bg: 'rgba(219,234,254,0.90)', icon: '🔵', desc: 'Threshold · mixed fuel use' },
  hard:      { color: '#92400E', bg: 'rgba(255,237,213,0.90)', icon: '🟠', desc: 'High glycogen demand' },
  very_hard: { color: '#991B1B', bg: 'rgba(254,226,226,0.90)', icon: '🔴', desc: 'Max glycolytic · race pace' },
};

// ── Weather colour palette ────────────────────────────────────────────────────
const WEATHER_CFG: Record<string, { color: string; bg: string; icon: string; desc: string }> = {
  Cold:  { color: BLUE_DEEP,  bg: 'rgba(219,234,254,0.90)', icon: '❄️',  desc: 'Low sweat · baseline intake'   },
  Cool:  { color: '#0369A1',  bg: 'rgba(224,242,254,0.90)', icon: '🌥️',  desc: 'Comfortable · standard plan'   },
  Mild:  { color: '#065F46',  bg: 'rgba(209,250,229,0.90)', icon: '🌤️',  desc: 'Optimal conditions · balanced' },
  Warm:  { color: '#92400E',  bg: 'rgba(255,237,213,0.90)', icon: '☀️',  desc: '↑ Sweat rate · +fluids needed' },
  Hot:   { color: '#991B1B',  bg: 'rgba(254,226,226,0.90)', icon: '🔥',  desc: 'High sweat · electrolyte focus' },
};

interface OutputPanelProps {
  plan: NutritionPlan;
  athlete: AthleteProfile;
  race: RaceDetails;
  strategy: Strategy;
  onBack: () => void;
}

export default function OutputPanel({ plan, athlete, race, strategy, onBack }: OutputPanelProps) {
  const intensityLabel = plan.intensityLevel.replace('_', ' ').toUpperCase();
  const ic  = INTENSITY_CFG[plan.intensityLevel];
  const wc  = WEATHER_CFG[plan.weather.category] ?? WEATHER_CFG.Mild;
  const maxDots = Math.min(strategy.refuels, 9);
  const energyPerHour = Math.round(plan.caloriesTotal / race.duration);

  const minPerKm = 60 / plan.paceKmh;
  const paceMin  = Math.floor(minPerKm);
  const paceSec  = String(Math.round((minPerKm % 1) * 60)).padStart(2, '0');

  return (
    <div className="output-page animate-fade-in">

      {/* ══════════════════════════════════════════════════════════════════════
          ALL CARDS — transparent so the fixed sky gradient shows through.
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          paddingBottom: '4rem',
        }}
      >

        <div className="max-w-6xl mx-auto px-6 pt-6 pb-4">

          {/* ── Success banner ─────────────────────────────────────────── */}
          {/* No glass-card class: backdrop-filter on a fixed-attachment gradient
              causes a left/right rendering split in some browsers. Explicit opaque
              green ensures a perfectly uniform fill edge to edge. */}
          <div
            className="success-banner px-6 py-4 mb-6 flex items-start gap-4 rounded-[26px]"
            style={{
              ...cardIn(0.10),
              background:           'rgba(240,253,244,0.97)',
              border:               '1px solid rgba(134,239,172,0.50)',
              borderTop:            '3px solid rgba(34,197,94,0.60)',
              boxShadow:            '0 8px 28px rgba(22,163,74,0.13), inset 0 1px 1px rgba(255,255,255,0.95)',
            }}
          >
            <Halo accent="#16a34a" emoji="✅" />
            <div>
              <p className="font-bold text-green-800">Your nutrition plan is ready!</p>
              <p className="text-sm text-gray-600 mt-0.5">
                Weather: {plan.weather.category} ({plan.weather.temperature}°C) ·
                Intensity: {intensityLabel} · Pace: {plan.paceKmh} km/h
              </p>
            </div>
          </div>

          {!plan.weather.isLive && (
            <div
              className="glass-card px-4 py-3 mb-5 text-sm text-blue-900 flex items-center gap-2"
              style={{
                ...cardIn(0.14),
                background: 'rgba(239,246,255,0.82)',
                borderLeft: '3px solid rgba(65,105,225,0.4)',
              }}
            >
              <span className="flex-shrink-0">⚠️</span>
              <span>
                Live weather unavailable for "<strong>{race.location}</strong>" — using a Mild 15°C default.
                Adjust the location and regenerate for precise hydration.
              </span>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              ROW 1  —  Nutrition Summary  ·  Refueling Strategy
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* ── CARD: Nutrition Summary ──────────────────────────────── */}
            <div
              className="summary-card group p-8 flex flex-col gap-5"
              style={{ ...GLASS, borderTop: `3px solid ${BLUE_DEEP}`, ...cardIn(0.16) }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Halo accent={BLUE_DEEP} emoji="🔋" />
                  <div>
                    <p className="text-xl font-black uppercase tracking-wide tabular-nums" style={{ color: BLUE_DEEP }}>
                      Nutrition Summary
                    </p>
                    <p className="text-xs text-gray-500 font-semibold">Total energy breakdown</p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
                  style={{
                    background: BLUE_DEEP,
                    color: 'white',
                    boxShadow: `0 2px 8px ${BLUE_DEEP}44`,
                  }}
                >
                  {plan.fructosePercent > 0 ? '⚡ Dual' : '✓ Single'}&nbsp;Transport
                </span>
              </div>

              {/* Hero calorie number — blue→violet gradient + count-up on load */}
              <div className="text-center py-1">
                <p className="text-[56px] font-black leading-none tabular-nums" style={GRAD_NUM}>
                  <CountUp to={plan.caloriesTotal} duration={900} />
                </p>
                <p className="text-sm font-semibold mt-1.5 text-gray-500">kcal total</p>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5" style={INNER}>
                  <span className="text-base leading-none">⚡</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: BLUE_DEEP }}>{energyPerHour} kcal/h</span>
                  <span className="text-xs text-gray-400">avg energy rate</span>
                </div>
              </div>

              {/* Carbs mini-boxes */}
              <div className="flex gap-3">
                {[
                  { val: plan.carbsPerHour, unit: 'g/h', label: 'carbs / hour' },
                  { val: plan.carbsTotal,   unit: 'g',   label: 'total carbs'  },
                ].map(({ val, unit, label }) => (
                  <div key={label} className="flex-1 p-3 text-center" style={INNER}>
                    <p className="text-2xl font-black tabular-nums leading-tight" style={{ color: BLUE_DEEP }}>
                      {val}
                      <span className="text-sm font-semibold ml-1 text-gray-400">{unit}</span>
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* 100% Carbs note */}
              <div className="flex items-center gap-3 px-3 py-2.5" style={INNER}>
                <div
                  className="w-2 h-8 rounded-full flex-shrink-0"
                  style={{ background: `linear-gradient(180deg, ${BLUE_DEEP}, ${VIOLET})` }}
                />
                <div>
                  <p className="text-xs font-bold" style={{ color: BLUE_DEEP }}>100% Carbohydrates</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">All energy from carbs — ISSN-optimised for glycolytic sport</p>
                </div>
              </div>

              {/* Carbs split bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-600">Carbs split</span>
                  <span className="text-xs text-gray-500 font-semibold">
                    {plan.glucosePercent}% Glucose · {plan.fructosePercent}% Fructose
                  </span>
                </div>
                <div className="flex rounded-full overflow-hidden h-3" style={{ background: 'rgba(0,0,0,0.06)' }}>
                  <div
                    className="h-full"
                    style={{ width: `${plan.glucosePercent}%`, background: `linear-gradient(90deg, ${BLUE_DEEP}, ${VIOLET})` }}
                  />
                  {plan.fructosePercent > 0 && (
                    <div className="h-full" style={{ width: `${plan.fructosePercent}%`, background: '#C4B5FD' }} />
                  )}
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: BLUE }} />
                    Glucose (fast absorb)
                  </span>
                  {plan.fructosePercent > 0 && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ background: '#C4B5FD', border: `1.5px solid ${VIOLET}66` }} />
                      Fructose (slow absorb)
                    </span>
                  )}
                </div>
              </div>

              {/* Strategy note */}
              <p className="text-xs text-gray-400 font-medium italic border-t pt-3 mt-auto"
                style={{ borderColor: `${BLUE}18` }}>
                {plan.fructosePercent > 0
                  ? '⚡ Dual-transporter: glucose + fructose for maximum absorption on long efforts.'
                  : '✓ Single-transporter: 100% glucose — clean and easy on your gut.'}
              </p>
            </div>

            {/* ── CARD: Refueling Strategy ─────────────────────────────── */}
            <div
              className="summary-card group p-8 flex flex-col gap-5"
              style={{ ...GLASS, borderTop: `3px solid ${VIOLET_DEEP}`, ...cardIn(0.20) }}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <Halo accent={VIOLET_DEEP} emoji="🗺️" />
                <div>
                  <p className="text-xl font-black uppercase tracking-wide" style={{ color: VIOLET_DEEP }}>
                    Refueling Strategy
                  </p>
                  <p className="text-xs text-gray-500 font-semibold">Aid station plan</p>
                </div>
              </div>

              {/* Hero numbers — blue→violet gradient + count-up on load */}
              <div className="flex gap-4">
                {[
                  { val: strategy.refuels,   label: 'stops',      dec: 0 },
                  { val: plan.intervalHours, label: 'h interval',  dec: 1 },
                ].map(({ val, label, dec }) => (
                  <div key={label} className="flex-1 p-5 text-center" style={INNER}>
                    <p className="text-[50px] font-black leading-none tabular-nums" style={GRAD_NUM}>
                      <CountUp to={val} duration={600} decimals={dec} />
                    </p>
                    <p className="text-sm font-semibold mt-1.5 text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div>
                <p className="text-xs text-gray-600 font-bold mb-3">Stop timeline</p>
                <div className="flex items-center">
                  {Array.from({ length: maxDots + 1 }).map((_, i) => (
                    <div key={i} className="flex items-center flex-1 last:flex-none">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 border-2"
                        style={{
                          borderColor: VIOLET_DEEP,
                          background:  i === 0 || i === maxDots ? VIOLET_DEEP : 'white',
                          boxShadow:   (i === 0 || i === maxDots)
                            ? `0 0 0 4px ${VIOLET}28`
                            : `0 1px 4px ${VIOLET}20`,
                        }}
                      />
                      {i < maxDots && (
                        <div className="flex-1 h-1 min-w-[4px]"
                          style={{ background: `linear-gradient(90deg, ${BLUE}80, ${VIOLET}40)` }} />
                      )}
                    </div>
                  ))}
                  {strategy.refuels > 9 && (
                    <span className="text-xs font-bold ml-2" style={{ color: VIOLET_DEEP }}>
                      +{strategy.refuels - 9}
                    </span>
                  )}
                </div>
                <div className="flex justify-between mt-2.5">
                  <span className="text-xs text-gray-600 font-bold">🚩 Start</span>
                  <span className="text-xs text-gray-400 font-semibold">every {plan.intervalHours}h</span>
                  <span className="text-xs text-gray-600 font-bold">🏁 Finish</span>
                </div>
              </div>

              {/* Per-stop pills */}
              <div>
                <p className="text-xs text-gray-600 font-bold mb-2.5">Per stop</p>
                <div className="flex gap-2">
                  {[
                    { label: '💧', val: `${plan.perStopHydration.toLocaleString()}`, sub: 'ml water',  color: BLUE_DEEP,   border: `${BLUE}30`   },
                    { label: '🍞', val: `${plan.perStopCarbs}`,                       sub: 'g carbs',   color: VIOLET_DEEP, border: `${VIOLET}30` },
                    { label: '🧂', val: `${plan.perStopSodium.toLocaleString()}`,      sub: 'mg Na⁺',    color: TEAL,        border: `${TEAL}30`   },
                  ].map(({ label, val, sub, color, border }) => (
                    <div key={sub} className="flex-1 px-2.5 py-3 text-center"
                      style={{ ...INNER, border: `1px solid ${border}` }}>
                      <p className="text-sm font-black leading-tight tabular-nums" style={{ color }}>
                        {label} {val}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Race totals */}
              <div className="p-3" style={INNER}>
                <p className="text-xs text-gray-600 font-bold mb-2.5">Race totals</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm font-black tabular-nums" style={{ color: BLUE_DEEP }}>
                      {(plan.hydrationTotal / 1000).toFixed(1)}<span className="text-xs font-semibold ml-0.5" style={{ color: BLUE }}>L</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">total water</p>
                  </div>
                  <div>
                    <p className="text-sm font-black tabular-nums" style={{ color: VIOLET_DEEP }}>
                      {plan.carbsTotal}<span className="text-xs font-semibold ml-0.5" style={{ color: VIOLET }}>g</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">total carbs</p>
                  </div>
                  <div>
                    <p className="text-sm font-black tabular-nums" style={{ color: TEAL }}>
                      {(plan.sodiumTotal / 1000).toFixed(1)}<span className="text-xs font-semibold ml-0.5">g</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">total Na⁺</p>
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div className="flex items-center justify-between border-t pt-3 mt-auto"
                style={{ borderColor: `${VIOLET}20` }}>
                <span className="text-xs text-gray-500 font-semibold">Race objective</span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: VIOLET_DEEP, color: 'white', boxShadow: `0 2px 8px ${VIOLET_DEEP}44` }}>
                  🎯 {strategy.objective}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            RACE SUMMARY — full width
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-6 pb-6">
          <div
            className="summary-card group p-8"
            style={{ ...GLASS, borderTop: `3px solid ${BLUE_DEEP}`, ...cardIn(0.26) }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Halo accent={BLUE_DEEP} emoji="🏔️" />
                <div>
                  <p className="text-xl font-black uppercase tracking-wide" style={{ color: BLUE_DEEP }}>Race Summary</p>
                  <p className="text-xs text-gray-500 font-semibold">
                    {[race.raceName, race.location, `${race.distance} km`, `${race.duration} h`, TERRAIN_LABELS[race.terrain]]
                      .filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>
              {/* Live / estimated weather badge */}
              <span
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: plan.weather.isLive ? 'rgba(34,197,94,0.13)' : `${BLUE}18`,
                  color:      plan.weather.isLive ? '#16A34A' : BLUE_DEEP,
                }}
              >
                {plan.weather.isLive ? (
                  <span className="relative flex w-2 h-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                ) : (
                  <span>🔸</span>
                )}
                {plan.weather.isLive ? 'Live weather' : 'Estimated'}
              </span>
            </div>

            {/* Three sub-cards — semantic colours kept */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl p-5 text-center"
                style={{ background: ic.bg, border: `2px solid ${ic.color}50` }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: ic.color }}>
                  {ic.icon} Intensity
                </p>
                <p className="text-2xl font-black leading-tight" style={{ color: ic.color }}>{intensityLabel}</p>
                <p className="text-xs font-semibold mt-2" style={{ color: ic.color, opacity: 0.85 }}>{ic.desc}</p>
                <p className="text-xs font-medium mt-1 tabular-nums" style={{ color: ic.color, opacity: 0.60 }}>
                  score: {plan.intensityScore}
                </p>
              </div>
              <div className="rounded-2xl p-5 text-center"
                style={{ background: wc.bg, border: `2px solid ${wc.color}50` }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: wc.color }}>
                  {wc.icon} Weather
                </p>
                <p className="text-2xl font-black leading-tight" style={{ color: wc.color }}>{plan.weather.category}</p>
                <p className="text-xs font-semibold mt-2" style={{ color: wc.color, opacity: 0.85 }}>{wc.desc}</p>
                <p className="text-xs font-medium mt-1 tabular-nums" style={{ color: wc.color, opacity: 0.60 }}>
                  {plan.weather.temperature}°C · {plan.weather.isLive ? 'live data' : 'estimated'}
                </p>
              </div>
              <div className="rounded-2xl p-5 text-center"
                style={{ background: `${BLUE}0E`, border: `2px solid ${BLUE_DEEP}44` }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: BLUE_DEEP }}>
                  🎯 Objective
                </p>
                <p className="text-2xl font-black leading-tight" style={{ color: BLUE_DEEP }}>{strategy.objective}</p>
                <p className="text-xs font-semibold text-gray-500 mt-2">
                  {strategy.objective === 'Just finish' ? 'Complete the distance safely' : 'Hit your goal time'}
                </p>
                <p className="text-xs text-gray-400 font-semibold mt-1">race goal</p>
              </div>
            </div>

            {/* Five bottom stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 border-t pt-5"
              style={{ borderColor: `${BLUE}18` }}>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">📏 Distance</p>
                <p className="text-xl font-black tabular-nums" style={{ color: BLUE_DEEP }}>
                  {race.distance}<span className="text-sm font-semibold text-gray-400 ml-1">km</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">⛰️ Elevation</p>
                <p className="text-base font-black tabular-nums leading-tight">
                  <span className="text-green-700">+{race.elevationPos.toLocaleString()}</span>
                  <span className="text-gray-300 mx-1">/</span>
                  <span className="text-red-600">−{race.elevationNeg.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 ml-0.5">m</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5 tabular-nums">
                  {(race.elevationPos / race.distance).toFixed(0)} m/km gain
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">⏱️ Duration</p>
                <p className="text-xl font-black tabular-nums" style={{ color: BLUE_DEEP }}>
                  {race.duration}<span className="text-sm font-semibold text-gray-400 ml-1">hrs</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">🏃 Pace</p>
                <p className="text-xl font-black tabular-nums" style={{ color: BLUE_DEEP }}>
                  {plan.paceKmh}<span className="text-sm font-semibold text-gray-400 ml-1">km/h</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5 tabular-nums">{paceMin}:{paceSec} min/km</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1">🥾 Terrain</p>
                <p className="text-base font-black leading-tight" style={{ color: BLUE_DEEP }}>
                  {TERRAIN_LABELS[race.terrain]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sections below ────────────────────────────────────────────────── */}
        <NutritionTargets plan={plan} race={race} />
        <BrandRecommendations plan={plan} />
        <CompareScenarios plan={plan} />
        <ShareCard plan={plan} race={race} />
        <PDFExportPanel plan={plan} athlete={athlete} race={race} strategy={strategy} />

        <div className="max-w-6xl mx-auto px-6">
          {/* ── Full Plan Data (JSON) ──────────────────────────────────── */}
          <div className="glass-card p-5 mb-6">
            <details>
              <summary className="flex items-center gap-3 cursor-pointer">
                <Halo accent={BLUE} emoji="📋" />
                <span className="font-bold text-gray-800 flex-1">Full Plan Data (JSON)</span>
                <span className="text-xs text-gray-400 font-medium">expand</span>
              </summary>
              <pre
                className="mt-3 text-xs text-gray-600 overflow-auto max-h-64 p-3 rounded-2xl"
                style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
              >
{JSON.stringify({ athlete, race, strategy, weather: plan.weather, nutrition: plan }, null, 2)}
              </pre>
            </details>
          </div>

          {/* ── Back button ───────────────────────────────────────────── */}
          <button
            onClick={onBack}
            className="w-full font-bold py-4 rounded-2xl transition-all hover:scale-[1.01] text-lg text-white"
            style={{
              background:  `linear-gradient(135deg, ${BLUE} 0%, ${VIOLET} 100%)`,
              border:      'none',
              boxShadow:   `0 4px 20px ${BLUE}55`,
            }}
          >
            ← Back to Inputs
          </button>
        </div>

      </div>{/* end cloud atmosphere */}
    </div>
  );
}
