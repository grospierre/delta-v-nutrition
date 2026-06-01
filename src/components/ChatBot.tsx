import { useState, useRef, useEffect, useCallback } from 'react';

// ─── FAQ data — categorised ────────────────────────────────────────────────────
interface FAQItem     { q: string; a: string; }
interface FAQCategory { id: string; icon: string; label: string; items: FAQItem[]; }

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'about', icon: '🏔️', label: 'About Delta-V',
    items: [
      { q: 'What is Delta-V?',
        a: 'Delta-V is a science-based nutrition planner for ultra-trail runners. We apply ISSN research, real-time weather, and your personal physiology to generate a complete race-day fuelling strategy — in 30 seconds.' },
      { q: 'How does Delta-V work?',
        a: 'You enter your athlete profile (weight, age, VO₂max, RHR), race details (distance, elevation, terrain), and strategy. We fetch live weather for your race location and compute hydration, carb, sodium and caffeine targets using ISSN guidelines.' },
      { q: 'Who created Delta-V?',
        a: 'Delta-V was built by an ultra-trail runner frustrated with one-size-fits-all nutrition advice. The calculation engine is grounded in peer-reviewed sports science from the International Society of Sports Nutrition.' },
      { q: 'Is Delta-V free?',
        a: 'Yes — completely free, with no account required. All calculations happen in your browser. No subscription, no paywall, no ads.' },
    ],
  },
  {
    id: 'science', icon: '🔬', label: 'Nutrition & Science',
    items: [
      { q: 'Why is nutrition important in ultra-trail?',
        a: 'During a multi-hour ultra, glycogen depletion is inevitable without exogenous carbohydrates. Incorrect fuelling leads to bonking, GI distress, hyponatraemia, or cramping — all race-enders. Precision nutrition can be the difference between finishing and DNF.' },
      { q: 'What is ISSN?',
        a: 'The International Society of Sports Nutrition (ISSN) is the world\'s leading body for peer-reviewed sports nutrition research. They publish evidence-based position stands on carbohydrate intake, hydration, sodium, and caffeine that Delta-V uses as its calculation backbone.' },
      { q: 'How do you calculate nutrition needs?',
        a: 'We combine your intensity score (derived from pace, VO₂max, and terrain), race duration, and body weight with ISSN targets: 60–90 g carbs/h, 400–800 ml fluid/h, 300–1000 mg sodium/h, and 3–6 mg caffeine/kg. Weather coefficients adjust hydration and sodium dynamically.' },
      { q: "What's the science behind your recommendations?",
        a: 'Key references: Jeukendrup (2014) on personalised sports nutrition, Thomas et al. (2016) ISSN Position Stand on athletic performance, and Vitale & Getzin (2019) on endurance athlete supplements. All accessible via PubMed.' },
      { q: 'What if I have dietary restrictions?',
        a: 'Set your digestive tolerance in the Athlete Profile (gluten-free, lactose-free, or fructose-sensitive). Delta-V adjusts brand recommendations accordingly and flags products that fit your restrictions.' },
    ],
  },
  {
    id: 'weather', icon: '🌤️', label: 'Weather & Adaptation',
    items: [
      { q: 'How does weather affect my nutrition plan?',
        a: 'Temperature is the biggest lever: above 20 °C, hydration targets rise 10 %; above 28 °C, both hydration and sodium targets rise 20 %. Wind increases caloric expenditure. Altitude above 2 000 m raises fluid losses and caloric needs.' },
      { q: 'Can I adjust my plan on race day?',
        a: 'Always. Delta-V is a science-backed starting point, not a rigid script. If you feel early signs of cramping, increase sodium. Feeling full? Back off gels slightly. Train with the plan in advance to calibrate your personal response.' },
      { q: 'What if weather changes before the race?',
        a: 'Regenerate your plan on race morning — we fetch a fresh forecast every time. Your targets will update automatically to reflect the actual race-day conditions.' },
      { q: 'How do temperature changes affect hydration?',
        a: 'Every 5 °C above 20 °C adds approximately 5–10 % to your sweat rate. Delta-V uses a graduated coefficient so a 30 °C race generates meaningfully different targets than a 15 °C one. Humidity compounds the effect.' },
    ],
  },
  {
    id: 'products', icon: '🛍️', label: 'Products & Brands',
    items: [
      { q: 'Which brands do you recommend?',
        a: 'We curate Maurten (high-density carbs), Science in Sport Beta Fuel (2:1 ratio), Tailwind (all-in-one), Naak (real-food), Liquid IV (hot-weather sodium), Nuun (budget electrolytes), and GU Roctane (caffeine). All matched to your specific targets.' },
      { q: 'Can I use different products than suggested?',
        a: 'Absolutely. The brand recommendations are a convenience layer. What matters is hitting your carb, hydration, and sodium numbers — use whatever products your gut tolerates and your budget allows.' },
      { q: 'How do I find products on a budget?',
        a: "Nuun Sport tablets are the most cost-effective electrolyte option. For carbs, SiS Beta Fuel offers the best value per gram among the 2:1 glucose-fructose products. Many runners also use real food (dates, rice cakes) to supplement gels." },
      { q: 'Are all products tested?',
        a: 'The brands we recommend have NSF Certified for Sport or Informed Sport certification, meaning they\'ve been third-party tested for banned substances. Always check current certification status before an A-race.' },
    ],
  },
  {
    id: 'planning', icon: '🏁', label: 'Race Planning',
    items: [
      { q: 'How long does it take to generate a plan?',
        a: 'Under 30 seconds. The form takes 1–2 minutes to fill in, then we fetch live weather and run all calculations instantly. No waiting, no loading screens.' },
      { q: 'Can I save multiple race plans?',
        a: 'Delta-V is session-based (no accounts), so plans exist while the page is open. Use the PDF export to save each plan permanently — you can generate one for every race on your calendar and store the PDFs.' },
      { q: 'What races can Delta-V help with?',
        a: 'Any distance from a marathon upward, including trail ultras, mountain marathons, sky races, and multi-stage events. The engine adapts to road terrain, rolling path, and technical trail for accurate intensity scoring.' },
      { q: 'How detailed is the nutrition plan?',
        a: 'Very. You get hourly targets for carbs, hydration, sodium, and caffeine, PLUS a per-stop breakdown showing exactly what to consume at each aid station or refuel point, brand recommendations with serving counts, and a full PDF to carry on race day.' },
    ],
  },
  {
    id: 'privacy', icon: '🔒', label: 'Data & Privacy',
    items: [
      { q: 'Is my data stored?',
        a: 'No. Delta-V is 100 % client-side. Your athlete profile and race details never leave your browser — there is no server, no database, no account, no tracking.' },
      { q: 'How do you handle my personal information?',
        a: 'We don\'t handle it — because we never receive it. All computations run locally in your browser. Closing the tab clears everything. No cookies beyond standard browser behaviour.' },
      { q: 'Can I export my plan?',
        a: 'Yes. Hit "Export PDF" on the results page and a fully formatted race-day plan downloads instantly to your device. No email required, no sign-up.' },
      { q: 'Is the PDF shareable?',
        a: 'Of course — it\'s just a file. Share it with your crew chief, pacer, coach, or print it and tape it to your race vest. It contains your full per-stop breakdown so anyone supporting you knows exactly what to prepare.' },
    ],
  },
  {
    id: 'technical', icon: '💻', label: 'Technical',
    items: [
      { q: 'What devices can I use Delta-V on?',
        a: 'Any modern device with a browser — phone, tablet, or desktop. The UI is fully responsive. iOS Safari, Chrome on Android, Firefox, and Edge are all supported.' },
      { q: 'Do I need internet during the race?',
        a: "No. Once you've generated your plan and downloaded the PDF, you're completely offline-independent. Carry the PDF on your phone or print it — no connectivity needed on course." },
      { q: 'Can I use Delta-V offline?',
        a: 'The plan generation requires a one-time internet connection (to fetch live weather). Once generated and exported to PDF, everything works offline. We recommend generating your plan 24 h before the race.' },
      { q: 'How often is the app updated?',
        a: 'Continuously. The nutrition calculation engine is reviewed against new ISSN position stands and updated whenever significant research is published. Check the GitHub repository for changelog details.' },
    ],
  },
  {
    id: 'support', icon: '🆘', label: 'Troubleshooting',
    items: [
      { q: 'What if I forgot my plan?',
        a: 'Simply regenerate it — input the same race details and your plan will be recalculated identically (weather may vary slightly if conditions changed). This is why we recommend exporting the PDF as soon as your plan is ready.' },
      { q: 'Can I modify the PDF?',
        a: 'The downloaded PDF is a standard file — you can annotate it in any PDF editor (Preview on Mac, Adobe Acrobat, Notability on iPad). Useful for adding crew instructions or personal notes.' },
      { q: 'What if the app crashes or freezes?',
        a: 'Hard-refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows). Since there\'s no server state, a refresh is instant recovery with no data loss concern. If the problem persists, try clearing browser cache.' },
      { q: 'How do I contact support?',
        a: 'Open an issue on the Delta-V GitHub repository or reach out via the contact form on the website. For urgent race-day questions, the FAQ here covers the most common scenarios.' },
    ],
  },
];

// ─── Per-category visual styles ───────────────────────────────────────────────
interface CatStyle { gradient: string; borderColor: string; textColor: string; bgLight: string; }

const CAT_STYLES: Record<string, CatStyle> = {
  about:    { gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', borderColor: '#3b82f6', textColor: '#1e3a8a', bgLight: 'rgba(59,130,246,0.07)'   },
  science:  { gradient: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)', borderColor: '#a855f7', textColor: '#6b21a8', bgLight: 'rgba(168,85,247,0.07)'  },
  weather:  { gradient: 'linear-gradient(135deg, #075985 0%, #38bdf8 100%)', borderColor: '#0ea5e9', textColor: '#075985', bgLight: 'rgba(14,165,233,0.07)'   },
  products: { gradient: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)', borderColor: '#f59e0b', textColor: '#78350f', bgLight: 'rgba(245,158,11,0.09)'   },
  planning: { gradient: 'linear-gradient(135deg, #9f1239 0%, #f43f5e 100%)', borderColor: '#f43f5e', textColor: '#9f1239', bgLight: 'rgba(244,63,94,0.07)'    },
  privacy:  { gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)', borderColor: '#10b981', textColor: '#065f46', bgLight: 'rgba(16,185,129,0.07)'   },
  technical:{ gradient: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)', borderColor: '#6366f1', textColor: '#3730a3', bgLight: 'rgba(99,102,241,0.07)'   },
  support:  { gradient: 'linear-gradient(135deg, #c2410c 0%, #fb923c 100%)', borderColor: '#fb923c', textColor: '#c2410c', bgLight: 'rgba(251,146,60,0.09)'   },
};

// ─── How it works steps ────────────────────────────────────────────────────────
interface HowItWorksStep { icon: string; title: string; desc: string; }

const HOW_IT_WORKS: HowItWorksStep[] = [
  { icon: '👤', title: 'Enter your athlete profile',
    desc: 'Your weight, age, sex, VO₂ max and experience level help us personalise your fueling needs.' },
  { icon: '🏔️', title: 'Input race details',
    desc: 'Distance, elevation gain/loss, estimated finish time and location — we use all of this to size your nutrition needs.' },
  { icon: '🎯', title: 'Adjust your strategy',
    desc: 'Set your refueling stops and race objective — finishing comfortably or chasing a target time.' },
  { icon: '⚡', title: 'Get your personalised plan',
    desc: 'Science-backed hydration, carb, sodium and caffeine targets per the ISSN guidelines, adjusted for live race-day weather at your location.' },
  { icon: '📄', title: 'Download as PDF & share',
    desc: 'Export your complete race-day nutrition plan as a PDF and share it with your crew, pacer or coach.' },
];

// ─── Props & message types ─────────────────────────────────────────────────────
interface ChatBotProps {
  triggerMode?: 'howItWorks' | null;
  onTriggerConsumed?: () => void;
}

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  steps?: HowItWorksStep[];
}

// ─── Runner avatar SVG ────────────────────────────────────────────────────────
function RunnerAvatar({ size = 64, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"
      style={animate ? { animation: 'botBounce 1.8s ease-in-out infinite' } : undefined}
      aria-label="Delta-V assistant">
      <circle cx="40" cy="40" r="38" fill="white" opacity="0.15" />
      <circle cx="40" cy="18" r="9" fill="#fcd5a8" stroke="#e8b88a" strokeWidth="1" />
      <path d="M31 16 Q40 7 49 16" fill="white" opacity="0.9" />
      <rect x="30" y="15" width="20" height="3" rx="1.5" fill="white" opacity="0.7" />
      <path d="M28 18 Q40 14 52 18" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
      <rect x="34" y="27" width="12" height="16" rx="4" fill="white" opacity="0.9" />
      <rect x="44" y="28" width="8" height="13" rx="3" fill="white" opacity="0.7" />
      <rect x="45" y="30" width="6" height="3" rx="1" fill="white" opacity="0.4" />
      <line x1="34" y1="30" x2="24" y2="40" stroke="#fcd5a8" strokeWidth="4" strokeLinecap="round"
        style={{ transformOrigin: '34px 30px', animation: animate ? 'armSwingL 0.9s ease-in-out infinite alternate' : undefined }} />
      <line x1="46" y1="30" x2="56" y2="24" stroke="#fcd5a8" strokeWidth="4" strokeLinecap="round"
        style={{ transformOrigin: '46px 30px', animation: animate ? 'armWave 1.4s ease-in-out infinite' : undefined }} />
      <circle cx="57" cy="23" r="3" fill="#fcd5a8"
        style={{ animation: animate ? 'armWave 1.4s ease-in-out infinite' : undefined, transformOrigin: '46px 30px' }} />
      <line x1="37" y1="43" x2="30" y2="58" stroke="#fcd5a8" strokeWidth="4" strokeLinecap="round"
        style={{ transformOrigin: '37px 43px', animation: animate ? 'legSwingL 0.9s ease-in-out infinite alternate' : undefined }} />
      <ellipse cx="28" cy="60" rx="5" ry="3" fill="white" opacity="0.85"
        style={{ transformOrigin: '37px 43px', animation: animate ? 'legSwingL 0.9s ease-in-out infinite alternate' : undefined }} />
      <line x1="43" y1="43" x2="50" y2="58" stroke="#fcd5a8" strokeWidth="4" strokeLinecap="round"
        style={{ transformOrigin: '43px 43px', animation: animate ? 'legSwingR 0.9s ease-in-out infinite alternate' : undefined }} />
      <ellipse cx="52" cy="60" rx="5" ry="3" fill="white" opacity="0.85"
        style={{ transformOrigin: '43px 43px', animation: animate ? 'legSwingR 0.9s ease-in-out infinite alternate' : undefined }} />
      <line x1="18" y1="64" x2="62" y2="64" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
    </svg>
  );
}

// ─── Welcome message ──────────────────────────────────────────────────────────
const WELCOME_MSG: Message = {
  id: 0,
  role: 'bot',
  text: "👋 Hey! I'm your Delta-V assistant. Browse a category below or ask me anything about race-day nutrition!",
};

// ─── Gradients ────────────────────────────────────────────────────────────────
const G_HEADER = 'linear-gradient(135deg, #001f3f 0%, #2a4bbd 55%, #6b40b0 100%)';
const G_PANEL  = 'linear-gradient(135deg, #4169E1 0%, #7C5ACE 100%)';
const G_USER   = 'linear-gradient(135deg, #4169E1 0%, #7C5ACE 100%)';

// ─── Main component ───────────────────────────────────────────────────────────
export default function ChatBot({ triggerMode = null, onTriggerConsumed }: ChatBotProps = {}) {
  const [open, setOpen]               = useState(false);
  const [messages, setMessages]       = useState<Message[]>([WELCOME_MSG]);
  const [nodding, setNodding]         = useState(false);
  const [openCat, setOpenCat]         = useState<string | null>(null);
  const bottomRef                     = useRef<HTMLDivElement>(null);
  const nextId                        = useRef(1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const triggerNod = useCallback(() => {
    setNodding(true);
    setTimeout(() => setNodding(false), 1200);
  }, []);

  useEffect(() => {
    if (!triggerMode) return;
    if (triggerMode === 'howItWorks') {
      const bid = nextId.current++;
      setMessages([
        WELCOME_MSG,
        { id: bid, role: 'bot', text: "Here's how Delta-V works in 5 simple steps 👇", steps: HOW_IT_WORKS },
      ]);
      setOpen(true);
      triggerNod();
    }
    onTriggerConsumed?.();
  }, [triggerMode]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFAQ(q: string, a: string) {
    const uid = nextId.current++;
    const bid = nextId.current++;
    setMessages((prev) => [
      ...prev,
      { id: uid, role: 'user', text: q },
      { id: bid, role: 'bot',  text: a },
    ]);
    triggerNod();
  }

  function toggleCat(id: string) {
    setOpenCat((prev) => (prev === id ? null : id));
  }

  return (
    <>
      {/* ── Keyframes ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes botBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes botNod {
          0%, 100% { transform: rotate(0deg); }
          25%       { transform: rotate(8deg); }
          75%       { transform: rotate(-4deg); }
        }
        @keyframes armSwingL {
          from { transform: rotate(-20deg); }
          to   { transform: rotate(20deg); }
        }
        @keyframes armWave {
          0%, 100% { transform: rotate(0deg); }
          30%      { transform: rotate(-30deg); }
          60%      { transform: rotate(10deg); }
        }
        @keyframes legSwingL {
          from { transform: rotate(-18deg); }
          to   { transform: rotate(18deg); }
        }
        @keyframes legSwingR {
          from { transform: rotate(18deg); }
          to   { transform: rotate(-18deg); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);    opacity: 0.55; }
          100% { transform: scale(1.62); opacity: 0; }
        }
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes catExpand {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chatbot-panel { animation: chatSlideIn 0.32s cubic-bezier(0.22, 1, 0.36, 1); }
        .faq-card {
          border-top: 1px solid rgba(0,0,0,0.05);
          border-right: 1px solid rgba(0,0,0,0.05);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.13s ease, box-shadow 0.15s ease;
        }
        .faq-card:hover {
          transform: translateX(4px);
          box-shadow: 2px 3px 10px rgba(0,0,0,0.09);
        }
        .cat-questions { animation: catExpand 0.22s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      {/* ── Floating trigger button ─────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1">
        {!open && (
          <div className="absolute inset-0 rounded-full"
            style={{ background: G_PANEL, animation: 'pulseRing 2.2s ease-out infinite' }} />
        )}
        {!open && (
          <div className="absolute -top-9 right-0 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap shadow-lg"
            style={{ background: G_HEADER, animation: 'botBounce 2.4s ease-in-out infinite' }}>
            Ask me anything 💬
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close chat' : 'Open chat'}
          className="relative rounded-full border-[3px] border-white transition-transform hover:scale-110 active:scale-95"
          style={{ background: G_PANEL, padding: 6,
            boxShadow: '0 8px 28px rgba(65,105,225,0.45), 0 2px 8px rgba(124,90,206,0.30)' }}
        >
          {open
            ? <span className="text-white font-black text-xl w-12 h-12 flex items-center justify-center">✕</span>
            : <RunnerAvatar size={60} animate />
          }
        </button>
      </div>

      {/* ── Chat panel ──────────────────────────────────────────────────── */}
      {open && (
        <div
          className="chatbot-panel fixed bottom-24 right-4 z-40 w-[340px] sm:w-[380px] rounded-3xl"
          style={{
            background: G_PANEL, padding: '1.5px',
            boxShadow: '0 24px 64px rgba(65,105,225,0.32), 0 6px 24px rgba(124,90,206,0.22), 0 1px 4px rgba(0,0,0,0.10)',
            maxHeight: '76vh', display: 'flex', flexDirection: 'column',
          }}
        >
          <div className="flex flex-col rounded-[22px] overflow-hidden"
            style={{ background: '#ffffff', flex: 1, minHeight: 0 }}>

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ background: G_HEADER }}>
              <div style={{ animation: nodding ? 'botNod 0.4s ease-in-out 3' : undefined }}>
                <RunnerAvatar size={40} animate />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">Delta-V Assistant</p>
                <p className="text-blue-200/80 text-xs mt-0.5">Science-backed nutrition 🏔️</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close"
                className="w-7 h-7 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/15 transition-all text-sm font-bold flex-shrink-0">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[80px]"
              style={{ background: '#fafbff' }}>
              {messages.map((msg) => (
                <div key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ background: G_PANEL, flexShrink: 0 }}>
                      <RunnerAvatar size={22} />
                    </div>
                  )}
                  <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={msg.role === 'user'
                      ? { background: G_USER, color: 'white', borderTopRightRadius: 4, boxShadow: '0 2px 10px rgba(65,105,225,0.25)' }
                      : { background: '#ffffff', color: '#1a1a2e', borderTopLeftRadius: 4, border: '1px solid rgba(65,105,225,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
                    }>
                    {msg.text}
                    {msg.steps && (
                      <div className="mt-2.5 space-y-2">
                        {msg.steps.map((step, i) => (
                          <div key={i} className="flex gap-2.5 rounded-xl p-2.5"
                            style={{ background: 'linear-gradient(135deg, rgba(65,105,225,0.07), rgba(124,90,206,0.06))', border: '1px solid rgba(65,105,225,0.14)' }}>
                            <span className="text-base leading-none mt-0.5 flex-shrink-0">{step.icon}</span>
                            <div>
                              <p className="text-xs font-bold text-brand-navy">
                                <span className="text-brand-blue mr-1">Step {i + 1}</span>{step.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* ── FAQ — categorised accordion ──────────────────────────── */}
            <div className="flex-shrink-0 overflow-y-auto"
              style={{
                maxHeight: '252px',
                background: '#f8f9ff',
                borderTop: '1px solid rgba(65,105,225,0.10)',
              }}>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-4 pt-3 pb-2">
                Browse topics
              </p>

              <div className="px-2 pb-3 space-y-1.5">
                {FAQ_CATEGORIES.map((cat) => {
                  const isOpen = openCat === cat.id;
                  const cs: CatStyle = CAT_STYLES[cat.id] ?? CAT_STYLES['about'];
                  return (
                    <div key={cat.id} className="rounded-xl overflow-hidden"
                      style={{
                        border: isOpen
                          ? `1px solid ${cs.borderColor}55`
                          : '1px solid rgba(0,0,0,0.07)',
                        boxShadow: isOpen ? `0 2px 14px ${cs.borderColor}22` : 'none',
                        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                      }}>

                      {/* Category header button */}
                      <button
                        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                        onClick={() => toggleCat(cat.id)}
                        aria-expanded={isOpen}
                        style={{
                          background: isOpen ? cs.gradient : cs.bgLight,
                          transition: 'background 0.22s ease',
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm leading-none">{cat.icon}</span>
                          <span className="text-xs font-black"
                            style={{ color: isOpen ? 'white' : cs.textColor }}>
                            {cat.label}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={isOpen
                              ? { color: 'rgba(255,255,255,0.80)', background: 'rgba(255,255,255,0.20)' }
                              : { color: cs.textColor, background: 'rgba(0,0,0,0.07)' }
                            }>
                            {cat.items.length}
                          </span>
                        </span>
                        <span className="text-[10px] font-bold"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                            display: 'inline-block',
                            color: isOpen ? 'rgba(255,255,255,0.80)' : '#9ca3af',
                          }}>
                          ▼
                        </span>
                      </button>

                      {/* Questions */}
                      {isOpen && (
                        <div className="cat-questions px-2 py-2 space-y-1.5"
                          style={{ background: 'rgba(255,255,255,0.88)' }}>
                          {cat.items.map(({ q, a }) => (
                            <button
                              key={q}
                              onClick={() => handleFAQ(q, a)}
                              className="faq-card w-full text-left px-3 py-2.5 rounded-lg"
                              style={{
                                background: cs.bgLight,
                                borderLeft: `3px solid ${cs.borderColor}`,
                                color: cs.textColor,
                              }}
                            >
                              <span className="flex items-start gap-2">
                                <span className="text-[9px] mt-[3px] shrink-0" style={{ opacity: 0.45 }}>▶</span>
                                <span className="text-xs font-bold leading-snug">{q}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
