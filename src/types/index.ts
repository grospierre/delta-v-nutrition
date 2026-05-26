export type Sex = 'M' | 'F';
export type Experience = 'beginner' | 'intermediate' | 'advanced' | 'elite';
export type Objective = 'Just finish' | 'Target time';
export type IntensityLevel = 'easy' | 'moderate' | 'hard' | 'very_hard';
export type TempCategory = 'Cold' | 'Cool' | 'Mild' | 'Warm' | 'Hot';

export interface AthleteProfile {
  weight: number;
  age: number;
  sex: Sex;
  vo2max: number;
  experience: Experience;
}

export interface RaceDetails {
  distance: number;
  elevationPos: number;
  elevationNeg: number;
  duration: number;
  location: string;
}

export interface Strategy {
  refuels: number;
  objective: Objective;
}

export interface WeatherData {
  temperature: number;
  category: TempCategory;
  hydrationCoeff: number;
  sodiumCoeff: number;
  isLive: boolean;
}

export interface NutritionPlan {
  hydrationPerHour: number;
  hydrationTotal: number;
  hydrationRefills: number;
  carbsPerHour: number;
  carbsTotal: number;
  carbsServings: number;
  sodiumPerHour: number;
  sodiumTotal: number;
  sodiumTablets: number;
  caffeineTotal: number;
  caffeineDoses: number;
  caffeineTiming: string;
  caloriesTotal: number;
  glucosePercent: number;
  fructosePercent: number;
  intensityLevel: IntensityLevel;
  intensityScore: number;
  paceKmh: number;
  perStopHydration: number;
  perStopCarbs: number;
  perStopSodium: number;
  intervalHours: number;
  weather: WeatherData;
}

export interface Brand {
  id: string;
  category: 'carbs' | 'sodium' | 'caffeine';
  brand: string;
  name: string;
  carbs: number;
  kcal: number;
  sodium: number;
  rating: number;
  link: string;
  description: string;
  badge: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  source: string;
  rating: number;
  avatar: string;
  race: string;
}

export interface Scenario {
  label: string;
  carbsPerHour: number;
  hydrationPerHour: number;
  sodiumPerHour: number;
  calories: number;
  pros: string[];
  risks: string[];
  bestFor: string;
  color: string;
  isYourPlan: boolean;
}
