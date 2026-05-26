import Testimonials from './Testimonials';

interface HomeProps {
  onStart: () => void;
}

const TRUST_STATS: Array<[string, string]> = [
  ['⚡ 30s', 'to generate'],
  ['🔬 ISSN', 'science-backed'],
  ['🌤️ Live', 'weather data'],
  ['📄 PDF', 'race-day export'],
];

export default function Home({ onStart }: HomeProps) {
  return (
    <div className="min-h-screen animate-fade-in">
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <img src="./delta-v-logo.svg" alt="Delta-V" className="w-28 h-28 mb-6" />
        <h1 className="text-5xl font-black text-brand-navy mb-4 tracking-tight">DELTA-V</h1>
        <p className="text-xl text-brand-blue font-semibold mb-3">Same physics. Different finish line.</p>
        <p className="text-gray-500 max-w-xl mb-10 text-lg leading-relaxed">
          Race-day nutrition planner for ultra-trail runners.
          <br />
          Science-based. Personalized. Ready in 30 seconds.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={onStart}
            className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            🚀 Start Planning
          </button>
          <button
            onClick={onStart}
            className="border-2 border-brand-blue text-brand-blue font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-brand-light transition-all"
          >
            📖 How it works
          </button>
        </div>
        <div className="flex gap-8 mt-14 flex-wrap justify-center">
          {TRUST_STATS.map(([big, small]) => (
            <div key={big} className="text-center">
              <p className="font-bold text-brand-navy text-lg">{big}</p>
              <p className="text-gray-400 text-sm">{small}</p>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />

      <footer className="text-center py-8 px-6 text-gray-400 text-sm border-t border-gray-100">
        <p>⚡ Science-backed (ISSN) · 🔒 No data stored · Built by an ultra-runner</p>
        <p className="mt-1">
          © 2026 Delta-V Nutrition ·{' '}
          <a href="https://github.com/grospierre/delta-v-nutrition" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">GitHub</a>
        </p>
      </footer>
    </div>
  );
}
