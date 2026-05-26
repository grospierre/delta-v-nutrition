import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NutritionPlan, AthleteProfile, RaceDetails, Strategy } from '../types';

interface PDFExportPanelProps {
  plan: NutritionPlan;
  athlete: AthleteProfile;
  race: RaceDetails;
  strategy: Strategy;
}

interface StopRow {
  stop: number;
  time: string;
  km: number;
}

export default function PDFExportPanel({ plan, athlete, race, strategy }: PDFExportPanelProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const intensityLabel = plan.intensityLevel.replace('_', ' ').toUpperCase();
  const experienceLabel = athlete.experience.charAt(0).toUpperCase() + athlete.experience.slice(1);

  const stops: StopRow[] = Array.from({ length: strategy.refuels }, (_, i) => ({
    stop: i + 1,
    time: `${Math.round(plan.intervalHours * i * 100) / 100}h`,
    km: Math.round((race.distance / strategy.refuels) * i),
  }));

  const summaryMetrics: Array<{ e: string; t: string; v: string; s: string }> = [
    { e: '💧', t: 'Hydration', v: `${plan.hydrationPerHour} ml/h`, s: `${plan.hydrationTotal} ml total` },
    { e: '🍞', t: 'Carbs', v: `${plan.carbsPerHour} g/h`, s: `${plan.carbsTotal} g total` },
    { e: '🧂', t: 'Sodium', v: `${plan.sodiumPerHour} mg/h`, s: `${plan.sodiumTotal} mg total` },
    { e: '☕', t: 'Caffeine', v: `${plan.caffeineTotal} mg`, s: plan.caffeineTiming },
  ];

  const downloadPDF = async () => {
    if (!showPreview) {
      setShowPreview(true);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    if (!previewRef.current) return;

    setBusy(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height / canvas.width) * pageWidth;
      const finalHeight = Math.min(imgHeight, pageHeight);
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, finalHeight);
      pdf.save(`Delta-V-Plan-${race.distance}km-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 mb-8">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-brand-navy mb-4">📥 Export Your Plan</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="border-2 border-brand-blue text-brand-blue font-semibold px-6 py-3 rounded-xl hover:bg-brand-light transition"
          >
            👁️ {showPreview ? 'Hide' : 'Preview'} PDF
          </button>
          <button
            onClick={downloadPDF}
            disabled={busy}
            className="bg-brand-blue text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-blue-dark transition shadow-md disabled:opacity-60"
          >
            {busy ? '⏳ Generating…' : '📄 Download PDF'}
          </button>
        </div>

        {showPreview && (
          <div className="border-2 border-dashed border-brand-blue/30 rounded-2xl p-4 bg-white/40 animate-fade-in">
            <p className="text-xs text-gray-400 text-center mb-3">
              PDF preview — this is exactly what will be downloaded
            </p>
            <div ref={previewRef} className="print-card max-w-2xl mx-auto p-8 text-sm">
              <div className="text-center border-b-2 border-brand-blue pb-4 mb-6">
                <p className="text-2xl font-black text-brand-navy">🔺 DELTA-V</p>
                <p className="text-brand-blue font-semibold">Race-Day Nutrition Planner</p>
                <p className="text-gray-400 text-xs italic">"Same physics. Different finish line."</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-bold text-brand-navy mb-2">👤 Athlete Profile</p>
                  <p>Weight: {athlete.weight} kg</p>
                  <p>Age: {athlete.age} years</p>
                  <p>Sex: {athlete.sex === 'M' ? 'Male' : 'Female'}</p>
                  <p>VO2 Max: {athlete.vo2max} ml/kg/min</p>
                  <p>Experience: {experienceLabel}</p>
                </div>
                <div>
                  <p className="font-bold text-brand-navy mb-2">🏔️ Race Summary</p>
                  <p>Distance: {race.distance} km</p>
                  <p>Elevation: +{race.elevationPos}m / -{race.elevationNeg}m</p>
                  <p>Duration: {race.duration} hours</p>
                  <p>Intensity: {intensityLabel}</p>
                  <p>
                    Weather: {plan.weather.category} ({plan.weather.temperature}°C)
                    {!plan.weather.isLive && ' — default'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {summaryMetrics.map((m) => (
                  <div key={m.t} className="bg-brand-light rounded-lg p-3 text-center">
                    <p className="text-lg">{m.e}</p>
                    <p className="font-bold text-xs text-brand-navy">{m.t}</p>
                    <p className="font-black text-brand-blue text-sm">{m.v}</p>
                    <p className="text-xs text-gray-500">{m.s}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <p className="font-bold text-brand-navy mb-2">
                  🛑 Refueling Strategy — {strategy.refuels} stops every {plan.intervalHours}h
                </p>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-light">
                      <th className="p-2 text-left">Stop</th>
                      <th className="p-2">Time</th>
                      <th className="p-2">KM</th>
                      <th className="p-2">💧 Water</th>
                      <th className="p-2">🍞 Carbs</th>
                      <th className="p-2">🧂 Sodium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stops.map((s) => (
                      <tr key={s.stop} className="border-b border-gray-100">
                        <td className="p-2 font-semibold">Stop {s.stop}</td>
                        <td className="p-2 text-center">{s.time}</td>
                        <td className="p-2 text-center">~{s.km}km</td>
                        <td className="p-2 text-center">{plan.perStopHydration}ml</td>
                        <td className="p-2 text-center">{plan.perStopCarbs}g</td>
                        <td className="p-2 text-center">{plan.perStopSodium}mg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-200 pt-3 text-center text-xs text-gray-400">
                <p>💡 Test this plan in training first. Never change anything new on race day.</p>
                <p className="mt-1">Generated with Delta-V · delta-v-nutrition.vercel.app</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
