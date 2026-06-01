import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AboutModal from './components/AboutModal';
import PrivacyModal from './components/PrivacyModal';
import Home from './components/Home';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import LoadingScreen from './components/LoadingScreen';
import { AthleteProfile, RaceDetails, Strategy, NutritionPlan } from './types';
import { DEFAULT_ATHLETE, DEFAULT_RACE, DEFAULT_STRATEGY } from './utils/constants';
import { fetchWeather } from './utils/weather';
import { calculateNutrition } from './utils/calculations';

type Page = 'home' | 'input' | 'output';

// Per-page gradient — applied fixed so it stays put while scrolling.
// Output page uses a full-page sky gradient that mimics the mountain photo palette.
const PAGE_BG: Record<Page, string> = {
  home:   'linear-gradient(180deg, #F8FCFF 0%, #E8F3FC 35%, #D8EAF8 68%, #CAE0F4 100%)',
  input:  'linear-gradient(155deg, #F0F4FF 0%, #DBEAFE 52%, #D1FAE5 100%)',
  // Deep blue sky (top) → soft cloud white (bottom) — mirrors the mountain photo palette.
  // Extra intermediate stops are added for a perfectly smooth, banding-free blend.
  output: [
    'linear-gradient(180deg,',
    '  #1B3A6B  0%,',   // deep blue sky
    '  #2C5185 10%,',   // blue sky
    '  #3A6098 18%,',   // mid blue
    '  #5279AA 28%,',   // steel blue
    '  #6B92C4 38%,',   // lighter blue
    '  #8AAECE 48%,',   // hazy blue
    '  #A9C4DE 58%,',   // pale blue haze
    '  #C3D7EB 68%,',   // misty blue
    '  #DCE7F0 78%,',   // misty white-blue
    '  #EAF0F6 88%,',   // near-white blue
    '  #F2F5F9 100%)',  // soft cloud white
  ].join(' '),
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'howItWorks' | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
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
    <div
      id="app-root"
      className="min-h-screen flex flex-col"
      style={{
        background: PAGE_BG[page],
        backgroundAttachment: 'fixed',  // fixed on all pages — sky stays behind content
      }}
    >
      <Header onLogoClick={() => setPage('home')} />
      <main className="flex-1">
        {loading && <LoadingScreen />}
        {!loading && page === 'home' && (
          <Home
            onStart={() => setPage('input')}
            onHowItWorks={() => setChatMode('howItWorks')}
          />
        )}
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
      </main>
      <Footer onOpenAbout={() => setAboutOpen(true)} onOpenPrivacy={() => setPrivacyOpen(true)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        onStart={() => { setAboutOpen(false); setPage('input'); }}
      />
      <ChatBot
        triggerMode={chatMode}
        onTriggerConsumed={() => setChatMode(null)}
      />
    </div>
  );
}
