import {
  AthleteProfile,
  RaceDetails,
  Strategy,
  WeatherData,
  NutritionPlan,
  IntensityLevel,
  Scenario,
} from '../types';

const round1 = (n: number): number => Math.round(n * 10) / 10;

interface IntensityResult {
  level: IntensityLevel;
  score: number;
  paceKmh: number;
}

function computeIntensity(race: RaceDetails): IntensityResult {
  const paceKmh = race.distance / race.duration;
  const elevationIndex = (race.elevationPos + race.elevationNeg) / race.distance;
  const score = paceKmh + elevationIndex * 5;

  let level: IntensityLevel;
  if (score < 4) level = 'easy';
  else if (score < 6) level = 'moderate';
  else if (score < 8) level = 'hard';
  else level = 'very_hard';

  return { level, score: round1(score), paceKmh: round1(paceKmh) };
}

const HYDRATION_INTENSITY: Record<IntensityLevel, number> = {
  easy: 0.9,
  moderate: 1.0,
  hard: 1.1,
  very_hard: 1.2,
};

const CARBS_INTENSITY: Record<IntensityLevel, number> = {
  easy: 0.75,
  moderate: 1.0,
  hard: 1.2,
  very_hard: 1.35,
};

const CARBS_EXPERIENCE: Record<AthleteProfile['experience'], number> = {
  beginner: 0.7,
  intermediate: 1.0,
  advanced: 1.15,
  elite: 1.3,
};

const SODIUM_EXPERIENCE: Record<AthleteProfile['experience'], number> = {
  beginner: 0.8,
  intermediate: 1.0,
  advanced: 1.1,
  elite: 1.2,
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** +5 % hydration on technical trail, −5 % on road */
const TERRAIN_HYDRATION_COEFF: Record<string, number> = {
  'technical-trail': 1.05,
  'rolling-path':    1.00,
  'road':            0.95,
};

/** Caffeine plan per strategy choice */
const CAFFEINE_CFG: Record<string, { total: number; doses: number; timing: string }> = {
  none:  { total: 0,   doses: 0, timing: 'None planned' },
  start: { total: 100, doses: 1, timing: 'At race start' },
  mid:   { total: 100, doses: 1, timing: 'Mid-race boost' },
  split: { total: 100, doses: 2, timing: 'Split doses (50 mg × 2)' },
};

export function calculateNutrition(
  athlete: AthleteProfile,
  race: RaceDetails,
  strategy: Strategy,
  weather: WeatherData,
): NutritionPlan {
  const { level, score, paceKmh } = computeIntensity(race);

  // FIX 3 — terrain affects hydration (+5 % technical, −5 % road)
  const terrainCoeff = TERRAIN_HYDRATION_COEFF[race.terrain] ?? 1.0;

  const hydrationPerHour = clamp(
    8 * athlete.weight * weather.hydrationCoeff * HYDRATION_INTENSITY[level] * terrainCoeff,
    400,
    900,
  );
  const hydrationTotal = Math.round(hydrationPerHour * race.duration);
  const hydrationRefills = Math.ceil(hydrationTotal / 500);

  // FIX 2 — fructose-sensitive athletes are capped at 60 g/h (single-transporter max)
  const isFructoseSensitive = athlete.digestiveTolerance === 'fructose-sensitive';
  const rawCarbsPerHour = Math.min(
    90,
    0.6 * athlete.weight * CARBS_INTENSITY[level] * CARBS_EXPERIENCE[athlete.experience],
  );
  const carbsPerHour = isFructoseSensitive ? Math.min(60, rawCarbsPerHour) : rawCarbsPerHour;
  const carbsTotal = Math.round(carbsPerHour * race.duration);
  const carbsServings = Math.ceil(carbsTotal / 25);

  const sodiumPerHour = clamp(
    400 * weather.sodiumCoeff * SODIUM_EXPERIENCE[athlete.experience],
    300,
    1200,
  );
  const sodiumTotal = Math.round(sodiumPerHour * race.duration);
  const sodiumTablets = Math.ceil(sodiumTotal / 500);

  // FIX 1 — caffeine driven by strategy choice
  const caffCfg = CAFFEINE_CFG[strategy.caffeineStrategy ?? 'mid'];
  const caffeineTotal  = caffCfg.total;
  const caffeineDoses  = caffCfg.doses;
  const caffeineTiming = caffCfg.timing;

  const caloriesTotal = Math.round(carbsTotal * 4);

  // FIX 2 — glucose/fructose split: fructose-sensitive → always 100% glucose
  const glucosePercent  = (isFructoseSensitive || carbsPerHour < 60) ? 100 : 80;
  const fructosePercent = 100 - glucosePercent;

  const intervalHours = round1(race.duration / strategy.refuels);
  const perStopHydration = Math.round(hydrationTotal / strategy.refuels);
  const perStopCarbs = Math.round(carbsTotal / strategy.refuels);
  const perStopSodium = Math.round(sodiumTotal / strategy.refuels);

  return {
    hydrationPerHour: round1(hydrationPerHour),
    hydrationTotal,
    hydrationRefills,
    carbsPerHour: round1(carbsPerHour),
    carbsTotal,
    carbsServings,
    sodiumPerHour: round1(sodiumPerHour),
    sodiumTotal,
    sodiumTablets,
    caffeineTotal,
    caffeineDoses,
    caffeineTiming,
    caloriesTotal,
    glucosePercent,
    fructosePercent,
    intensityLevel: level,
    intensityScore: score,
    paceKmh,
    perStopHydration,
    perStopCarbs,
    perStopSodium,
    intervalHours,
    weather,
  };
}

export function getScenarios(base: NutritionPlan): Scenario[] {
  return [
    {
      label: 'Conservative',
      carbsPerHour: round1(base.carbsPerHour * 0.8),
      hydrationPerHour: round1(base.hydrationPerHour * 0.85),
      sodiumPerHour: round1(base.sodiumPerHour * 0.85),
      calories: Math.round(base.caloriesTotal * 0.8),
      pros: ['Light on the stomach', 'Low GI-distress risk', 'Lower product cost'],
      risks: ['Bonk risk late race', 'Energy crash after ~5h', 'May hit the wall'],
      bestFor: 'First ultra · GI-sensitive runners · very hot days',
      color: '#f39c12',
      isYourPlan: false,
    },
    {
      label: 'Balanced (Your Plan)',
      carbsPerHour: base.carbsPerHour,
      hydrationPerHour: base.hydrationPerHour,
      sodiumPerHour: base.sodiumPerHour,
      calories: base.caloriesTotal,
      pros: ['Science-backed (ISSN)', 'Optimal absorption', 'Balanced risk profile'],
      risks: ['None identified for most runners'],
      bestFor: 'Most runners · all conditions · balanced prep',
      color: '#4169E1',
      isYourPlan: true,
    },
    {
      label: 'Aggressive',
      carbsPerHour: round1(Math.min(90, base.carbsPerHour * 1.2)),
      hydrationPerHour: round1(Math.min(900, base.hydrationPerHour * 1.15)),
      sodiumPerHour: round1(Math.min(1200, base.sodiumPerHour * 1.15)),
      calories: Math.round(base.caloriesTotal * 1.2),
      pros: ['Maximum available energy', 'Strong bonk protection', 'Best for performance goals'],
      risks: ['Higher GI-stress risk', 'Heavier carry load', 'Higher product cost'],
      bestFor: 'Experienced athletes · flat/fast courses · chasing a time',
      color: '#27ae60',
      isYourPlan: false,
    },
  ];
}

export function getHydrationSeries(plan: NutritionPlan, durationHours: number): Array<{ h: string; ml: number }> {
  const hours = Math.max(1, Math.ceil(durationHours));
  return Array.from({ length: hours }, (_, i) => ({
    h: `${i + 1}h`,
    ml: plan.hydrationPerHour,
  }));
}

export function getSodiumSeries(plan: NutritionPlan, durationHours: number): Array<{ h: string; mg: number }> {
  const hours = Math.max(1, Math.ceil(durationHours));
  return Array.from({ length: hours }, (_, i) => ({
    h: `${i + 1}h`,
    mg: Math.round(plan.sodiumPerHour * (i + 1)),
  }));
}

export function getCarbsSplit(plan: NutritionPlan): Array<{ name: string; value: number }> {
  return [
    { name: 'Glucose', value: plan.glucosePercent },
    { name: 'Fructose', value: plan.fructosePercent },
  ];
}
