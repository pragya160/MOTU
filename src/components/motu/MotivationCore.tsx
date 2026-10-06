import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motivationStatus } from "@/lib/motu/store";

export function useCountUp(target: number, duration = 1200, decimals = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return decimals ? Number(v.toFixed(decimals)) : Math.round(v);
}

export function Counter({
  value,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const v = useCountUp(value, 1400, decimals);
  return (
    <span className={className}>
      {v.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function MotivationCore({
  value,
  size = 300,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const shown = useCountUp(value, 1600);
  const status = motivationStatus(value);
  const weak = value < 30;
  const r = 46;
  const circ = 2 * Math.PI * r;

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      {/* energy rings */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "absolute rounded-full border",
            weak ? "border-alert/40" : "border-ok/40",
          )}
          style={{
            width: size * 0.62,
            height: size * 0.62,
            animation: `motu-ring ${weak ? 5 : 2.6}s ease-out ${i * (weak ? 1.6 : 0.85)}s infinite`,
          }}
        />
      ))}

      <div
        className={cn(
          "absolute rounded-full blur-3xl",
          weak ? "bg-alert/25" : value < 60 ? "bg-warn/30" : "bg-ok/35",
        )}
        style={{
          width: size * 0.55,
          height: size * 0.55,
          animation: `motu-breathe ${weak ? 4.5 : 1.9}s ease-in-out infinite`,
        }}
      />

      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} className="fill-none stroke-border" strokeWidth="1.5" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={weak ? "var(--color-alert)" : value < 60 ? "var(--color-warn)" : "var(--color-ok)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (circ * Math.min(100, value)) / 100}
          style={{ transition: "stroke-dashoffset 1.4s var(--ease-cinematic)" }}
        />
        <circle
          cx="60"
          cy="60"
          r={r + 8}
          fill="none"
          stroke="var(--color-signal)"
          strokeOpacity="0.25"
          strokeWidth="0.7"
          strokeDasharray="2 6"
          className="animate-spin-slow"
          style={{ transformOrigin: "60px 60px" }}
        />
      </svg>

      <div className="relative z-10 text-center">
        <div
          className={cn(
            "font-display text-6xl font-bold tabular-nums sm:text-7xl",
            weak ? "text-alert" : value < 60 ? "text-warn" : "text-ok",
          )}
          style={{ textShadow: "0 0 40px currentColor" }}
        >
          {shown}
          <span className="text-3xl">%</span>
        </div>
        <div className="label-mono mt-2">Motivation status</div>
        <div
          className={cn(
            "mt-1 font-display text-sm tracking-[0.18em]",
            weak ? "text-alert" : value < 60 ? "text-warn" : "text-ok",
          )}
        >
          {status.label}
        </div>
      </div>
    </div>
  );
}
