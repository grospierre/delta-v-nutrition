import { useState, useEffect, useCallback } from 'react';
import Testimonials from './Testimonials';

interface HomeProps {
  onStart: () => void;
  onHowItWorks: () => void;
}

/* ── Modal IDs ─────────────────────────────────────────────────────────── */
type ModalId = 'how-it-works' | 'issn' | 'weather' | 'pdf';

/* ── Feature definitions ───────────────────────────────────────────────── */
const FEATURES: Array<{ emoji: string; label: string; sub: string; modalId: ModalId }> = [
  { emoji: '⚡',  label: '30s',  sub: 'to generate',    modalId: 'how-it-works' },
  { emoji: '🔬',  label: 'ISSN', sub: 'science-backed', modalId: 'issn'         },
  { emoji: '🌤️', label: 'Live', sub: 'weather data',   modalId: 'weather'      },
  { emoji: '📄',  label: 'PDF',  sub: 'race-day export', modalId: 'pdf'         },
];

/* ══════════════════════════════════════════════════════════════════════════
   MODAL CONTENT
   ══════════════════════════════════════════════════════════════════════════ */

const MODAL_CONTENT: Record<ModalId, React.ReactNode> = {

  /* ── ⚡ How it works ────────────────────────────────────────────────── */
  'how-it-works': (
    <>
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #4169E1 100%)', padding: '32px 28px 28px' }}>
        <p className="text-4xl mb-3">⚡</p>
        <h3 className="text-white font-black text-2xl leading-tight">Ready in 30 Seconds</h3>
        <p className="text-blue-200 text-sm mt-2 leading-relaxed">
          From race profile to science-backed, print-ready plan in three simple steps.
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* Steps */}
        <div className="space-y-3">
          {[
            { n: '01', icon: '📋', title: 'Profile your race',
              desc: 'Enter distance, elevation gain/loss, estimated duration, and your athlete data — weight, age, VO₂max, and digestive tolerance. Under 2 minutes.' },
            { n: '02', icon: '⚙️', title: 'Delta-V calculates',
              desc: 'Our engine cross-references ISSN guidelines with live weather at your race location, terrain type, intensity, and your physiology to build a precision plan.' },
            { n: '03', icon: '📄', title: 'Download & race',
              desc: 'Export a print-ready PDF. Every aid station, every gel, every sip — timed and quantified. No phone required on the start line.' },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 items-start p-4 rounded-xl"
              style={{ background: 'rgba(65,105,225,0.05)', border: '1px solid rgba(65,105,225,0.10)' }}>
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{ background: 'linear-gradient(135deg, #4169E1, #1e3a8a)' }}>
                {s.n}
              </div>
              <div>
                <p className="font-black text-brand-navy text-sm mb-1">{s.icon} {s.title}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature chips */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">What powers your plan</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🔬', text: 'ISSN-aligned formulas' },
              { icon: '🌤️', text: 'Live weather integration' },
              { icon: '🏔️', text: 'Terrain & pace-aware' },
              { icon: '📊', text: 'Per-stop aid breakdown' },
              { icon: '☕', text: 'Caffeine timing protocol' },
              { icon: '📱', text: 'PDF export for race day' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 p-3 rounded-xl text-xs font-semibold text-brand-navy"
                style={{ background: 'rgba(65,105,225,0.06)', border: '1px solid rgba(65,105,225,0.08)' }}>
                <span className="text-base">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  ),

  /* ── 🔬 ISSN ────────────────────────────────────────────────────────── */
  issn: (
    <>
      <div style={{ background: 'linear-gradient(135deg, #001f3f 0%, #1e3a8a 100%)', padding: '32px 28px 28px' }}>
        <p className="text-4xl mb-3">🔬</p>
        <h3 className="text-white font-black text-2xl leading-tight">ISSN Science-Backed</h3>
        <p className="text-blue-200 text-sm mt-2 leading-relaxed">
          Guidelines from the International Society of Sports Nutrition — the gold standard in evidence-based sports nutrition research since 2003.
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* Credibility chips */}
        <div className="flex gap-2 flex-wrap">
          {['Est. 2003', '8 000+ members', '2 peer-reviewed journals', '200+ position papers'].map((chip) => (
            <span key={chip} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(65,105,225,0.10)', color: '#1e3a8a' }}>
              {chip}
            </span>
          ))}
        </div>

        {/* Key guidelines */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Key Guidelines Applied</p>
          <div className="space-y-2">
            {[
              { color: '#3b82f6', icon: '🍞', metric: '60–90 g/h',    label: 'Carbohydrates',
                detail: '2:1 glucose-to-fructose ratio to saturate both intestinal transporters simultaneously' },
              { color: '#0891b2', icon: '💧', metric: '400–800 ml/h', label: 'Hydration',
                detail: 'Scaled to body weight, ambient temperature, and exercise intensity' },
              { color: '#d97706', icon: '🧂', metric: '300–1000 mg/h',label: 'Sodium',
                detail: 'Adjusted for sweat rate, heat exposure, and total race duration' },
              { color: '#7c3aed', icon: '☕', metric: '3–6 mg/kg',    label: 'Caffeine',
                detail: 'Timed to the second half of the effort for maximum cognitive and performance effect' },
            ].map((g) => (
              <div key={g.label} className="flex gap-3 items-start p-3.5 rounded-xl"
                style={{ background: 'rgba(0,0,0,0.025)', border: '1px solid rgba(0,0,0,0.07)' }}>
                <span className="shrink-0 text-[10px] font-black px-2.5 py-1.5 rounded-lg text-white text-center min-w-[72px]"
                  style={{ background: g.color }}>
                  {g.icon} {g.metric}
                </span>
                <div>
                  <p className="text-xs font-black text-gray-900">{g.label}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{g.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* References */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Primary References</p>
          <div className="space-y-2">
            {[
              ['Jeukendrup A.', '2014',
               'A step towards personalized sports nutrition',
               'Sports Medicine'],
              ['Thomas DT, Erdman KA, Burke LM.', '2016',
               'ISSN Position Stand: Nutrition & Athletic Performance',
               'J Int Soc Sports Nutr'],
              ['Vitale K, Getzin A.', '2019',
               'Nutrition and supplement update for the endurance athlete',
               'Nutrients'],
              ['Stellingwerff T et al.', '2011',
               'Optimizing carbohydrate oxidation rates and performance with ingestion of multiple transportable carbohydrates',
               'Am J Clin Nutr'],
            ].map(([authors, year, title, journal]) => (
              <div key={title} className="text-[11px] leading-relaxed p-3 rounded-xl"
                style={{ background: 'rgba(65,105,225,0.04)', border: '1px solid rgba(65,105,225,0.09)' }}>
                <span className="font-black text-brand-navy">{authors} </span>
                <span className="text-gray-400">({year}). </span>
                <span className="text-gray-700 italic">{title}. </span>
                <span className="font-semibold text-brand-blue">{journal}.</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  ),

  /* ── 🌤️ Weather ─────────────────────────────────────────────────────── */
  weather: (
    <>
      <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', padding: '32px 28px 28px' }}>
        <p className="text-4xl mb-3">🌤️</p>
        <h3 className="text-white font-black text-2xl leading-tight">Live Weather Integration</h3>
        <p className="text-blue-100 text-sm mt-2 leading-relaxed">
          Real-time forecast fetched for your race location and woven directly into every calculation — hydration, sodium, and caloric targets all adapt.
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* Flow */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">How It Works</p>
          <div className="flex items-stretch gap-1.5">
            {[
              { icon: '📍', label: 'Race\nlocation' },
              { icon: '🌐', label: 'Open-Meteo\nAPI' },
              { icon: '🧮', label: 'Coefficients\napplied' },
              { icon: '📋', label: 'Your\nplan' },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-1.5 flex-1">
                <div className="flex-1 text-center p-2.5 rounded-xl"
                  style={{ background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.16)' }}>
                  <p className="text-xl mb-1">{step.icon}</p>
                  <p className="font-bold text-gray-800 text-[10px] leading-tight whitespace-pre-line">{step.label}</p>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-gray-400 text-xs font-bold shrink-0">›</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Impact matrix */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Weather Impact on Your Plan</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: '🌡️', condition: 'Hot  >28 °C',
                effects: ['+20 % hydration', '+20 % sodium'],
                color: '#dc2626', bg: 'rgba(220,38,38,0.05)', border: 'rgba(220,38,38,0.14)' },
              { icon: '❄️',  condition: 'Cold  <5 °C',
                effects: ['−10 % hydration', '+5 % caloric need'],
                color: '#0284c7', bg: 'rgba(2,132,199,0.05)', border: 'rgba(2,132,199,0.14)' },
              { icon: '🌬️', condition: 'Strong wind',
                effects: ['+8 % calories', '+10 % effort load'],
                color: '#7c3aed', bg: 'rgba(124,58,237,0.05)', border: 'rgba(124,58,237,0.14)' },
              { icon: '⛰️', condition: 'Altitude  >2 000 m',
                effects: ['+10 % hydration', '+5 % calories'],
                color: '#059669', bg: 'rgba(5,150,105,0.05)', border: 'rgba(5,150,105,0.14)' },
            ].map((w) => (
              <div key={w.condition} className="p-3.5 rounded-xl"
                style={{ background: w.bg, border: `1px solid ${w.border}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl leading-none">{w.icon}</span>
                  <p className="text-[11px] font-black leading-tight" style={{ color: w.color }}>{w.condition}</p>
                </div>
                {w.effects.map((e) => (
                  <p key={e} className="text-[11px] font-bold text-gray-700 leading-snug">▸ {e}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Source callout */}
        <div className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(2,132,199,0.06)', border: '1px solid rgba(2,132,199,0.15)' }}>
          <span className="text-2xl shrink-0">🌐</span>
          <div>
            <p className="text-xs font-black text-gray-900">Open-Meteo API</p>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
              Free & open-source · No API key · Hourly forecasts · Global coverage · WMO-validated data
            </p>
          </div>
        </div>
      </div>
    </>
  ),

  /* ── 📄 PDF ─────────────────────────────────────────────────────────── */
  pdf: (
    <>
      <div style={{ background: 'linear-gradient(135deg, #047857 0%, #0f766e 100%)', padding: '32px 28px 28px' }}>
        <p className="text-4xl mb-3">📄</p>
        <h3 className="text-white font-black text-2xl leading-tight">Race-Day PDF Export</h3>
        <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
          Your complete nutrition plan, formatted for print. Works offline — no phone signal required at the start line.
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* Mock PDF */}
        <div className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(0,0,0,0.11)', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
          {/* Browser chrome bar */}
          <div className="px-4 py-2 flex items-center gap-2"
            style={{ background: '#f1f5f9', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <div className="flex gap-1.5">
              {['#f87171','#fbbf24','#4ade80'].map((c) => (
                <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <p className="text-[10px] text-gray-400 font-medium mx-auto">Delta-V_Race_Plan.pdf</p>
          </div>
          {/* Page content */}
          <div className="p-4 space-y-3" style={{ background: 'white' }}>
            <div className="flex items-end justify-between pb-2" style={{ borderBottom: '2px solid #1e3a8a' }}>
              <div>
                <p className="text-[11px] font-black text-brand-navy tracking-widest uppercase">DELTA-V</p>
                <p className="text-[9px] text-gray-500 mt-0.5">Race Nutrition Plan</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-700">UTMB · 170 km</p>
                <p className="text-[9px] text-gray-500">Est. 28 h · Chamonix · +10 100 m</p>
              </div>
            </div>
            {/* Metrics row */}
            <div className="grid grid-cols-4 gap-1.5">
              {[['💧','3.2 L','Hydration'],['🍞','340 g','Carbs'],['🧂','6 800 mg','Sodium'],['☕','200 mg','Caffeine']].map(([e,v,l]) => (
                <div key={l as string} className="text-center py-2 rounded-lg" style={{ background: 'rgba(65,105,225,0.07)' }}>
                  <p className="text-sm leading-none">{e}</p>
                  <p className="text-[10px] font-black text-brand-navy mt-1">{v}</p>
                  <p className="text-[8px] text-gray-500 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            {/* Aid station rows */}
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1 mb-1">
                {['Segment','Carbs / Fluid','Sodium'].map((h) => (
                  <p key={h} className="text-[9px] font-black text-gray-400 uppercase tracking-wide">{h}</p>
                ))}
              </div>
              {[
                ['KM 0–25',  '2×gels · 500 ml', '300 mg'],
                ['KM 25–50', '3×gels · 600 ml', '400 mg'],
                ['KM 50–75', '2×gels+cookie · 500 ml', '350 mg'],
              ].map(([km,c,s]) => (
                <div key={km} className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded-lg text-[9px]"
                  style={{ background: '#f8fafc' }}>
                  <span className="font-bold text-gray-800">{km}</span>
                  <span className="text-gray-600">{c}</span>
                  <span className="text-gray-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">What's Included</p>
          <div className="space-y-2">
            {[
              'Race overview & environmental conditions',
              'Hourly carb, hydration & sodium targets',
              'Per-stop aid station breakdown',
              'Caffeine timing protocol',
              'Brand recommendations & shopping list',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-xs text-gray-700">
                <span className="text-green-500 font-black text-base leading-none shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export steps */}
        <div className="rounded-xl p-4 space-y-2.5"
          style={{ background: 'rgba(4,120,87,0.05)', border: '1px solid rgba(4,120,87,0.15)' }}>
          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">How to Export</p>
          {[
            'Complete the 2-minute input form',
            'Review your generated nutrition plan',
            'Click "Export PDF" on the results page',
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                style={{ background: '#047857' }}>
                {i + 1}
              </span>
              <p className="text-xs text-gray-700">{step}</p>
            </div>
          ))}
        </div>

      </div>
    </>
  ),
};

/* ── Staggered entrance ────────────────────────────────────────────────── */
const stagger = (delayMs: number): React.CSSProperties => ({
  animation: 'slideUp 0.48s cubic-bezier(0.22,1,0.36,1) both',
  animationDelay: `${delayMs}ms`,
});

/* ══════════════════════════════════════════════════════════════════════════
   Modal component
   ══════════════════════════════════════════════════════════════════════════ */
function Modal({ id, onClose }: { id: ModalId; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  /* Body scroll intentionally NOT locked — page scrolls freely behind modal */

  return (
    <div
      /* Mobile: sheet slides up from bottom edge, no side padding          */
      /* sm+: centred with side padding so card floats in the viewport       */
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: 'rgba(0,10,30,0.60)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        /* Mobile: full width, rounded top corners only (sheet style)        */
        /* sm+: constrained width, fully rounded                             */
        /* flex-col + overflow-hidden lets the inner scroller fill correctly */
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden relative flex flex-col"
        style={{
          background: 'white',
          boxShadow: '0 28px 72px rgba(0,0,0,0.32), 0 4px 20px rgba(65,105,225,0.16)',
          animation: 'modalIn 0.32s cubic-bezier(0.22,1,0.36,1) both',
          maxHeight: '90vh',        /* outer cap — never taller than 90% of viewport */
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile visual hint) */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Scrollable body — flex-1 fills remaining height, scrolls internally */}
        <div className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}>
          {MODAL_CONTENT[id]}
        </div>

        {/* Close button — absolutely positioned over the gradient header     */}
        {/* Always visible because it's relative to the outer (non-scrolling) div */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all text-lg font-bold z-20"
          style={{ background: 'rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.90)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.36)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)'; }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Home
   ══════════════════════════════════════════════════════════════════════════ */
export default function Home({ onStart, onHowItWorks: _onHowItWorks }: HomeProps) {
  const [clicking, setClicking]       = useState(false);
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const closeModal = useCallback(() => setActiveModal(null), []);

  function handleStart() {
    if (clicking) return;
    setClicking(true);
    setTimeout(() => { setClicking(false); onStart(); }, 360);
  }

  return (
    <div
      className="relative animate-fade-in"
      style={{
        backgroundImage: 'url(/mont-blanc-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Photo overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,15,40,0.50) 0%, rgba(0,15,40,0.34) 55%, rgba(0,15,40,0.54) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">

        <style>{`
          @keyframes btnPop {
            0%   { transform: scale(1); }
            35%  { transform: scale(1.06); }
            70%  { transform: scale(0.97); }
            100% { transform: scale(1); }
          }
          @keyframes logoReveal {
            from { opacity: 0; transform: scale(0.96) translateY(8px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);   }
          }
          .hero-glass {
            transition: transform 0.34s cubic-bezier(0.22,1,0.36,1),
                        box-shadow  0.34s cubic-bezier(0.22,1,0.36,1);
          }
          .hero-glass:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 48px 0 rgba(65,105,225,0.22),
                        inset 0 2px 4px 0 rgba(255,255,255,0.60);
          }
          .hero-logo {
            animation: logoReveal 0.56s cubic-bezier(0.22,1,0.36,1) both;
            animation-delay: 30ms;
          }
          .btn-hero-primary {
            background: linear-gradient(to right, #2563eb, #1d4ed8);
            transition: all 0.3s ease-out;
          }
          .btn-hero-primary:hover {
            background: linear-gradient(to right, #1d4ed8, #1e40af);
            box-shadow: 0 8px 24px rgba(65,105,225,0.45);
            transform: translateY(-2px);
          }
          .btn-hero-primary:active { transform: scale(0.97); }
          .btn-hero-secondary { transition: all 0.3s ease-out; }
          .btn-hero-secondary:hover {
            background: rgba(239,246,255,0.60);
            box-shadow: 0 6px 20px rgba(65,105,225,0.18);
            transform: translateY(-2px);
          }
          .btn-hero-secondary:active { transform: scale(0.97); }
          .feat-badge {
            cursor: pointer;
            border-radius: 12px;
            padding: 6px 4px;
            transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          }
          .feat-badge:hover {
            transform: translateY(-3px);
            background: rgba(65,105,225,0.08);
            box-shadow: 0 6px 18px rgba(65,105,225,0.14);
          }
          .feat-badge:active { transform: translateY(0); }
        `}</style>

        <div className="flex flex-col items-center gap-5 w-full max-w-2xl">

          {/* ══ Hero card ══════════════════════════════════════════════════ */}
          <div
            className="hero-glass relative overflow-hidden w-full rounded-3xl p-10 border backdrop-blur-xl"
            style={{
              background: 'rgba(255,255,255,0.48)',
              borderColor: 'rgba(255,255,255,0.30)',
              boxShadow: '0 8px 32px 0 rgba(65,105,225,0.18), inset 0 2px 4px 0 rgba(255,255,255,0.50)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.40) 0%, transparent 50%, rgba(219,234,254,0.20) 100%)' }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center text-center">

              <p className="text-lg font-black text-blue-600 tracking-widest uppercase mb-2" style={stagger(60)}>
                Same physics. Different finish line.
              </p>

              <p className="text-base text-gray-700 font-bold mb-6"
                style={{ ...stagger(200), lineHeight: '1.75' }}>
                Race-day nutrition planner for ultra-trail runners.
                <br />
                Science-based. Personalized. Ready in 30 seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full" style={stagger(270)}>
                <button
                  onClick={handleStart}
                  className="btn-hero-primary flex-1 text-white font-semibold py-3 px-6 rounded-xl text-base"
                  style={clicking ? { animation: 'btnPop 0.38s ease-in-out' } : undefined}
                >
                  🚀 Start Planning
                </button>
                <button
                  onClick={() => setActiveModal('how-it-works')}
                  className="btn-hero-primary flex-1 text-white font-semibold py-3 px-6 rounded-xl text-base"
                >
                  📖 How it works
                </button>
              </div>

            </div>
          </div>

          {/* ══ Feature bar ════════════════════════════════════════════════ */}
          <div
            className="w-full rounded-2xl border backdrop-blur-lg"
            style={{
              background: 'rgba(255,255,255,0.48)',
              borderColor: 'rgba(255,255,255,0.32)',
              boxShadow: '0 4px 16px rgba(65,105,225,0.10)',
              padding: '12px 24px',
              animation: 'slideUp 0.52s cubic-bezier(0.22,1,0.36,1) both',
              animationDelay: '320ms',
            }}
          >
            <div className="grid grid-cols-4 gap-2">
              {FEATURES.map((f) => (
                <button
                  key={f.label}
                  className="feat-badge text-center"
                  onClick={() => setActiveModal(f.modalId)}
                  title={`Learn more about ${f.label}`}
                >
                  <p className="text-xl leading-none mb-2">{f.emoji}</p>
                  <p className="text-xs font-black text-gray-900 leading-tight">{f.label}</p>
                  <p className="text-[10px] font-bold text-gray-800 mt-0.5 leading-tight">{f.sub}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <div className="relative z-10">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'rgba(255,255,255,0.18)' }}
          aria-hidden="true"
        />
        <Testimonials />
        <div className="h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,10,30,0.45))' }}
          aria-hidden="true"
        />
      </div>

      {/* ── MODALS ────────────────────────────────────────────────────────── */}
      {activeModal && <Modal id={activeModal} onClose={closeModal} />}
    </div>
  );
}
