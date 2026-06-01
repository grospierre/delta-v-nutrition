import { useState, useEffect } from 'react';
import { AthleteProfile, RaceDetails, Strategy, Experience, Sex, Objective, DigestiveTolerance, TerrainType, Autonomy, CaffeineStrategy } from '../types';

interface InputPanelProps {
  athlete: AthleteProfile;
  race: RaceDetails;
  strategy: Strategy;
  loading: boolean;
  onAthleteChange: (a: AthleteProfile) => void;
  onRaceChange: (r: RaceDetails) => void;
  onStrategyChange: (s: Strategy) => void;
  onGenerate: () => void;
}

// ── Shared input class strings ────────────────────────────────────────────────
const BASE_INPUT = [
  'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-brand-navy bg-white',
  'placeholder:text-gray-300 placeholder:font-normal',
  'focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-[rgba(65,105,225,0.15)]',
  'hover:border-blue-200 transition-colors duration-150',
].join(' ');

const NUM_INPUT = [
  BASE_INPUT,
  'pr-14',
  '[appearance:textfield]',
  '[&::-webkit-outer-spin-button]:appearance-none',
  '[&::-webkit-inner-spin-button]:appearance-none',
].join(' ');

// ── Optional badge ────────────────────────────────────────────────────────────
function OptionalBadge() {
  return (
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-full">
      optional
    </span>
  );
}

// ── Number input component ────────────────────────────────────────────────────
interface NumProps {
  label: string;
  value: number;
  placeholder: string;
  unit: string;
  min?: number;
  max?: number;
  hint?: string;
  optional?: boolean;
  onChange: (v: number) => void;
}

function NumInput({ label, value, placeholder, unit, min, max, hint, optional, onChange }: NumProps) {
  const [raw, setRaw] = useState(value > 0 ? String(value) : '');

  // Sync from parent when value changes externally (e.g. after clamping)
  useEffect(() => {
    setRaw(value > 0 ? String(value) : '');
  }, [value]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-bold text-brand-navy">{label}</span>
        {optional && <OptionalBadge />}
      </div>
      <div className="relative">
        <input
          type="number"
          value={raw}
          placeholder={placeholder}
          min={min}
          max={max}
          onChange={(e) => {
            const str = e.target.value;
            setRaw(str);
            const n = parseFloat(str);
            if (!isNaN(n) && n > 0) onChange(n);
          }}
          onBlur={() => {
            const n = parseFloat(raw);
            if (isNaN(n) || n <= 0) {
              // Revert to last valid value
              setRaw(value > 0 ? String(value) : '');
            } else {
              const clamped = Math.min(max ?? Infinity, Math.max(min ?? 0, n));
              setRaw(String(clamped));
              if (clamped !== value) onChange(clamped);
            }
          }}
          className={NUM_INPUT}
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none select-none">
          {unit}
        </span>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ── Text input component ──────────────────────────────────────────────────────
interface TextProps {
  label: string;
  value: string;
  placeholder: string;
  hint?: string;
  optional?: boolean;
  onChange: (v: string) => void;
}

function TextInput({ label, value, placeholder, hint, optional, onChange }: TextProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-bold text-brand-navy">{label}</span>
        {optional && <OptionalBadge />}
      </div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={BASE_INPUT}
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ── Slider — VO2 Max, RHR, Refueling stops ───────────────────────────────────
// All sliders share the same dark-blue fill colour for visual consistency.
const SLIDER_DARK = '#1E3A8A';   // blue-900 — track fill + thumb + badge

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  hint?: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, unit, hint, onChange }: SliderProps) {
  // Percentage filled — drives the two-tone track gradient
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-bold text-brand-navy">{label}</span>
        <span
          className="text-sm font-black px-2.5 py-0.5 rounded-full tabular-nums"
          style={{ background: `${SLIDER_DARK}18`, color: SLIDER_DARK }}
        >
          {value}<span className="text-xs font-semibold ml-1">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer slider-dark"
        style={{
          background: `linear-gradient(to right, ${SLIDER_DARK} ${pct}%, #DBEAFE ${pct}%)`,
        }}
        aria-label={label}
      />
      {hint && <p className="text-xs text-gray-800 font-medium mt-1">{hint}</p>}
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function InputCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div
      className="input-card rounded-2xl p-6 flex flex-col h-full"
      style={{
        background: 'rgba(255,255,255,0.90)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14)',
        border: '1px solid rgba(255,255,255,0.9)',
      }}
    >
      <h3 className="font-black text-brand-navy text-lg mb-5 flex items-center gap-2">
        <span className="icon-pop text-xl">{icon}</span>
        <span>{title}</span>
      </h3>
      <div className="space-y-5 flex-1">{children}</div>
    </div>
  );
}

// ── Field pair grid ───────────────────────────────────────────────────────────
function FieldPair({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {children}
    </div>
  );
}

const EXPERIENCE_OPTIONS: Experience[] = ['beginner', 'intermediate', 'advanced', 'elite'];
const EXPERIENCE_LABELS: Record<Experience, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
  elite:        'Elite',
};

const TOLERANCE_OPTIONS: Array<{ value: DigestiveTolerance; label: string }> = [
  { value: 'none',               label: 'No restrictions' },
  { value: 'gluten-free',        label: 'Gluten-free' },
  { value: 'lactose-free',       label: 'Lactose-free' },
  { value: 'fructose-sensitive', label: 'Fructose sensitive' },
];

const TERRAIN_OPTIONS: Array<{ value: TerrainType; label: string }> = [
  { value: 'technical-trail', label: 'Technical Trail' },
  { value: 'rolling-path',    label: 'Rolling Path' },
  { value: 'road',            label: 'Road' },
];

const AUTONOMY_OPTIONS: Array<{ value: Autonomy; label: string }> = [
  { value: 'self-supported', label: 'Self-supported' },
  { value: 'assistance',     label: 'Assistance' },
];

const CAFFEINE_OPTIONS: Array<{ value: CaffeineStrategy; label: string }> = [
  { value: 'none',  label: 'No caffeine' },
  { value: 'start', label: 'At race start (100 mg)' },
  { value: 'mid',   label: 'Mid-race boost (100 mg)' },
  { value: 'split', label: 'Split doses (50 mg × 2)' },
];

export default function InputPanel({
  athlete, race, strategy, loading,
  onAthleteChange, onRaceChange, onStrategyChange, onGenerate,
}: InputPanelProps) {
  const [clicking, setClicking] = useState(false);

  function handleGenerate() {
    if (loading || clicking) return;
    setClicking(true);
    setTimeout(() => setClicking(false), 450);
    onGenerate();
  }

  return (
    <>
      <style>{`
        @keyframes btnPop {
          0%   { transform: scale(1);    box-shadow: 0 4px 20px rgba(65,105,225,0.35); }
          35%  { transform: scale(1.04); box-shadow: 0 10px 40px rgba(65,105,225,0.70); }
          70%  { transform: scale(0.98); box-shadow: 0 4px 22px rgba(65,105,225,0.45); }
          100% { transform: scale(1);    box-shadow: 0 4px 20px rgba(65,105,225,0.35); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40%            { transform: scale(1.0); opacity: 1;   }
        }
      `}</style>

      {/* ── Full-page background wrapper ──────────────────────────────────── */}
      <div
        className="relative animate-fade-in"
        style={{
          backgroundImage: 'url(/input-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,15,40,0.58) 0%, rgba(0,10,30,0.42) 50%, rgba(0,15,40,0.62) 100%)',
          }}
          aria-hidden="true"
        />

        {/* ── Content layer ─────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

          {/* Page title */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
              Input Your Race Details
            </h2>
            <p className="text-blue-100/80 text-sm mt-2 drop-shadow-sm">
              Fill in your profile, race specs and strategy — we'll do the rest.
            </p>
          </div>

          {/* ── Three cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* ══ CARD 1: Athlete Profile ══════════════════════════════════ */}
            <InputCard title="Athlete Profile" icon="👤">

              <FieldPair>
                <NumInput
                  label="Weight"
                  value={athlete.weight}
                  placeholder="e.g. 75"
                  unit="kg"
                  min={40} max={150}
                  onChange={(v) => onAthleteChange({ ...athlete, weight: v })}
                />
                <NumInput
                  label="Age"
                  value={athlete.age}
                  placeholder="e.g. 28"
                  unit="yrs"
                  min={18} max={100}
                  onChange={(v) => onAthleteChange({ ...athlete, age: v })}
                />
              </FieldPair>

              {/* Sex — styled toggle buttons */}
              <div>
                <span className="text-sm font-bold text-brand-navy block mb-1.5">Sex</span>
                <div className="flex gap-2">
                  {(['M', 'F'] as Sex[]).map((s) => (
                    <label
                      key={s}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 cursor-pointer transition-all select-none"
                      style={{
                        borderColor: athlete.sex === s ? '#4169E1' : 'transparent',
                        background:  athlete.sex === s ? 'rgba(65,105,225,0.09)' : 'rgba(0,0,0,0.04)',
                        color:       athlete.sex === s ? '#4169E1' : '#6B7280',
                      }}
                    >
                      <input
                        type="radio"
                        name="sex"
                        value={s}
                        checked={athlete.sex === s}
                        onChange={() => onAthleteChange({ ...athlete, sex: s })}
                        className="sr-only"
                      />
                      <span className="text-base leading-none">{s === 'M' ? '♂' : '♀'}</span>
                      <span className="text-sm font-bold">{s === 'M' ? 'Male' : 'Female'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* VO2 Max — slider kept per spec */}
              <Slider
                label="VO2 Max"
                value={athlete.vo2max}
                min={30} max={90}
                unit="ml/kg/min"
                hint="Your aerobic capacity — affects calorie burn rate"
                onChange={(v) => onAthleteChange({ ...athlete, vo2max: v })}
              />

              {/* Resting Heart Rate */}
              <Slider
                label="Resting Heart Rate (RHR)"
                value={athlete.rhr}
                min={35} max={100}
                unit="bpm"
                hint="Lower RHR indicates stronger cardiovascular fitness"
                onChange={(v) => onAthleteChange({ ...athlete, rhr: v })}
              />

              <div>
                <span className="text-sm font-bold text-brand-navy block mb-1.5">Experience Level</span>
                <select
                  value={athlete.experience}
                  onChange={(e) => onAthleteChange({ ...athlete, experience: e.target.value as Experience })}
                  className={BASE_INPUT + ' cursor-pointer'}
                >
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{EXPERIENCE_LABELS[o]}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-sm font-bold text-brand-navy block mb-1.5">Digestive Tolerance</span>
                <select
                  value={athlete.digestiveTolerance}
                  onChange={(e) => onAthleteChange({ ...athlete, digestiveTolerance: e.target.value as DigestiveTolerance })}
                  className={BASE_INPUT + ' cursor-pointer'}
                >
                  {TOLERANCE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {athlete.digestiveTolerance !== 'none' && (
                  <p className="text-xs text-brand-blue mt-1 font-medium">
                    {athlete.digestiveTolerance === 'fructose-sensitive'
                      ? '⚠️ Fructose-heavy gels will be flagged in recommendations'
                      : `✓ ${athlete.digestiveTolerance === 'gluten-free' ? 'Gluten-free' : 'Lactose-free'} products will be prioritised`}
                  </p>
                )}
              </div>

            </InputCard>

            {/* ══ CARD 2: Race Details ════════════════════════════════════ */}
            <InputCard title="Race Details" icon="🏔️">

              <TextInput
                label="🏁 Race Name"
                value={race.raceName ?? ''}
                placeholder="e.g. Ultra-Trail du Mont-Blanc"
                hint="Displayed on your plan header"
                optional
                onChange={(v) => onRaceChange({ ...race, raceName: v })}
              />

              <FieldPair>
                <NumInput
                  label="Distance"
                  value={race.distance}
                  placeholder="e.g. 50"
                  unit="km"
                  min={1} max={500}
                  onChange={(v) => onRaceChange({ ...race, distance: v })}
                />
                <NumInput
                  label="Duration"
                  value={race.duration}
                  placeholder="e.g. 7"
                  unit="h"
                  min={1} max={60}
                  hint="Estimated finish time"
                  onChange={(v) => onRaceChange({ ...race, duration: v })}
                />
              </FieldPair>

              <FieldPair>
                <NumInput
                  label="Elevation ↑"
                  value={race.elevationPos}
                  placeholder="e.g. 2500"
                  unit="m"
                  min={0}
                  onChange={(v) => onRaceChange({ ...race, elevationPos: v })}
                />
                <NumInput
                  label="Elevation ↓"
                  value={race.elevationNeg}
                  placeholder="e.g. 2500"
                  unit="m"
                  min={0}
                  onChange={(v) => onRaceChange({ ...race, elevationNeg: v })}
                />
              </FieldPair>

              <TextInput
                label="📍 Race Location"
                value={race.location}
                placeholder="e.g. Chamonix, Dublin…"
                hint="Used to fetch live race-day weather 🌤️"
                onChange={(v) => onRaceChange({ ...race, location: v })}
              />

              <div>
                <span className="text-sm font-bold text-brand-navy block mb-1.5">Terrain Type</span>
                <select
                  value={race.terrain}
                  onChange={(e) => onRaceChange({ ...race, terrain: e.target.value as TerrainType })}
                  className={BASE_INPUT + ' cursor-pointer'}
                >
                  {TERRAIN_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

            </InputCard>

            {/* ══ CARD 3: Strategy ════════════════════════════════════════ */}
            <InputCard title="Strategy" icon="🎯">

              {/* Refueling — slider kept per spec */}
              <Slider
                label="Refueling Stops"
                value={strategy.refuels}
                min={1} max={20}
                unit="stops"
                hint="Number of aid stations you'll use"
                onChange={(v) => onStrategyChange({ ...strategy, refuels: v })}
              />

              <div>
                <span className="text-sm font-bold text-brand-navy block mb-1.5">Race Objective</span>
                <select
                  value={strategy.objective}
                  onChange={(e) => onStrategyChange({ ...strategy, objective: e.target.value as Objective })}
                  className={BASE_INPUT + ' cursor-pointer'}
                >
                  <option value="Just finish">Just finish</option>
                  <option value="Target time">Target time</option>
                </select>
              </div>

              <NumInput
                label="💶 Nutrition Budget"
                value={strategy.budget ?? 0}
                placeholder="e.g. 80"
                unit="€"
                min={0}
                hint="Helps tailor product recommendations"
                optional
                onChange={(v) => onStrategyChange({ ...strategy, budget: v })}
              />

              <div>
                <span className="text-sm font-bold text-brand-navy block mb-1.5">Autonomy</span>
                <select
                  value={strategy.autonomy}
                  onChange={(e) => onStrategyChange({ ...strategy, autonomy: e.target.value as Autonomy })}
                  className={BASE_INPUT + ' cursor-pointer'}
                >
                  {AUTONOMY_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-sm font-bold text-brand-navy block mb-1.5">☕ Caffeine Strategy</span>
                <select
                  value={strategy.caffeineStrategy ?? 'mid'}
                  onChange={(e) => onStrategyChange({ ...strategy, caffeineStrategy: e.target.value as CaffeineStrategy })}
                  className={BASE_INPUT + ' cursor-pointer'}
                >
                  {CAFFEINE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {strategy.caffeineStrategy !== 'none' && (
                  <p className="text-xs text-brand-blue mt-1 font-medium">
                    ☕ Caffeine shown in output — ISSN recommends 3–6 mg/kg body weight
                  </p>
                )}
              </div>

            </InputCard>

          </div>

          {/* ── Generate button ──────────────────────────────────────────── */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={clicking && !loading ? { animation: 'btnPop 0.45s ease-in-out' } : undefined}
            className="btn-breathe w-full bg-brand-blue hover:bg-brand-blue-dark disabled:bg-gray-300 text-white font-bold py-5 rounded-2xl text-xl transition-all hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:animate-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block w-2 h-2 bg-white rounded-full"
                      style={{ animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </span>
                Fetching weather &amp; calculating…
              </span>
            ) : (
              '🚀 Generate Nutrition Plan'
            )}
          </button>

          {/* Bottom breathing room */}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}
