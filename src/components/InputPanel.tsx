import { AthleteProfile, RaceDetails, Strategy, Experience, Sex, Objective } from '../types';

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

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, unit, onChange }: SliderProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-brand-navy">{label}</label>
        <span className="text-sm font-bold text-brand-blue">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        aria-label={label}
      />
    </div>
  );
}

const EXPERIENCE_OPTIONS: Experience[] = ['beginner', 'intermediate', 'advanced', 'elite'];

export default function InputPanel({
  athlete,
  race,
  strategy,
  loading,
  onAthleteChange,
  onRaceChange,
  onStrategyChange,
  onGenerate,
}: InputPanelProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-navy text-center mb-8">Input Your Race Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="font-bold text-brand-navy text-lg mb-4">👤 Athlete Profile</h3>
          <Slider label="Body Weight" value={athlete.weight} min={40} max={120} unit="kg"
            onChange={(v) => onAthleteChange({ ...athlete, weight: v })} />
          <Slider label="Age" value={athlete.age} min={18} max={70} unit="yrs"
            onChange={(v) => onAthleteChange({ ...athlete, age: v })} />
          <div className="mb-4">
            <span className="text-sm font-medium text-brand-navy block mb-2">Sex</span>
            <div className="flex gap-4">
              {(['M', 'F'] as Sex[]).map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sex"
                    value={s}
                    checked={athlete.sex === s}
                    onChange={() => onAthleteChange({ ...athlete, sex: s })}
                    className="accent-brand-blue"
                  />
                  <span className="text-sm">{s === 'M' ? 'Male' : 'Female'}</span>
                </label>
              ))}
            </div>
          </div>
          <Slider label="VO2 Max" value={athlete.vo2max} min={30} max={90} unit="ml/kg/min"
            onChange={(v) => onAthleteChange({ ...athlete, vo2max: v })} />
          <div>
            <label className="text-sm font-medium text-brand-navy block mb-1" htmlFor="experience">
              Experience Level
            </label>
            <select
              id="experience"
              value={athlete.experience}
              onChange={(e) => onAthleteChange({ ...athlete, experience: e.target.value as Experience })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand-blue"
            >
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold text-brand-navy text-lg mb-4">🏔️ Race Details</h3>
          <Slider label="Distance" value={race.distance} min={10} max={500} unit="km"
            onChange={(v) => onRaceChange({ ...race, distance: v })} />
          <Slider label="Elevation Gain" value={race.elevationPos} min={0} max={10000} unit="m"
            onChange={(v) => onRaceChange({ ...race, elevationPos: v })} />
          <Slider label="Elevation Loss" value={race.elevationNeg} min={0} max={10000} unit="m"
            onChange={(v) => onRaceChange({ ...race, elevationNeg: v })} />
          <Slider label="Estimated Finish Time" value={race.duration} min={1} max={48} unit="h"
            onChange={(v) => onRaceChange({ ...race, duration: v })} />
          <div>
            <label className="text-sm font-medium text-brand-navy block mb-1" htmlFor="location">
              📍 Race Location
            </label>
            <input
              id="location"
              type="text"
              value={race.location}
              onChange={(e) => onRaceChange({ ...race, location: e.target.value })}
              placeholder="e.g. Chamonix, Dublin…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand-blue"
            />
            <p className="text-xs text-gray-400 mt-1">Used to fetch live race-day weather</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold text-brand-navy text-lg mb-4">🎯 Strategy</h3>
          <Slider label="Number of Refueling Stops" value={strategy.refuels} min={1} max={20} unit="stops"
            onChange={(v) => onStrategyChange({ ...strategy, refuels: v })} />
          <div>
            <label className="text-sm font-medium text-brand-navy block mb-1" htmlFor="objective">
              Race Objective
            </label>
            <select
              id="objective"
              value={strategy.objective}
              onChange={(e) => onStrategyChange({ ...strategy, objective: e.target.value as Objective })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand-blue"
            >
              <option value="Just finish">Just finish</option>
              <option value="Target time">Target time</option>
            </select>
          </div>
          <div className="mt-6 p-4 bg-brand-light/60 rounded-xl">
            <p className="text-xs text-brand-navy font-semibold mb-2">⚡ How it works</p>
            <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
              <li>Enter your profile &amp; race details</li>
              <li>We fetch real-time weather</li>
              <li>Get a science-based nutrition plan</li>
              <li>Preview &amp; download your race-day PDF</li>
            </ol>
          </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full bg-brand-blue hover:bg-brand-blue-dark disabled:bg-gray-300 text-white font-bold py-5 rounded-2xl text-xl shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed"
      >
        {loading ? '⏳ Fetching weather & calculating…' : '🚀 Generate Nutrition Plan'}
      </button>
    </div>
  );
}
