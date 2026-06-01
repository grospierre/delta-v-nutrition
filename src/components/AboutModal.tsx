import { useEffect } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function AboutModal({ isOpen, onClose, onStart }: AboutModalProps) {
  // Close on Escape key
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
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        .about-modal-panel {
          animation: modalIn 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .close-btn:hover { transform: rotate(90deg); }
        .close-btn { transition: transform 0.22s ease, color 0.18s ease; }
      `}</style>

      {/* ── Backdrop ─────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: 'rgba(0,10,35,0.68)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-label="About Delta-V"
      >
        {/* ── Centering shell ──────────────────────────────────────────────── */}
        <div className="flex min-h-full items-start justify-center px-4 py-10">

          {/* ── Modal panel ──────────────────────────────────────────────── */}
          <div
            className="about-modal-panel relative bg-white rounded-3xl w-full max-w-3xl mb-10"
            style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.50), 0 8px 32px rgba(0,0,0,0.22)' }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── Close button ─────────────────────────────────────────────── */}
            <button
              onClick={onClose}
              aria-label="Close About"
              className="close-btn absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-xl font-black"
            >
              ✕
            </button>

            {/* ════════════════════════════════════════════════════════════════
                HEADER — gradient brand band
                ════════════════════════════════════════════════════════════════ */}
            <div
              className="rounded-t-3xl px-10 pt-10 pb-8"
              style={{ background: 'linear-gradient(135deg, #001f3f 0%, #0c2d6e 60%, #1a3a8f 100%)' }}
            >
              <div className="flex items-center gap-4 mb-5">
                <img src="./delta-v-logo.png" alt="Delta-V" className="w-14 h-14 flex-shrink-0" />
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight leading-tight">About Delta-V</h2>
                  <p className="text-blue-300 text-sm mt-0.5 font-medium">Built by an ultra-runner, for ultra-runners</p>
                </div>
              </div>
              <p className="text-blue-200/80 text-lg font-semibold italic">
                "Same physics. Different finish line."
              </p>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                BODY CONTENT
                ════════════════════════════════════════════════════════════════ */}
            <div className="px-8 md:px-10 py-8 space-y-8">

              {/* ── 1. PERSONAL BIO ──────────────────────────────────────────── */}
              <section>
                <h3 className="text-xl font-black text-brand-navy mb-4 flex items-center gap-2">
                  <span>👤</span> Pierre's Story
                </h3>

                {/* Vercors background bio card */}
                <div
                  className="rounded-2xl overflow-hidden mb-4"
                  style={{
                    backgroundImage: "url('/vercors-background.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 18%',
                  }}
                >
                  <div
                    className="p-6"
                    style={{ background: 'linear-gradient(145deg, rgba(0,8,45,0.88) 0%, rgba(5,2,30,0.84) 100%)' }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: '#4169E1', boxShadow: '0 0 18px rgba(65,105,225,0.55)' }}
                      >
                        ⚡
                      </div>
                      <div>
                        <p className="text-white font-bold leading-tight">Pierre Gros</p>
                        <p className="text-blue-300 text-sm">Builder &amp; Ultra-Runner · somewhere designing stuff</p>
                      </div>
                    </div>
                    <p className="text-blue-100/85 text-sm leading-relaxed italic">
                      "I make cool apps, run stupid distances in the mountains, and eat pizza like it's a sport."
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-700 leading-relaxed text-[15px]">
                  <p>
                    Hi, I'm Pierre. I'm a trail runner, nutrition enthusiast, and builder obsessed with optimising human performance in extreme conditions.
                  </p>
                  <p>
                    I grew up loving nature, running, and wide open spaces. I've always been driven by the freedom of movement and the chance to meet incredible people along the way—whether on trails, at races, or just exploring new mountains.
                  </p>
                  <p>
                    While I haven't yet crushed a 100 km race in the Alps{' '}
                    <span className="text-amber-500 font-semibold">(that's coming next 😉)</span>,
                    my obsession with ultra-endurance racing taught me one brutal truth:{' '}
                    <span className="text-brand-blue font-bold">nutrition is EVERYTHING.</span>
                  </p>
                  <p>
                    I've seen runners bonk at km 80 not because their legs failed, but because they fuelled wrong.
                    I've watched incredible athletes collapse in the final hours because they didn't understand carb ratios,
                    hydration timing, or electrolyte balance.
                  </p>
                  <p className="font-semibold text-brand-navy">
                    That's why I built Delta-V.
                  </p>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

              {/* ── 2. WHY NUTRITION MATTERS ─────────────────────────────────── */}
              <section>
                <h3 className="text-xl font-black text-brand-navy mb-4 flex items-center gap-2">
                  <span>⚡</span> Why Nutrition Matters in Ultra-Trail
                </h3>

                <div
                  className="rounded-2xl p-5 mb-5 text-[15px] leading-relaxed text-gray-700 italic"
                  style={{ background: 'rgba(65,105,225,0.06)', borderLeft: '3px solid #4169E1' }}
                >
                  <p className="mb-2">
                    Ultra-trail running is a different beast. It's not a marathon where you can 'wing it'
                    on energy gels and hope. It's not a 5K where your legs give out first.
                  </p>
                  <p>
                    <span className="font-bold not-italic text-brand-navy">
                      Ultra-trail is a 12-hour, 20-hour, or 24-hour battle against your own physiology.
                    </span>
                  </p>
                </div>

                <p className="text-gray-700 text-[15px] leading-relaxed mb-4">
                  Your body is a machine. And like any machine running non-stop for hours, it{' '}
                  <span className="font-bold text-brand-navy">DEMANDS</span> the right fuel, at the right time,
                  in the right amounts.
                </p>

                {/* Stats callout */}
                <div
                  className="rounded-2xl p-5 mb-4 space-y-3"
                  style={{ background: 'rgba(0,31,63,0.04)', border: '1px solid rgba(65,105,225,0.15)' }}
                >
                  <p className="text-sm font-black text-brand-navy uppercase tracking-wide mb-3">
                    The hard truth:
                  </p>
                  {[
                    { icon: '💧', stat: 'Miss your hydration window?', impact: 'Performance drops 30–40% within 30 minutes.' },
                    { icon: '🧂', stat: 'Forget sodium?',              impact: 'Muscles cramp, mind fogs, you hit the wall.' },
                    { icon: '🍞', stat: 'Get your carb ratio wrong?',  impact: "You're running on fumes by km 50 of a 100 km race." },
                    { icon: '⏱️', stat: 'Ignore timing?',              impact: "You're taking the 'right' nutrition at the WRONG moment — wasting precious calories while your body screams." },
                  ].map(({ icon, stat, impact }) => (
                    <div key={stat} className="flex items-start gap-3">
                      <span className="text-lg leading-none mt-0.5 flex-shrink-0">{icon}</span>
                      <p className="text-[14px] text-gray-700 leading-relaxed">
                        <span className="font-bold text-brand-navy">{stat}</span>{' '}
                        <span className="text-amber-600">{impact}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-gray-700 text-[15px] leading-relaxed">
                  <p>
                    Most ultra-runners learn this the hard way. On a mountain. At 2 AM. With 60 km still to go.
                  </p>
                  <p>
                    But here's the good news:{' '}
                    <span className="text-brand-blue font-bold">
                      nutrition is the ONE variable you can control completely.
                    </span>{' '}
                    Unlike genetics, unlike weather, unlike terrain — you own your nutrition strategy 100%.
                  </p>
                  <p className="font-bold text-brand-navy">
                    That's where the power is. That's where champions are made.
                    And that's exactly why Delta-V exists.
                  </p>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

              {/* ── 3. MISSION ───────────────────────────────────────────────── */}
              <section>
                <h3 className="text-xl font-black text-brand-navy mb-4 flex items-center gap-2">
                  <span>🎯</span> The Delta-V Mission
                </h3>
                <div
                  className="rounded-2xl p-6 space-y-3 text-[15px] leading-relaxed text-gray-700"
                  style={{ background: 'rgba(219,234,254,0.45)' }}
                >
                  <p>
                    Delta-V isn't just an app.{' '}
                    <span className="font-bold text-brand-navy">It's your race-day copilot.</span>
                  </p>
                  <p>
                    It's built by someone who's been there — who understands the struggle, the stakes,
                    and the incredible feeling of crossing that finish line knowing you nailed every aspect
                    of your performance.
                  </p>
                  <p>
                    Whether you're chasing a podium, pushing for a personal best, or just determined to
                    finish strong — Delta-V has your back.
                  </p>
                  <p className="font-bold text-brand-navy">
                    Because in ultra-trail, the difference between DNF and glory often comes down to
                    one thing: preparation. And the best preparation is a plan you actually trust.
                  </p>
                  <p className="text-brand-blue font-semibold italic">
                    Let's make sure that plan is YOURS.
                  </p>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

              {/* ── 4. TECH & INSPIRATION ────────────────────────────────────── */}
              <section>
                <h3 className="text-xl font-black text-brand-navy mb-4 flex items-center gap-2">
                  <span>🔧</span> Tech &amp; Inspiration
                </h3>
                <div
                  className="rounded-2xl p-5 space-y-2 text-[14px] text-gray-600 leading-relaxed"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  {[
                    { icon: '⚛️',  text: 'Built with React, TypeScript, and obsession for detail.' },
                    { icon: '🔬',  text: 'Inspired by ISSN (International Society of Sports Nutrition) research, trail running wisdom, and too many conversations with ultra-runners at 4 AM.' },
                    { icon: '🌤️', text: 'Powered by open data, live weather APIs, and a weird love for mountains.' },
                  ].map(({ icon, text }) => (
                    <div key={icon} className="flex items-start gap-3">
                      <span className="text-base leading-none mt-0.5 flex-shrink-0">{icon}</span>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── CONTACT LINKS ────────────────────────────────────────────── */}
              <div className="flex gap-3 flex-wrap pt-1">
                <a href="https://linkedin.com/in/grospierre" target="_blank" rel="noopener noreferrer"
                   className="text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 hover:shadow-md"
                   style={{ background: '#4169E1' }}>
                  LinkedIn
                </a>
                <a href="https://github.com/grospierre" target="_blank" rel="noopener noreferrer"
                   className="text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 hover:shadow-md"
                   style={{ background: '#1f2937' }}>
                  GitHub
                </a>
                <a href="mailto:pierre.gros722@gmail.com"
                   className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 border-2 border-brand-blue text-brand-blue hover:bg-brand-light">
                  Contact
                </a>
              </div>

              {/* ── CTA ──────────────────────────────────────────────────────── */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={onStart}
                  className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-black py-4 rounded-2xl text-lg transition-all hover:scale-[1.01] hover:shadow-xl"
                >
                  🚀 Ready to plan your race? Start here →
                </button>
              </div>

            </div>{/* end body */}
          </div>{/* end panel */}
        </div>{/* end centering shell */}
      </div>{/* end backdrop */}
    </>
  );
}
