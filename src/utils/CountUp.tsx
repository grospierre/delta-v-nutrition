import { useState, useEffect } from 'react';

interface CountUpProps {
  /** Target number to count up to */
  to: number;
  /** Animation duration in ms (default 800) */
  duration?: number;
  /** Decimal places to display (default 0) */
  decimals?: number;
}

/**
 * Counts from 0 → `to` on mount, using easeOutCubic.
 * Renders inline — wrap in whatever text container you need.
 * Cleanup cancels any pending rAF on unmount.
 */
export function CountUp({ to, duration = 800, decimals = 0 }: CountUpProps) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (to === 0) { setVal(0); return; }
    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;          // easeOutCubic — fast start, smooth finish
      const current = eased * to;
      setVal(
        decimals > 0
          ? parseFloat(current.toFixed(decimals))
          : Math.round(current),
      );
      if (t < 1) raf = requestAnimationFrame(tick);
      else       setVal(to);                     // guarantee exact final value
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, decimals]);

  if (decimals > 0) return <>{val.toFixed(decimals)}</>;
  return <>{val.toLocaleString()}</>;
}
