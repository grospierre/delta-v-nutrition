import { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import LoadingScreen from './components/LoadingScreen';
import { AthleteProfile, RaceDetails, Strategy, NutritionPlan } from './types';
import { DEFAULT_ATHLETE, DEFAULT_RACE, DEFAULT_STRATEGY } from './utils/constants';
import { fetchWeather } from './utils/weather';
import { calculateNutrition } from './utils/calculations';

type Page = 'home' | 'input' | 'output';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [athlete, setAthlete] = useState<AthleteProfile>(DEFAULT_ATHLETE);
  const [race, setRace] = useState<RaceDetails>(DEFAULT_RACE);
  const [strategy, setStrategy] = useState<Strategy>(DEFAULT_STRATEGY);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const weather = await fetchWeather(race.location);
      const nutrition = calculateNutrition(athlete, race, strategy, weather);
      setPlan(nutrition);
      setPage('output');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header onLogoClick={() => setPage('home')} />
      {loading && <LoadingScreen />}
      {!loading && page === 'home' && <Home onStart={() => setPage('input')} />}
      {!loading && page === 'input' && (
        <InputPanel
          athlete={athlete}
          race={race}
          strategy={strategy}
          loading={loading}
          onAthleteChange={setAthlete}
          onRaceChange={setRace}
          onStrategyChange={setStrategy}
          onGenerate={handleGenerate}
        />
      )}
      {!loading && page === 'output' && plan && (
        <OutputPanel
          plan={plan}
          athlete={athlete}
          race={race}
          strategy={strategy}
          onBack={() => setPage('input')}
        />
      )}
    </div>
  );
}
