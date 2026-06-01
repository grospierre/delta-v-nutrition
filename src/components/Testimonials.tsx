import { useEffect, useRef } from 'react';
import { TESTIMONIALS } from '../utils/constants';

// ── Minimalist SVG face avatars ───────────────────────────────────────────────
// Each avatar is a 40×40 bust illustration: head + hair + eyes + expression.
// Rendered inside a rounded-full container → overflow-hidden clips to circle.

function AvatarRunnerVisor() {
  // Male trail runner — running visor cap, warm beige skin
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      {/* Shoulders */}
      <path d="M4,40 Q12,34 20,33 Q28,34 36,40" fill="rgba(255,255,255,0.22)" />
      {/* Head */}
      <circle cx="20" cy="21" r="11" fill="#FDDCB5" />
      {/* Short dark hair under cap */}
      <path
        d="M10,19 Q10,10 20,10 Q30,10 30,19 L29,17 Q25,13 20,12 Q15,13 11,17 Z"
        fill="#1C1008"
      />
      {/* Visor brim — light blue, sits below hairline */}
      <rect x="9" y="17.5" width="22" height="2.5" rx="1.2" fill="#93C5FD" />
      {/* Eyes */}
      <circle cx="16.5" cy="23" r="1.4" fill="#2D1B0E" />
      <circle cx="23.5" cy="23" r="1.4" fill="#2D1B0E" />
      {/* Determined smile */}
      <path
        d="M16,27.5 Q20,30.5 24,27.5"
        stroke="#C08060" strokeWidth="1.3" fill="none" strokeLinecap="round"
      />
    </svg>
  );
}

function AvatarPonytail() {
  // Female trail runner — auburn ponytail, peachy skin, rosy cheeks
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      {/* Shoulders */}
      <path d="M4,40 Q12,34 20,33 Q28,34 36,40" fill="rgba(255,255,255,0.22)" />
      {/* Ponytail (behind/beside head) */}
      <ellipse cx="31.5" cy="16" rx="3.5" ry="8" fill="#7B2D00" transform="rotate(18 31.5 16)" />
      {/* Head */}
      <circle cx="20" cy="21" r="11" fill="#FDDCB5" />
      {/* Hair — top and sides */}
      <path
        d="M10,19 Q10,10 20,10 Q30,10 30,19 L29,17 Q25,12 20,11 Q15,12 11,17 Z"
        fill="#7B2D00"
      />
      {/* Rosy cheeks */}
      <circle cx="14.5" cy="25" r="2.5" fill="rgba(255,120,100,0.22)" />
      <circle cx="25.5" cy="25" r="2.5" fill="rgba(255,120,100,0.22)" />
      {/* Eyes */}
      <circle cx="16.5" cy="23" r="1.4" fill="#2D1B0E" />
      <circle cx="23.5" cy="23" r="1.4" fill="#2D1B0E" />
      {/* Big bright smile */}
      <path
        d="M15.5,27.5 Q20,31 24.5,27.5"
        stroke="#C08060" strokeWidth="1.3" fill="none" strokeLinecap="round"
      />
    </svg>
  );
}

function AvatarBeard() {
  // Male veteran runner — short dark hair, close-cropped beard, medium-brown skin
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      {/* Shoulders */}
      <path d="M4,40 Q12,34 20,33 Q28,34 36,40" fill="rgba(255,255,255,0.22)" />
      {/* Head */}
      <circle cx="20" cy="21" r="11" fill="#D4956A" />
      {/* Short dark hair */}
      <path
        d="M10,19 Q10,10 20,10 Q30,10 30,19 L30,17 Q26,12 20,11 Q14,12 10,17 Z"
        fill="#1C1008"
      />
      {/* Beard — covers lower face */}
      <path
        d="M11,26 Q11,33 20,33 Q29,33 29,26 L28,28 Q24,32 20,32 Q16,32 12,28 Z"
        fill="#3A2620"
      />
      {/* Eyes */}
      <circle cx="16.5" cy="22" r="1.5" fill="#1C1008" />
      <circle cx="23.5" cy="22" r="1.5" fill="#1C1008" />
      {/* Smile (above beard) */}
      <path
        d="M16.5,25.5 Q20,27.5 23.5,25.5"
        stroke="#9A5E38" strokeWidth="1.2" fill="none" strokeLinecap="round"
      />
    </svg>
  );
}

function AvatarTopknot() {
  // Female mountain runner — dark hair in topknot bun, warm olive skin, small earring
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      {/* Shoulders */}
      <path d="M4,40 Q12,34 20,33 Q28,34 36,40" fill="rgba(255,255,255,0.22)" />
      {/* Head */}
      <circle cx="20" cy="22" r="11" fill="#E8AC7C" />
      {/* Hair swept up */}
      <path
        d="M10,20 Q10,11 20,11 Q30,11 30,20 L29,18 Q25,13 20,12 Q15,13 11,18 Z"
        fill="#2D1B0E"
      />
      {/* Topknot bun */}
      <circle cx="20" cy="11" r="5" fill="#2D1B0E" />
      {/* Hair tie highlight */}
      <circle cx="20" cy="11" r="2" fill="rgba(255,255,255,0.40)" />
      {/* Small earring */}
      <circle cx="9.2" cy="23" r="1.4" fill="rgba(255,255,255,0.82)" />
      {/* Eyes */}
      <circle cx="16.5" cy="23.5" r="1.4" fill="#2D1B0E" />
      <circle cx="23.5" cy="23.5" r="1.4" fill="#2D1B0E" />
      {/* Smile */}
      <path
        d="M16,28 Q20,31 24,28"
        stroke="#A86E50" strokeWidth="1.3" fill="none" strokeLinecap="round"
      />
    </svg>
  );
}

// Avatar config: background colour + face component per TESTIMONIALS avatar key
const AVATAR_CFG: Record<string, { bg: string; face: React.ReactNode }> = {
  // SVG illustrated faces (legacy keys)
  U: { bg: '#2563EB', face: <AvatarRunnerVisor /> },
  T: { bg: '#EA580C', face: <AvatarPonytail /> },
  E: { bg: '#7C3AED', face: <AvatarBeard /> },
  M: { bg: '#059669', face: <AvatarTopknot /> },
  // Emoji avatars
  '😅': { bg: '#D97706', face: <span className="text-xl leading-none select-none">😅</span> },
  '🎯': { bg: '#4169E1', face: <span className="text-xl leading-none select-none">🎯</span> },
  '⚡': { bg: '#7C3AED', face: <span className="text-xl leading-none select-none">⚡</span> },
  '🏔️': { bg: '#059669', face: <span className="text-xl leading-none select-none">🏔️</span> },
};

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Stagger: when the grid enters the viewport, reveal each card 90 ms apart
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const cards = Array.from(grid.children) as HTMLElement[];
        cards.forEach((card, i) => {
          const t = setTimeout(() => card.classList.add('revealed'), i * 90);
          timeouts.push(t);
        });
        observer.disconnect();
      },
      { threshold: 0.08 },
    );
    observer.observe(grid);

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white text-center mb-2 drop-shadow-md">What ultra-runners say</h2>
      <p className="text-blue-100/85 text-center mb-10 drop-shadow-sm">Trusted by trail runners across 40+ countries</p>
      {/* Each card starts with .reveal (hidden); IntersectionObserver above adds .revealed */}
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TESTIMONIALS.map((t) => {
          const cfg = AVATAR_CFG[t.avatar] ?? { bg: '#4169E1', face: <span className="text-white font-bold text-lg">{t.avatar}</span> };
          return (
            <div key={t.name} className="glass-card testimonial-card group p-5 flex flex-col gap-3 reveal">
              <div className="flex items-center gap-3">
                {/* Custom SVG avatar — clipped to circle */}
                <div
                  className="icon-pop w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
                  style={{ background: cfg.bg }}
                >
                  {cfg.face}
                </div>
                <div>
                  <p className="font-semibold text-sm text-brand-navy">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.source} · {t.race}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic leading-relaxed flex-grow">"{t.quote}"</p>
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
