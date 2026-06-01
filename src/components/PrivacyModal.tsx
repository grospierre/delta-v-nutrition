import { useEffect } from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Content sections ─────────────────────────────────────────────────────────
const SECTIONS = [
  {
    icon: '🧠',
    title: "Simple truth: We don't store your data.",
    intro: true,
    items: [],
  },
  {
    icon: '⚙️',
    title: 'How Delta-V works',
    items: [
      { text: 'You input your race details' },
      { text: 'Our app calculates your nutrition plan IN YOUR BROWSER' },
      { text: 'When you close the app, it\'s gone' },
      { text: 'No servers storing your information' },
      { text: 'No tracking, no analytics, no cookies' },
      { text: '(Unlike that creepy ad that follows you around the internet 👀)', accent: true },
    ],
  },
  {
    icon: '🌐',
    title: 'APIs we use',
    items: [
      { text: 'Open-Meteo: for live weather (they don\'t store your location)' },
      { text: 'Your browser\'s localStorage: optional, only if YOU want to save data' },
      { text: '(We promise we\'re not secretly building a weather prediction algorithm to predict your mood 🌤️)', accent: true },
    ],
  },
  {
    icon: '🚫',
    title: 'What we never do',
    items: [
      { text: 'Sell your data (we\'re not running a sketchy startup in a garage… well, maybe the garage part is true 😅)', accent: true },
      { text: 'Track your activity (we don\'t care if you check your nutrition plan at 2 AM before a race)' },
      { text: 'Create profiles (no "Pierre\'s nutritional profile #47392")' },
      { text: 'Share with third parties (your secrets are SAFE with us)' },
      { text: 'Spam your email (we don\'t even have your email, unless you\'re reading the footer)' },
    ],
  },
  {
    icon: '🎛️',
    title: 'Your control',
    items: [
      { text: 'Download your plan as PDF (it\'s yours to keep forever — print it, tattoo it on your arm, we won\'t judge)' },
      { text: 'Share on social media (you choose what to share — we\'re not forcing you to brag 💪)' },
      { text: 'Close the tab and it\'s all gone (poof ✨ like you never planned that 170 km race)', accent: true },
    ],
  },
];

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes privacyIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .privacy-panel { animation: privacyIn 0.32s cubic-bezier(0.22, 1, 0.36, 1); }
        .privacy-close { transition: transform 0.22s ease, color 0.18s ease; }
        .privacy-close:hover { transform: rotate(90deg); }
      `}</style>

      {/* ── Backdrop ───────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: 'rgba(0,10,35,0.68)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Privacy Policy"
      >
        <div className="flex min-h-full items-start justify-center px-4 py-10">

          {/* ── Panel ──────────────────────────────────────────────────────── */}
          <div
            className="privacy-panel relative bg-white rounded-3xl w-full max-w-2xl mb-10"
            style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.50), 0 8px 32px rgba(0,0,0,0.22)' }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close Privacy Policy"
              className="privacy-close absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-xl font-black"
            >
              ✕
            </button>

            {/* ── Header band ────────────────────────────────────────────── */}
            <div
              className="rounded-t-3xl px-8 pt-8 pb-7"
              style={{ background: 'linear-gradient(135deg, #001f3f 0%, #2a4bbd 55%, #6b40b0 100%)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔒</span>
                <h2 className="text-2xl font-black text-white tracking-tight">Privacy Policy</h2>
              </div>
              <p className="text-blue-200/80 text-sm font-medium">
                Short version: your data stays in your browser. Long version: keep reading — it's actually funny.
              </p>
            </div>

            {/* ── Body ───────────────────────────────────────────────────── */}
            <div className="px-8 py-8 space-y-7">

              {SECTIONS.map((section) => (
                <section key={section.title}>
                  {section.intro ? (
                    /* Intro callout */
                    <div
                      className="rounded-2xl px-6 py-5 flex items-center gap-4"
                      style={{ background: 'rgba(65,105,225,0.07)', border: '1px solid rgba(65,105,225,0.16)' }}
                    >
                      <span className="text-3xl flex-shrink-0">{section.icon}</span>
                      <p className="text-brand-navy font-black text-lg leading-snug">{section.title}</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-base font-black text-brand-navy mb-3 flex items-center gap-2">
                        <span>{section.icon}</span> {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.items.map(({ text, accent }) => (
                          <li key={text} className="flex items-start gap-2.5">
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: accent ? '#7C5ACE' : '#4169E1' }}
                            />
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: accent ? '#6B40B0' : '#374151' }}
                            >
                              {text}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </section>
              ))}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

              {/* Closing statement */}
              <div
                className="rounded-2xl p-5 text-sm leading-relaxed text-gray-700 space-y-2"
                style={{ background: 'rgba(219,234,254,0.40)' }}
              >
                <p className="font-bold text-brand-navy">
                  Built by an ultra-runner, for ultra-runners. Privacy matters.
                </p>
                <p className="text-gray-500 italic">
                  Because privacy on the mountain is sacred. No one needs to see you bonk at km 80.
                </p>
              </div>

              {/* Contact */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-sm text-gray-500">Questions?</p>
                <a
                  href="mailto:pierre.gros722@gmail.com"
                  className="text-sm font-bold text-brand-blue hover:text-brand-blue-dark hover:underline underline-offset-4 transition-colors"
                >
                  pierre.gros722@gmail.com
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
