import { useEffect, useRef } from 'react';
import { NutritionPlan } from '../types';
import { BRANDS } from '../utils/constants';

// ─── Product illustrations ─────────────────────────────────────────────────
// One hand-drawn SVG per product id.  All use viewBox="0 0 100 110".
// Rendered inside a 120px-tall centred container.

function IllustrationMaurten320() {
  // Maurten's iconic white/black minimal sachet — Swiss precision aesthetic
  return (
    <svg viewBox="0 0 100 110" width="72" height="80" xmlns="http://www.w3.org/2000/svg">
      {/* Sachet body */}
      <rect x="18" y="12" width="64" height="82" rx="7" fill="#F5F5F0" />
      <rect x="18" y="12" width="64" height="82" rx="7" fill="none" stroke="#DEDEDA" strokeWidth="1.5" />
      {/* Heat-sealed top — black */}
      <path d="M18,12 Q50,7 82,12 L82,34 Q50,32 18,34 Z" fill="#111111" />
      {/* Crimp texture (short lines) */}
      <path
        d="M24,12 L24,20 M30,11 L30,19 M36,10 L36,19 M42,10 L42,18 M48,10 L48,18
           M54,10 L54,18 M60,10 L60,19 M66,11 L66,19 M72,12 L72,20 M78,13 L78,20"
        stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" strokeLinecap="round"
      />
      {/* Centre brand stripe */}
      <rect x="18" y="57" width="64" height="14" fill="#111111" />
      {/* White lines inside stripe */}
      <rect x="30" y="61" width="40" height="2.5" rx="1.2" fill="rgba(255,255,255,0.92)" />
      <rect x="37" y="65.5" width="26" height="1.8" rx="0.9" fill="rgba(255,255,255,0.45)" />
      {/* "320" hero number */}
      <text x="50" y="53" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900" fontSize="19" fill="#111111">320</text>
      {/* "MIX" subtitle */}
      <text x="50" y="43" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="6" fill="#888888" letterSpacing="3">MIX</text>
      {/* Bottom seal strip */}
      <rect x="22" y="88" width="56" height="5" rx="2.5" fill="#E0E0DA" />
    </svg>
  );
}

function IllustrationSiSBetaFuel() {
  // SiS long slim gel sachet — cobalt blue with tear notch
  return (
    <svg viewBox="0 0 100 110" width="60" height="92" xmlns="http://www.w3.org/2000/svg">
      {/* Main body */}
      <rect x="28" y="8" width="44" height="94" rx="11" fill="#1A52C4" />
      {/* Lighter upper area */}
      <rect x="28" y="8" width="44" height="38" rx="11" fill="#2563EB" />
      <rect x="28" y="36" width="44" height="10" fill="#2563EB" />
      {/* Sheen highlight left */}
      <rect x="30" y="12" width="6" height="78" rx="3" fill="rgba(255,255,255,0.10)" />
      {/* Label inset */}
      <rect x="32" y="50" width="36" height="36" rx="5" fill="rgba(255,255,255,0.12)" />
      {/* "SiS" logotype */}
      <text x="50" y="65" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900" fontSize="13" fill="white">SiS</text>
      {/* "BETA" */}
      <text x="50" y="75" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="6" fontWeight="bold" fill="rgba(255,255,255,0.88)" letterSpacing="2">BETA</text>
      {/* "FUEL" */}
      <text x="50" y="83" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="6" fontWeight="bold" fill="rgba(255,255,255,0.65)" letterSpacing="2">FUEL</text>
      {/* Tear notch at top */}
      <path d="M43,8 L43,13 M57,8 L57,13" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" />
      {/* Carbs chip */}
      <rect x="34" y="89" width="32" height="9" rx="4.5" fill="rgba(255,255,255,0.18)" />
      <text x="50" y="96.5" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="5.5" fill="rgba(255,255,255,0.8)" letterSpacing="1">40g CARBS</text>
    </svg>
  );
}

function IllustrationTailwind() {
  // Tailwind resealable pouch — teal/cyan with zipper seal at top
  return (
    <svg viewBox="0 0 100 110" width="80" height="88" xmlns="http://www.w3.org/2000/svg">
      {/* Bag body (narrowing towards bottom = gusseted) */}
      <path d="M14,24 Q14,12 50,12 Q86,12 86,24 L82,96 Q82,106 50,106 Q18,106 18,96 Z" fill="#0D9488" />
      {/* Side gusset shadows */}
      <path d="M14,24 L18,96 Q18,106 26,106 L26,100 Q20,100 20,94 L16,28 Z" fill="rgba(0,0,0,0.12)" />
      <path d="M86,24 L82,96 Q82,106 74,106 L74,100 Q80,100 80,94 L84,28 Z" fill="rgba(0,0,0,0.12)" />
      {/* Zipper track */}
      <rect x="14" y="22" width="72" height="7" rx="3.5" fill="#0F766E" />
      <rect x="14" y="23" width="72" height="5" rx="2.5" fill="#14B8A6" />
      {/* Zipper pulls */}
      <circle cx="23" cy="25.5" r="2.5" fill="#0D9488" />
      <circle cx="77" cy="25.5" r="2.5" fill="#0D9488" />
      {/* Label window */}
      <rect x="24" y="35" width="52" height="58" rx="6" fill="rgba(255,255,255,0.13)" />
      {/* Brand name */}
      <text x="50" y="55" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900" fontSize="8.5" fill="white" letterSpacing="0.5">TAILWIND</text>
      {/* Wave motif */}
      <path d="M30,64 Q35,59 40,64 Q45,69 50,64 Q55,59 60,64 Q65,69 70,64"
        fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
      {/* Subtitle */}
      <text x="50" y="76" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="5.5" fill="rgba(255,255,255,0.7)" letterSpacing="1.5">ENDURANCE FUEL</text>
      {/* Bottom gusset fold */}
      <ellipse cx="50" cy="103" rx="28" ry="5" fill="#0F766E" />
    </svg>
  );
}

function IllustrationNaakCookie() {
  // Naak Ultra Energy Cookie — horizontal wrapper with visible cookie window
  return (
    <svg viewBox="0 0 100 110" width="88" height="72" xmlns="http://www.w3.org/2000/svg">
      {/* Wrapper body */}
      <rect x="7" y="22" width="86" height="66" rx="9" fill="#6B2100" />
      {/* Orange mid-band */}
      <rect x="7" y="40" width="86" height="30" fill="#EA580C" />
      {/* Top dark fold */}
      <rect x="7" y="22" width="86" height="9" rx="4.5" fill="#4A1700" />
      {/* Bottom dark fold */}
      <rect x="7" y="79" width="86" height="9" rx="4.5" fill="#4A1700" />
      {/* Left window area (shows cookie) */}
      <rect x="14" y="30" width="26" height="50" rx="5" fill="rgba(0,0,0,0.35)" />
      {/* Cookie circle inside window */}
      <circle cx="27" cy="55" r="11" fill="#8B4513" />
      <circle cx="27" cy="55" r="9.5" fill="#A0522D" />
      {/* Cookie top texture */}
      <path d="M20,50 Q27,47 34,50 Q27,53 20,50Z" fill="rgba(255,255,255,0.08)" />
      {/* Choc chip dots */}
      <circle cx="24" cy="52" r="1.8" fill="#3C1800" />
      <circle cx="30" cy="55" r="1.8" fill="#3C1800" />
      <circle cx="24" cy="58" r="1.8" fill="#3C1800" />
      <circle cx="30" cy="50" r="1.3" fill="#3C1800" />
      {/* NAAK brand right side */}
      <text x="68" y="50" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900" fontSize="16" fill="white">NAAK</text>
      <text x="68" y="62" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="5" fill="rgba(255,255,255,0.82)" letterSpacing="1.5">ULTRA ENERGY</text>
      {/* Cookie category label */}
      <rect x="50" y="66" width="34" height="9" rx="4.5" fill="rgba(255,255,255,0.18)" />
      <text x="67" y="73" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="5" fill="white" letterSpacing="1">COOKIE</text>
    </svg>
  );
}

function IllustrationLiquidIV() {
  // Liquid IV slim stick pack — vivid blue with their droplet logo
  return (
    <svg viewBox="0 0 100 110" width="52" height="96" xmlns="http://www.w3.org/2000/svg">
      {/* Stick pack body */}
      <rect x="30" y="6" width="40" height="98" rx="9" fill="#1E40AF" />
      {/* Upper gradient area */}
      <rect x="30" y="6" width="40" height="42" rx="9" fill="#2563EB" />
      <rect x="30" y="38" width="40" height="10" fill="#2563EB" />
      {/* Sheen */}
      <rect x="32" y="10" width="7" height="82" rx="3.5" fill="rgba(255,255,255,0.10)" />
      {/* Droplet graphic */}
      <path
        d="M50,26 C50,26 41,37 41,44 C41,48.97 45.03,53 50,53
           C54.97,53 59,48.97 59,44 C59,37 50,26 50,26 Z"
        fill="rgba(255,255,255,0.92)"
      />
      {/* "IV" inside droplet */}
      <text x="50" y="47" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900" fontSize="9" fill="#1E40AF">IV</text>
      {/* LIQUID label */}
      <text x="50" y="63" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="5.5" fontWeight="bold" fill="rgba(255,255,255,0.88)" letterSpacing="2">LIQUID</text>
      {/* HYDRATION sub */}
      <text x="50" y="72" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="4.5" fill="rgba(255,255,255,0.55)" letterSpacing="1">HYDRATION</text>
      {/* Tear notch */}
      <path d="M42,6 L42,11 M58,6 L58,11" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" />
      {/* 500mg Na label */}
      <rect x="32" y="79" width="36" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
      <text x="50" y="87" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="5.5" fill="rgba(255,255,255,0.85)">500mg Na⁺</text>
    </svg>
  );
}

function IllustrationNuun() {
  // Nuun Sport tablet tube — orange cap + white cylinder body
  return (
    <svg viewBox="0 0 100 110" width="66" height="92" xmlns="http://www.w3.org/2000/svg">
      {/* Tube body */}
      <rect x="24" y="34" width="52" height="70" rx="5" fill="white" />
      <rect x="24" y="34" width="52" height="70" rx="5" fill="none" stroke="#E5E7EB" strokeWidth="1.5" />
      {/* Bottom ellipse (3D base) */}
      <ellipse cx="50" cy="104" rx="26" ry="7" fill="#E5E7EB" />
      {/* Body accent stripe */}
      <rect x="24" y="54" width="52" height="26" fill="#FED7AA" opacity="0.55" />
      {/* "nuun" wordmark */}
      <text x="50" y="68" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900" fontSize="13" fill="#EA580C">nuun</text>
      {/* "SPORT" subtitle */}
      <text x="50" y="79" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="5.5" fill="#9A3412" letterSpacing="2.5">SPORT</text>
      {/* Tablet hint at bottom */}
      <ellipse cx="50" cy="96" rx="14" ry="3.5" fill="#F3F4F6" />
      <ellipse cx="50" cy="96" rx="10" ry="2" fill="#E5E7EB" />
      {/* Orange cap */}
      <path d="M24,34 L24,20 Q24,10 50,10 Q76,10 76,20 L76,34 Z" fill="#F97316" />
      {/* Cap top ellipse */}
      <ellipse cx="50" cy="10" rx="26" ry="8" fill="#FB923C" />
      {/* Cap ridges */}
      <path d="M24,20 L76,20" stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" />
      <path d="M24,26 L76,26" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      {/* nuun "n" logo on cap */}
      <circle cx="50" cy="18" r="5" fill="rgba(255,255,255,0.85)" />
      <text x="50" y="21.5" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900" fontSize="7" fill="#EA580C">n</text>
    </svg>
  );
}

function IllustrationGURoctane() {
  // GU Roctane Energy Gel — distinctive yellow top / dark navy body
  return (
    <svg viewBox="0 0 100 110" width="60" height="92" xmlns="http://www.w3.org/2000/svg">
      {/* Sachet body — dark */}
      <rect x="26" y="6" width="48" height="98" rx="12" fill="#1E1B4B" />
      {/* Yellow top panel */}
      <rect x="26" y="6" width="48" height="42" rx="12" fill="#EAB308" />
      <rect x="26" y="38" width="48" height="10" fill="#EAB308" />
      {/* Sheen on yellow */}
      <rect x="28" y="9" width="8" height="32" rx="4" fill="rgba(255,255,255,0.18)" />
      {/* "GU" logotype */}
      <text x="50" y="29" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900" fontSize="20" fill="#1E1B4B">GU</text>
      {/* Lightning bolt between panels */}
      <path d="M49,41 L44,57 L50,54 L46,70 L55,52 L49,55 Z" fill="#EAB308" />
      {/* "ROCTANE" */}
      <text x="50" y="80" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="700" fontSize="7" fill="rgba(255,255,255,0.88)" letterSpacing="1">ROCTANE</text>
      {/* "ENERGY GEL" */}
      <text x="50" y="90" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="5" fill="rgba(255,255,255,0.55)" letterSpacing="1">ENERGY GEL</text>
      {/* Tear notch */}
      <path d="M41,6 L41,11 M59,6 L59,11" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round" />
      {/* Caffeine callout */}
      <rect x="30" y="93" width="40" height="9" rx="4.5" fill="#EAB308" opacity="0.85" />
      <text x="50" y="100.5" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontSize="5.5" fontWeight="bold" fill="#1E1B4B">100mg CAFFEINE</text>
    </svg>
  );
}

// ── Illustration lookup keyed by brand id ─────────────────────────────────────
const PRODUCT_ILLUSTRATION: Record<string, React.ReactNode> = {
  'maurten-320':      <IllustrationMaurten320 />,
  'sis-beta-fuel':    <IllustrationSiSBetaFuel />,
  'tailwind-endurance': <IllustrationTailwind />,
  'naak-cookie':      <IllustrationNaakCookie />,
  'liquid-iv':        <IllustrationLiquidIV />,
  'nuun-sport':       <IllustrationNuun />,
  'gu-roctane':       <IllustrationGURoctane />,
};

// ── Category tint for the illustration container background ──────────────────
const CATEGORY_BG: Record<string, string> = {
  carbs:    'rgba(251,191,36,0.10)',
  sodium:   'rgba(14,165,233,0.10)',
  caffeine: 'rgba(139,92,246,0.10)',
};

// ── Category accent colour for the badge / label ─────────────────────────────
const CATEGORY_COLOR: Record<string, string> = {
  carbs:    '#D97706',
  sodium:   '#0EA5E9',
  caffeine: '#7C3AED',
};

interface BrandRecommendationsProps {
  plan: NutritionPlan;
}

export default function BrandRecommendations({ plan }: BrandRecommendationsProps) {
  const relevant = BRANDS.filter((b) => {
    if (b.category === 'carbs')    return true;
    if (b.category === 'sodium')   return plan.sodiumPerHour > 400;
    if (b.category === 'caffeine') return plan.caffeineTotal > 0;
    return true;
  });

  // Staggered scroll-reveal — same pattern as Testimonials / NutritionTargets
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        (Array.from(grid.children) as HTMLElement[]).forEach((card, i) => {
          const t = setTimeout(() => card.classList.add('revealed'), i * 80);
          timeouts.push(t);
        });
        observer.disconnect();
      },
      { threshold: 0.06 },
    );
    observer.observe(grid);
    return () => { observer.disconnect(); timeouts.forEach(clearTimeout); };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 mb-8">
      <div className="mb-6">
        <h2 className="text-3xl font-black section-title tracking-tight mb-1">
          🏪 Recommended Products
        </h2>
        <p className="text-base font-semibold section-subtitle">
          Curated to match your specific nutrition targets
        </p>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relevant.map((b) => (
          <div key={b.id} className="glass-card brand-card group p-5 flex flex-col reveal">

            {/* ── Product illustration ─────────────────────────────────── */}
            <div
              className="rounded-2xl mb-4 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.03]"
              style={{
                background: CATEGORY_BG[b.category],
                height: 120,
                border: `1px solid ${CATEGORY_COLOR[b.category]}22`,
              }}
            >
              {PRODUCT_ILLUSTRATION[b.id] ?? (
                // Fallback: category emoji if no illustration defined
                <span className="text-5xl">{b.category === 'carbs' ? '🍞' : b.category === 'sodium' ? '🧂' : '☕'}</span>
              )}
            </div>

            {/* ── Brand / name row ─────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-2 gap-2">
              <div>
                <p
                  className="text-xs font-black uppercase tracking-wider mb-0.5"
                  style={{ color: CATEGORY_COLOR[b.category] }}
                >
                  {b.brand}
                </p>
                <p className="font-bold text-gray-900 leading-tight">{b.name}</p>
              </div>
              <span
                className="icon-pop text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                style={{
                  background: `${CATEGORY_COLOR[b.category]}15`,
                  color: CATEGORY_COLOR[b.category],
                  border: `1px solid ${CATEGORY_COLOR[b.category]}30`,
                }}
              >
                {b.badge}
              </span>
            </div>

            {/* ── Description ─────────────────────────────────────────── */}
            <p className="text-xs text-gray-700 font-medium mb-3 flex-grow leading-relaxed">{b.description}</p>

            {/* ── Macro chips ─────────────────────────────────────────── */}
            <div className="flex gap-2 text-xs font-semibold mb-3 flex-wrap">
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.04)', color: '#0F172A' }}
              >🍞 {b.carbs}g</span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.04)', color: '#0F172A' }}
              >⚡ {b.kcal} kcal</span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.04)', color: '#0F172A' }}
              >🧂 {b.sodium}mg</span>
            </div>

            {/* ── Footer row ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5 items-center" aria-label={`Rated ${b.rating} of 5`}>
                {Array.from({ length: Math.round(b.rating) }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-xs">★</span>
                ))}
                <span className="text-xs text-gray-400 font-semibold ml-1">{b.rating}</span>
              </div>
              <a
                href={b.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold hover:underline"
                style={{ color: CATEGORY_COLOR[b.category] }}
              >
                Visit site →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
