import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { BabaSays } from "@/components/motu/BabaSpeech";
import { BABA_LINES, FRIENDS, GLOBAL_STATS } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map & Globe — MOTU" },
      {
        name: "description",
        content:
          "Planetary motivation surveillance: friend blips, collision forecasts and a globe that spins for no reason.",
      },
      { property: "og:title", content: "Map & Globe — MOTU" },
      { property: "og:description", content: "Motivation, but from orbit." },
    ],
  }),
  component: MapPage,
});

function Globe() {
  return (
    <div className="relative mx-auto grid h-72 w-72 place-items-center [perspective:700px]">
      <div className="absolute inset-5 rounded-full bg-signal/15 blur-3xl animate-breathe" />
      <div className="absolute inset-1/2 h-px w-[140%] -translate-x-1/2 -rotate-12 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="relative h-52 w-52 overflow-hidden rounded-full border border-signal/50 bg-[radial-gradient(circle_at_35%_30%,oklch(0.68_0.12_195/35%),oklch(0.1_0.05_278/95%)_65%)] shadow-[inset_-28px_-18px_50px_oklch(0.03_0.04_280/90%),0_0_45px_oklch(0.72_0.14_195/20%)]">
        <div className="absolute -inset-x-full inset-y-0 animate-drift bg-[repeating-radial-gradient(ellipse_at_center,transparent_0_18px,oklch(0.78_0.12_195/18%)_19px_20px)] [animation-duration:12s]" />
        <div className="absolute inset-0 rounded-full border-x border-signal/30 animate-spin-slow" />
        <div className="absolute inset-x-0 top-1/3 h-px bg-signal/25" /><div className="absolute inset-x-0 top-2/3 h-px bg-signal/25" />
        <div className="absolute left-5 top-10 h-12 w-20 -rotate-12 rounded-[55%_40%_65%_35%] bg-ok/25 blur-[2px]" />
        <div className="absolute bottom-8 right-5 h-14 w-16 rotate-12 rounded-[40%_60%_35%_65%] bg-primary/25 blur-[2px]" />
        <span className="absolute left-[44%] top-[46%] text-sm animate-pulse">🧍</span>
      </div>
      <div className="absolute inset-5 rounded-full border border-signal/20 animate-spin-slow [animation-duration:14s] before:absolute before:left-1/2 before:top-[-4px] before:h-2 before:w-2 before:rounded-full before:bg-signal before:shadow-[0_0_12px_var(--color-signal)]" />
      <p className="label-mono absolute -bottom-2">PLANET EARTH (ALLEGEDLY)</p>
    </div>
  );
}

function MapPage() {
  const { state, addMotivation, unlock, notify } = useMotu();
  const [collided, setCollided] = useState<string | null>(null);
  const [colliding, setColliding] = useState(false);
  const allFriends = [...FRIENDS, ...state.simulatedFriends];

  const simulateCollision = () => {
    const shuffled = [...allFriends].sort(() => Math.random() - 0.5);
    const a = shuffled[0]!;
    const b = shuffled[1]!;
    setCollided(null);
    setColliding(true);
    window.setTimeout(() => {
      setCollided(`${a.name} × ${b.name}`);
      addMotivation(2);
      unlock("signal");
      notify({ tone: "ok", title: "MOTIVATION COLLISION DETECTED 💥", body: `${a.name} and ${b.name} achieved proximity. Scientific value remains zero.` });
    }, 1300);
    window.setTimeout(() => setColliding(false), 2400);
  };

  return (
    <AppShell>
      <PageTitle
        kicker="Orbital surveillance"
        title="Map & globe"
        sub="Every motivation on Earth, tracked in real time, understood by no one."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <p className="label-mono">Motivation globe · live feed</p>
          <div className="py-8">
            <Globe />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GLOBAL_STATS.map((g) => (
              <div key={g.label} className="rounded-xl border border-border bg-surface/40 p-3">
                <p className="font-mono text-sm text-primary tabular-nums">
                  {g.value.toLocaleString()}
                  {g.suffix}
                </p>
                <p className="label-mono mt-1 text-[0.55rem]">{g.label}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <p className="label-mono">Local sector · friend blips</p>
          <div className="scanline relative mt-4 h-72 overflow-hidden rounded-2xl border border-border bg-surface/30">
            <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M4 80 Q28 12 51 55 T96 22" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" strokeDasharray="2 2" /><circle cx="50" cy="50" r="28" fill="none" stroke="var(--color-signal)" strokeWidth="0.25" /></svg>
            {allFriends.map((f) => (
              <div
                key={f.id}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
              >
                <span className="absolute -inset-3 rounded-full border border-signal/40 animate-breathe" />
                <span className="relative grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-base">
                  {f.motivation > 50 ? "😀" : f.motivation > 25 ? "😐" : "😵"}
                </span>
                <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 w-40 -translate-x-1/2 rounded-lg border border-border bg-card/90 p-2 text-center opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <p className="font-display text-xs">{f.name}</p>
                  <p className="label-mono mt-0.5 text-[0.5rem]">
                    {f.motivation}% · {f.distance}
                  </p>
                </div>
              </div>
            ))}
            <p className="label-mono absolute bottom-3 left-4 text-[0.55rem]">hover a blip</p>
          </div>

          <div className="mt-4 space-y-2">
            {allFriends.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface/40 px-4 py-2.5"
              >
                <span className="font-display text-sm">{f.name}</span>
                <span className="flex items-center gap-4 font-mono text-[0.65rem] text-muted-foreground">
                  <span>{f.distance}</span>
                  <span className={cn(f.motivation > 50 ? "text-ok" : "text-alert")}>
                    {f.motivation}%
                  </span>
                  <span className="hidden sm:inline">{f.status}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        {colliding && <div className="relative mb-6 grid h-52 place-items-center overflow-hidden rounded-md border border-primary/30 bg-[radial-gradient(circle,oklch(0.72_0.15_80/14%),transparent_65%)]"><div className="absolute flex items-center gap-3"><span className="animate-collision-left text-5xl">🧍</span><span className="animate-impact text-5xl">💥</span><span className="animate-collision-right text-5xl">🧑‍🚀</span></div><p className="label-mono absolute bottom-4 animate-pulse text-primary">CALCULATING MOTIVATIONAL IMPACT...</p></div>}
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <BabaSays
            text={collided ? BABA_LINES.collision : BABA_LINES.friend}
            state={collided ? "excited" : "talking"}
            className="flex-1"
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button variant="signal" onClick={simulateCollision}>
            Simulate motivation collision
          </Button>
          {collided && (
            <p className="font-mono text-xs text-ok animate-pop">
              COLLISION RECORDED: {collided} · +2% recovered
            </p>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
