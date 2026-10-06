import { cn } from "@/lib/utils";
import type { BabaState } from "@/lib/motu/data";

const EXPRESSION: Record<BabaState, { brow: string; mouth: string; eyes: "closed" | "open" | "wide" }> =
  {
    meditation: { brow: "M28 40 q6 -3 12 0 M60 40 q6 -3 12 0", mouth: "M44 62 q6 3 12 0", eyes: "closed" },
    talking: { brow: "M28 38 q6 -3 12 0 M60 38 q6 -3 12 0", mouth: "M43 60 q7 9 14 0 q-7 4 -14 0", eyes: "open" },
    happy: { brow: "M28 38 q6 -5 12 0 M60 38 q6 -5 12 0", mouth: "M42 58 q8 12 16 0", eyes: "closed" },
    proud: { brow: "M28 36 q6 -6 12 0 M60 36 q6 -6 12 0", mouth: "M44 60 q6 6 12 -2", eyes: "closed" },
    confused: { brow: "M28 34 q6 4 12 -2 M60 40 q6 -6 12 1", mouth: "M44 62 q6 -5 12 2", eyes: "open" },
    disappointed: { brow: "M28 34 q6 4 12 1 M60 35 q6 1 12 -4", mouth: "M44 64 q6 -5 12 0", eyes: "open" },
    angry: { brow: "M28 32 q6 6 12 2 M60 34 q6 -4 12 -2", mouth: "M43 64 q7 -6 14 0", eyes: "wide" },
    excited: { brow: "M28 34 q6 -7 12 0 M60 34 q6 -7 12 0", mouth: "M42 57 q8 14 16 0", eyes: "wide" },
    celebrating: { brow: "M28 34 q6 -7 12 0 M60 34 q6 -7 12 0", mouth: "M40 56 q10 16 20 0", eyes: "closed" },
    searching: { brow: "M28 36 q6 -2 12 -2 M60 34 q6 0 12 2", mouth: "M45 62 q5 2 10 -1", eyes: "open" },
    shocked: { brow: "M28 30 q6 -4 12 0 M60 30 q6 -4 12 0", mouth: "M46 60 a5 6 0 1 0 8 0 a5 6 0 1 0 -8 0", eyes: "wide" },
  };

export function Baba({
  state = "meditation",
  size = 180,
  className,
  aura = true,
  rays = false,
}: {
  state?: BabaState;
  size?: number;
  className?: string;
  aura?: boolean;
  rays?: boolean;
}) {
  const e = EXPRESSION[state];
  const eyeR = e.eyes === "closed" ? 0 : e.eyes === "wide" ? 4.2 : 2.6;

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      aria-label={`MOTU Baba (${state})`}
      role="img"
    >
      {aura && (
        <>
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-3xl animate-breathe" />
          <div
            className="absolute inset-[-12%] rounded-full border border-primary/25 animate-spin-slow"
            style={{ borderStyle: "dashed" }}
          />
          <div className="absolute inset-[6%] rounded-full border border-signal/20 animate-breathe" />
        </>
      )}
      {rays && (
        <div
          className="absolute inset-[-40%] animate-spin-slow opacity-30"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, var(--color-primary) 6deg, transparent 14deg, transparent 40deg, var(--color-primary) 46deg, transparent 54deg, transparent 90deg, var(--color-primary) 96deg, transparent 104deg, transparent 150deg, var(--color-primary) 156deg, transparent 164deg, transparent 220deg, var(--color-primary) 226deg, transparent 234deg, transparent 300deg, var(--color-primary) 306deg, transparent 314deg)",
            maskImage: "radial-gradient(circle, transparent 28%, black 45%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 28%, black 45%, transparent 72%)",
          }}
        />
      )}

      <svg viewBox="0 0 100 100" className="relative h-full w-full animate-float drop-shadow-2xl">
        <defs>
          <radialGradient id="baba-skin" cx="40%" cy="30%">
            <stop offset="0%" stopColor="oklch(0.88 0.08 70)" />
            <stop offset="100%" stopColor="oklch(0.72 0.1 55)" />
          </radialGradient>
          <linearGradient id="baba-robe" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.86 0.15 82)" />
            <stop offset="100%" stopColor="oklch(0.62 0.17 38)" />
          </linearGradient>
        </defs>

        {/* lotus base cloud */}
        <ellipse cx="50" cy="90" rx="30" ry="6" fill="oklch(0.79 0.14 197 / 0.18)" />

        {/* legs / robe */}
        <path
          d="M22 88 Q50 62 78 88 Q50 96 22 88 Z"
          fill="url(#baba-robe)"
          opacity="0.95"
        />
        <path d="M30 86 Q50 74 70 86" stroke="oklch(0.3 0.06 60 / 0.4)" strokeWidth="1.2" fill="none" />

        {/* body */}
        <path d="M34 82 Q34 56 50 54 Q66 56 66 82 Z" fill="url(#baba-robe)" />
        {/* arms in mudra */}
        <path
          d="M34 70 Q26 80 38 84"
          stroke="url(#baba-skin)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M66 70 Q74 80 62 84"
          stroke="url(#baba-skin)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* neck + head */}
        <rect x="46" y="48" width="8" height="10" fill="url(#baba-skin)" />
        <circle cx="50" cy="42" r="21" fill="url(#baba-skin)" />

        {/* hair bun + top knot */}
        <path d="M29 38 Q34 16 50 16 Q66 16 71 38 Q60 26 50 26 Q40 26 29 38 Z" fill="oklch(0.28 0.02 280)" />
        <circle cx="50" cy="13" r="6" fill="oklch(0.28 0.02 280)" />

        {/* beard */}
        <path
          d="M32 46 Q34 82 50 86 Q66 82 68 46 Q60 62 50 62 Q40 62 32 46 Z"
          fill="oklch(0.96 0.01 250)"
          opacity="0.95"
        />
        {/* moustache */}
        <path d="M38 55 Q50 50 62 55 Q50 58 38 55 Z" fill="oklch(0.96 0.01 250)" />

        {/* tilak */}
        <path d="M50 22 L47 34 L53 34 Z" fill="oklch(0.65 0.2 25)" />

        {/* brows */}
        <path d={e.brow} stroke="oklch(0.96 0.01 250)" strokeWidth="2.4" strokeLinecap="round" fill="none" />

        {/* eyes */}
        {e.eyes === "closed" ? (
          <>
            <path d="M36 46 q6 4 12 0" stroke="oklch(0.28 0.02 280)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M52 46 q6 4 12 0" stroke="oklch(0.28 0.02 280)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="42" cy="46" r={eyeR} fill="oklch(0.2 0.02 280)" />
            <circle cx="58" cy="46" r={eyeR} fill="oklch(0.2 0.02 280)" />
          </>
        )}

        {/* mouth (hidden behind beard mostly) */}
        <path d={e.mouth} stroke="oklch(0.42 0.1 30)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* third eye glow */}
        <circle cx="50" cy="31" r="1.8" fill="oklch(0.82 0.15 78)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        {[12, 38, 64, 86].map((left, i) => (
          <span
            key={left}
            className="absolute bottom-2 h-1 w-1 rounded-full bg-primary/70"
            style={{
              left: `${left}%`,
              animation: `motu-particle ${5 + i}s ease-out ${i * 1.1}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
