import { useEffect, useRef } from 'react';
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { NutritionPlan, RaceDetails } from '../types';
import { getHydrationSeries, getSodiumSeries, getCarbsSplit } from '../utils/calculations';
import { CountUp } from '../utils/CountUp';

interface NutritionTargetsProps {
  plan: NutritionPlan;
  race: RaceDetails;
}

// ─── Shared tooltip style ──────────────────────────────────────────────────────
const ttStyle = {
  fontSize: 11,
  borderRadius: 8,
  border: 'none',
  boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
  padding: '6px 10px',
};

// ─── Blue→Violet gradient text — matches OutputPanel + home hero brand ────────
const GRAD_NUM: React.CSSProperties = {
  background:           'linear-gradient(90deg, #4169E1 0%, #7C5ACE 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor:  'transparent',
  backgroundClip:       'text',
};

// ─── Palette ───────────────────────────────────────────────────────────────────
const C = {
  blue:        '#4169E1',   // brand blue   — Hydration
  teal:        '#0CA5B5',   // teal/cyan    — Sodium (distinct from blue)
  violet:      '#7C5ACE',   // violet       — Carbohydrates
  violetLight: '#C4B5FD',   // violet 300   — Fructose secondary
  red:         '#E74C3C',   // coral-red    — Caffeine
  redLight:    '#FFCDD2',   // red 100
};

// ─── Colored stat mini-box ─────────────────────────────────────────────────────
function StatBox({ value, label, accent }: { value: string | number; label: string; accent: string }) {
  return (
    <div
      className="flex-1 rounded-xl p-2.5 text-center"
      style={{ background: `${accent}14` }}
    >
      <p className="font-black text-sm leading-none mb-0.5" style={{ color: accent }}>{value}</p>
      <p className="text-[11px] text-gray-400 font-semibold">{label}</p>
    </div>
  );
}

// ─── Card wrapper — accent top-border + colored shadow ────────────────────────
function MetricCard({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div
      className="group rounded-[26px] p-8 flex flex-col gap-4 cursor-default reveal"
      style={{
        background:           'rgba(255,255,255,0.88)',
        backdropFilter:       'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border:               '1px solid rgba(255,255,255,0.75)',
        borderTop:            `4px solid ${accent}`,
        boxShadow:            `0 16px 48px rgba(40,55,90,0.18), 0 2px 8px rgba(40,55,90,0.10), inset 0 1px 1px rgba(255,255,255,0.95), 0 0 0 0 ${accent}00`,
        transition:           'transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = `0 28px 60px rgba(40,55,90,0.22), 0 6px 16px rgba(40,55,90,0.12), inset 0 1px 1px rgba(255,255,255,0.95), 0 0 0 4px ${accent}18`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = '';
        el.style.boxShadow = '0 16px 48px rgba(40,55,90,0.18), 0 2px 8px rgba(40,55,90,0.10), inset 0 1px 1px rgba(255,255,255,0.95), 0 0 0 0 transparent';
      }}
    >
      {children}
    </div>
  );
}

// ─── Icon halo — colored soft square behind each emoji ────────────────────────
function IconHalo({ emoji, accent }: { emoji: string; accent: string }) {
  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{
        background: `${accent}1A`,
        border: `1px solid ${accent}28`,
        boxShadow: `0 2px 12px ${accent}20`,
      }}
    >
      <span className="text-3xl leading-none">{emoji}</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function NutritionTargets({ plan, race }: NutritionTargetsProps) {
  const hydrationSeries = getHydrationSeries(plan, race.duration).slice(0, 8);
  const sodiumSeries    = getSodiumSeries(plan, race.duration).slice(0, 8);
  const carbsSplit      = getCarbsSplit(plan);

  // Scroll-reveal: stagger cards into view as the grid enters the viewport
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const cards = Array.from(grid.children) as HTMLElement[];
        cards.forEach((card, i) => {
          const t = setTimeout(() => card.classList.add('revealed'), i * 100);
          timeouts.push(t);
        });
        observer.disconnect();
      },
      { threshold: 0.08 },
    );
    observer.observe(grid);
    return () => { observer.disconnect(); timeouts.forEach(clearTimeout); };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 mb-8">
      {/* Section header */}
      <div className="mb-7">
        <h2 className="text-3xl font-black section-title tracking-tight mb-1">
          📊 Nutrition Targets
        </h2>
        <p className="text-base font-semibold section-subtitle">
          Science-backed per-hour &amp; total targets for your race
        </p>
      </div>

      {/* 2×2 grid when caffeine card is present; 3-column otherwise */}
      <div
        ref={gridRef}
        className={`grid grid-cols-1 sm:grid-cols-2 ${plan.caffeineTotal > 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}
      >

        {/* ── HYDRATION — Brand blue ──────────────────────────────────────────── */}
        <MetricCard accent={C.blue}>
          <div className="flex items-center gap-3">
            <IconHalo emoji="💧" accent={C.blue} />
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: C.blue }}>Hydration</p>
              <p className="text-[11px] text-gray-400 font-semibold">per hour target</p>
            </div>
          </div>

          <div className="-mb-1">
            <p className="text-[46px] font-black leading-none tabular-nums" style={{ color: C.blue }}>
              <CountUp to={plan.hydrationPerHour} duration={800} />
            </p>
            <p className="text-sm font-semibold mt-1 text-gray-400">ml / hour</p>
          </div>

          <div className="flex gap-2">
            <StatBox value={plan.hydrationTotal.toLocaleString()} label="ml total" accent={C.blue} />
            <StatBox value={plan.hydrationRefills} label="refills" accent={C.blue} />
          </div>

          <div className="h-[108px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hydrationSeries} barCategoryGap="24%">
                <defs>
                  <linearGradient id="hydGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={C.blue} stopOpacity={1.00} />
                    <stop offset="100%" stopColor={C.blue} stopOpacity={0.42} />
                  </linearGradient>
                </defs>
                <Bar dataKey="ml" fill="url(#hydGrad)" radius={[5, 5, 0, 0]} />
                <Tooltip
                  formatter={(v: number) => [`${v} ml`, 'Per hour']}
                  contentStyle={ttStyle}
                  cursor={{ fill: `${C.blue}08` }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>

        {/* ── CARBOHYDRATES — Violet ──────────────────────────────────────────── */}
        <MetricCard accent={C.violet}>
          <div className="flex items-center gap-3">
            <IconHalo emoji="🍞" accent={C.violet} />
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: C.violet }}>Carbohydrates</p>
              <p className="text-[11px] text-gray-400 font-semibold">per hour target</p>
            </div>
          </div>

          <div className="-mb-1">
            <p className="text-[46px] font-black leading-none tabular-nums" style={GRAD_NUM}>
              <CountUp to={plan.carbsPerHour} duration={800} />
            </p>
            <p className="text-sm font-semibold mt-1 text-gray-400">g / hour</p>
          </div>

          <div className="flex gap-2">
            <StatBox value={`${plan.carbsTotal} g`} label="total" accent={C.violet} />
            <StatBox value={plan.carbsServings} label="servings" accent={C.violet} />
          </div>

          {/* Donut + legend */}
          <div className="flex items-center gap-3">
            <div className="h-[108px] w-[108px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={carbsSplit}
                    cx="50%" cy="50%"
                    innerRadius={30} outerRadius={48}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={3}
                  >
                    <Cell fill={C.violet} />
                    <Cell fill={C.violetLight} />
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [`${v}%`]}
                    contentStyle={ttStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: C.violet }} />
                <div>
                  <p className="font-black text-sm leading-none" style={{ color: C.violet }}>{plan.glucosePercent}%</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Glucose</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: C.violetLight, border: `1.5px solid ${C.violet}66` }}
                />
                <div>
                  <p className="font-black text-sm leading-none" style={{ color: C.violetLight }}>{plan.fructosePercent}%</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Fructose</p>
                </div>
              </div>
            </div>
          </div>
        </MetricCard>

        {/* ── SODIUM — Teal (clearly distinct from blue) ──────────────────────── */}
        <MetricCard accent={C.teal}>
          <div className="flex items-center gap-3">
            <IconHalo emoji="🧂" accent={C.teal} />
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: C.teal }}>Sodium</p>
              <p className="text-[11px] text-gray-400 font-semibold">per hour target</p>
            </div>
          </div>

          <div className="-mb-1">
            <p className="text-[46px] font-black leading-none tabular-nums" style={{ color: C.teal }}>
              <CountUp to={plan.sodiumPerHour} duration={800} />
            </p>
            <p className="text-sm font-semibold mt-1 text-gray-400">mg / hour</p>
          </div>

          <div className="flex gap-2">
            <StatBox value={plan.sodiumTotal.toLocaleString()} label="mg total" accent={C.teal} />
            <StatBox value={plan.sodiumTablets} label="tablets" accent={C.teal} />
          </div>

          <div className="h-[108px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sodiumSeries}>
                <defs>
                  <linearGradient id="sodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.teal} stopOpacity={0.55} />
                    <stop offset="95%" stopColor={C.teal} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="mg"
                  stroke={C.teal}
                  fill="url(#sodGrad)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: C.teal, strokeWidth: 0 }}
                />
                <Tooltip
                  formatter={(v: number) => [`${v} mg`, 'Cumulative']}
                  contentStyle={ttStyle}
                  cursor={{ stroke: `${C.teal}55`, strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>

        {/* ── CAFFEINE — Coral red (hidden when strategy = 'none') ────────────── */}
        {plan.caffeineTotal > 0 && (
          <MetricCard accent={C.red}>
            <div className="flex items-center gap-3">
              <IconHalo emoji="☕" accent={C.red} />
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: C.red }}>Caffeine</p>
                <p className="text-[11px] text-gray-400 font-semibold">total intake</p>
              </div>
            </div>

            <div className="-mb-1">
              <p className="text-[46px] font-black leading-none tabular-nums" style={{ color: C.red }}>
                <CountUp to={plan.caffeineTotal} duration={800} />
              </p>
              <p className="text-sm font-semibold mt-1 text-gray-400">mg total</p>
            </div>

            <div className="flex gap-2">
              <StatBox
                value={plan.caffeineDoses}
                label={`dose${plan.caffeineDoses > 1 ? 's' : ''}`}
                accent={C.red}
              />
              <StatBox
                value={`${Math.round(plan.caffeineTotal / plan.caffeineDoses)} mg`}
                label="per dose"
                accent={C.red}
              />
            </div>

            {/* Timing + dose pills */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">⏱️</span>
                <p className="text-[11px] text-gray-400 font-medium">{plan.caffeineTiming}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: Math.min(plan.caffeineDoses, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                    style={{
                      background: `${C.red}12`,
                      border: `1px solid ${C.red}30`,
                    }}
                  >
                    <span className="text-sm leading-none">☕</span>
                    <span className="text-xs font-black" style={{ color: C.red }}>
                      {Math.round(plan.caffeineTotal / plan.caffeineDoses)} mg
                    </span>
                  </div>
                ))}
                {plan.caffeineDoses > 4 && (
                  <div
                    className="flex items-center rounded-full px-3 py-1.5"
                    style={{ background: `${C.red}12`, border: `1px solid ${C.red}30` }}
                  >
                    <span className="text-xs font-bold" style={{ color: C.red }}>
                      +{plan.caffeineDoses - 4} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          </MetricCard>
        )}

      </div>
    </div>
  );
}
