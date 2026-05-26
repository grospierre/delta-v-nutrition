export default function LoadingScreen() {
  const steps = [
    'Analyzing race conditions',
    'Fetching real-time weather',
    'Computing personalized nutrition',
  ];

  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 animate-fade-in">
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 border-4 border-brand-light rounded-full" />
        <div className="absolute inset-0 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
      <h2 className="text-xl font-bold text-brand-navy mb-6">Calculating your plan…</h2>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-2 text-sm text-gray-500 animate-slide-up"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block" />
            {step}…
          </div>
        ))}
      </div>
    </div>
  );
}
