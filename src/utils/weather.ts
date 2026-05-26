import axios from 'axios';
import { WeatherData, TempCategory } from '../types';

interface CategoryConfig {
  category: TempCategory;
  hydrationCoeff: number;
  sodiumCoeff: number;
}

function categorize(temp: number): CategoryConfig {
  if (temp < 10) return { category: 'Cold', hydrationCoeff: 0.85, sodiumCoeff: 0.9 };
  if (temp < 15) return { category: 'Cool', hydrationCoeff: 0.95, sodiumCoeff: 0.95 };
  if (temp < 20) return { category: 'Mild', hydrationCoeff: 1.0, sodiumCoeff: 1.0 };
  if (temp < 25) return { category: 'Warm', hydrationCoeff: 1.15, sodiumCoeff: 1.1 };
  return { category: 'Hot', hydrationCoeff: 1.3, sodiumCoeff: 1.25 };
}

function buildWeather(temp: number, isLive: boolean): WeatherData {
  const cfg = categorize(temp);
  return {
    temperature: Math.round(temp),
    category: cfg.category,
    hydrationCoeff: cfg.hydrationCoeff,
    sodiumCoeff: cfg.sodiumCoeff,
    isLive,
  };
}

const FALLBACK: WeatherData = buildWeather(15, false);

export async function fetchWeather(city: string): Promise<WeatherData> {
  const trimmed = city.trim();
  if (!trimmed) return FALLBACK;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const geo = await axios.get(
      'https://geocoding-api.open-meteo.com/v1/search',
      {
        params: { name: trimmed, count: 1, language: 'en', format: 'json' },
        signal: controller.signal,
      },
    );

    const result = geo.data?.results?.[0];
    if (!result) {
      clearTimeout(timeout);
      return FALLBACK;
    }

    const { latitude, longitude } = result;
    const forecast = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: { latitude, longitude, current_weather: true },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const temp = forecast.data?.current_weather?.temperature;
    if (typeof temp !== 'number' || Number.isNaN(temp)) return FALLBACK;

    return buildWeather(temp, true);
  } catch {
    clearTimeout(timeout);
    return FALLBACK;
  }
}
