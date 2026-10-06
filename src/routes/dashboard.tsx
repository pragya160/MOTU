import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { MotivationCore, Counter } from "@/components/motu/MotivationCore";
import { BabaSays } from "@/components/motu/BabaSpeech";
import { useMotu } from "@/lib/motu/store";
import { BABA_LINES, METRICS, MISSIONS } from "@/lib/motu/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center — MOTU" },
      {
        name: "description",
        content: "Live motivation telemetry, signal strength, bed gravity and mission readiness.",
      },
      { property: "og:title", content: "Command Center — MOTU" },
      { property: "og:description", content: "Live telemetry for your missing motivation." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state } = useMotu();
  const hours = Math.floor(state.lastSeenMinutes / 60);
  const mins = state.lastSeenMinutes % 60;
  const next = MISSIONS.find((m) => !state.completedMissions.includes(m.id)) ?? MISSIONS[0]!;

  return (
    <AppShell>
      <PageTitle
        kicker="Unit status · live"
        title={`Namaste, ${state.name || "balak"}`}
        sub="MOTU is continuously monitoring the absence of your motivation with extremely expensive instruments."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="flex flex-col items-center justify-center gap-4 py-10">
          <MotivationCore value={state.motivation} />
          <p className="text-center text-sm text-muted-foreground">
            Last confirmed sighting:{" "}
            <span className="text-foreground">
              {hours}h {mins}m ago
            </span>{" "}
            · near a bed
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/scanner">
              <Button variant="signal">Start scan</Button>
            </Link>
            <Link to="/locate">
              <Button variant="ghost">Open case file</Button>
            </Link>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <p className="label-mono">Recovery points</p>
            <p className="font-display text-4xl font-bold text-primary">
              <Counter value={state.points} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Value in real life: 0.00</p>
          </Panel>
          <Panel>
            <p className="label-mono">Next mission</p>
            <p className="mt-1 font-display text-lg">{next.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{next.official}</p>
            <Link to="/missions" className="mt-4 block">
              <Button className="w-full">Accept</Button>
            </Link>
          </Panel>
          <Panel>
            <p className="label-mono">Ignored missions</p>
            <p className="font-display text-3xl font-bold text-alert">{state.ignoredMissions}</p>
            <p className="mt-1 text-xs text-muted-foreground">Baba is keeping count.</p>
          </Panel>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <Panel key={m.label} className="scanline">
            <p className="label-mono">{m.label}</p>
            <p
              className={cn(
                "mt-2 font-display text-2xl font-bold tabular-nums",
                m.tone === "alert" && "text-alert",
                m.tone === "warn" && "text-warn",
                m.tone === "signal" && "text-signal",
              )}
            >
              {m.value}
            </p>
          </Panel>
        ))}
      </section>

      <Panel hover={false} className="p-6">
        <BabaSays
          text={state.motivation < 30 ? BABA_LINES.low : BABA_LINES.high}
          state={state.motivation < 30 ? "disappointed" : "proud"}
          size={140}
          className="flex-col text-center sm:flex-row sm:text-left"
        />
      </Panel>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { to: "/map", title: "Motivation map", blurb: "Track it globally. Lose it locally." },
          { to: "/analytics", title: "Analytics", blurb: "Charts proving nothing, beautifully." },
          { to: "/friends", title: "Donate motivation", blurb: "Give away what you don't have." },
        ].map((c) => (
          <Link key={c.to} to={c.to}>
            <Panel className="h-full">
              <p className="font-display text-lg">{c.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
            </Panel>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
