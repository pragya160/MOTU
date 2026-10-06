import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Panel, PageTitle } from "@/components/motu/Shell";
import { DAY_CURVE, FORECAST, USELESS_STATS } from "@/lib/motu/data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — MOTU" },
      {
        name: "description",
        content:
          "Scientific-grade charts of your motivation's decline: day curves, weekly losses and tomorrow's forecast of doom.",
      },
      { property: "og:title", content: "Analytics — MOTU" },
      { property: "og:description", content: "The data was always going to look like this." },
    ],
  }),
  component: AnalyticsPage,
});

function DayCurve() {
  const w = 560;
  const h = 200;
  const pad = 24;
  const pts = DAY_CURVE.map((d, i) => {
    const x = pad + (i / (DAY_CURVE.length - 1)) * (w - pad * 2);
    const y = pad + (1 - d.v / 100) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-breathe"
      />
      <polyline
        points={`${pad},${h - pad} ${pts.join(" ")} ${w - pad},${h - pad}`}
        fill="oklch(0.79 0.16 72 / 10%)"
        stroke="none"
      />
      {DAY_CURVE.map((d, i) => {
        const [x, y] = pts[i]!.split(",");
        return (
          <g key={d.t}>
            <circle cx={x} cy={y} r="3.5" fill="var(--color-primary)" />
            <text x={x} y={h - 6} textAnchor="middle" className="fill-[var(--color-muted-foreground)]" fontSize="9" fontFamily="var(--font-mono)">
              {d.t}
            </text>
            <text x={x} y={Number(y) - 8} textAnchor="middle" className="fill-[var(--color-primary)]" fontSize="10" fontFamily="var(--font-mono)">
              {d.v}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function AnalyticsPage() {
  return (
    <AppShell>
      <PageTitle
        kicker="Data division"
        title="Analytics"
        sub="Peer-reviewed nonsense. Every chart confirms what you already feared."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {USELESS_STATS.slice(0, 3).map((stat) => <Panel key={stat.label} hover={false}><p className="font-display text-3xl text-aura-gradient">{stat.display ?? `${stat.value}${stat.unit}`}</p><p className="label-mono mt-2">{stat.label}</p></Panel>)}
      </div>

      <Panel>
        <p className="label-mono">Motivation decay · today</p>
        <div className="mt-4">
          <DayCurve />
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <p className="label-mono">Tomorrow's forecast</p>
          <div className="mt-4 space-y-3">
            {FORECAST.map((f) => (
              <div
                key={f.t}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface/40 px-4 py-3"
              >
                <span className="font-mono text-xs text-primary tabular-nums">{f.t}</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-alert)]"
                    style={{ width: `${f.v}%` }}
                  />
                </div>
                <span className="hidden font-mono text-[0.6rem] text-muted-foreground sm:inline">
                  {f.mood}
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <p className="label-mono">Additional evidence</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {USELESS_STATS.slice(3).map((s) => (
              <div key={s.label} className="rounded-md border border-border bg-surface/40 p-3">
                <p className="font-display text-2xl text-aura-gradient tabular-nums">
                  {s.display ?? `${s.value}${s.unit}`}
                </p>
                <p className="label-mono mt-1 text-[0.55rem]">{s.label}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
