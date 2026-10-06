import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { Character } from "@/components/motu/Character";
import { BabaOverlay, CloudBubble } from "@/components/motu/BabaSpeech";
import { Baba } from "@/components/motu/Baba";
import { BABA_LINES, MISSIONS, type Mission } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missions — MOTU" },
      {
        name: "description",
        content: "Officially classified recovery operations: search under your bed, find something blue, dig a hole.",
      },
      { property: "og:title", content: "Missions — MOTU" },
      { property: "og:description", content: "Heroic tasks with no purpose whatsoever." },
    ],
  }),
  component: Missions,
});

const DIFF_COLOR: Record<Mission["difficulty"], string> = {
  TRIVIAL: "text-ok",
  MODERATE: "text-warn",
  HARD: "text-primary",
  LEGENDARY: "text-alert",
};

function Missions() {
  const { state, completeMission, update, unlock } = useMotu();
  const [active, setActive] = useState<Mission | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<Mission | null>(null);

  const run = (m: Mission) => {
    setRunning(true);
    setTimeout(() => {
      completeMission(m.id, m.reward, m.motivationGain);
      unlock("signal");
      if (m.id === "m01") unlock("under-the-bed");
      setRunning(false);
      setActive(null);
      setDone(m);
    }, 2600);
  };

  const ignore = (m: Mission) => {
    update({ ignoredMissions: state.ignoredMissions + 1 });
    if (state.ignoredMissions + 1 >= 10) unlock("procrastinator");
    setActive(null);
    void m;
  };

  return (
    <AppShell>
      <PageTitle
        kicker="Operations board"
        title="Recovery missions"
        sub="Each mission is officially classified, scientifically pointless and generously rewarded."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {MISSIONS.map((m) => {
          const complete = state.completedMissions.includes(m.id);
          return (
            <Panel key={m.id} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <p className="label-mono">{m.code}</p>
                <span className={cn("font-mono text-[0.6rem]", DIFF_COLOR[m.difficulty])}>
                  {m.difficulty}
                </span>
              </div>
              <h2 className="mt-2 font-display text-lg leading-tight">{m.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{m.official}</p>
              <div className="mt-4 flex flex-wrap gap-3 font-mono text-[0.65rem] text-muted-foreground">
                <span className="text-primary">+{m.reward} pts</span>
                <span className="text-ok">+{m.motivationGain}% motivation</span>
                <span>⏱ {m.time}</span>
                <span>💪 {m.required}% required</span>
              </div>
              <div className="mt-auto pt-5">
                {complete ? (
                  <p className="rounded-xl border border-ok/40 bg-ok/10 px-3 py-2 text-center text-xs text-ok">
                    COMPLETED
                  </p>
                ) : (
                  <Button className="w-full" onClick={() => setActive(m)}>
                    Open briefing
                  </Button>
                )}
              </div>
            </Panel>
          );
        })}
      </div>

      {active && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-void/85 px-4 py-8 backdrop-blur-md">
          <div className="panel grain max-h-full w-full max-w-2xl animate-pop overflow-y-auto p-6">
            <p className="label-mono">{active.code} · briefing</p>
            <h2 className="mt-1 font-display text-2xl text-aura-gradient">{active.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{active.official}</p>

            <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row">
              <Baba state={running ? "excited" : "talking"} size={120} className="shrink-0" />
              <CloudBubble text={active.baba} className="flex-1" />
            </div>

            <div className="mt-6 flex items-center justify-center">
              <Character
                skinId={state.skin}
                state={running ? active.characterState : "idle"}
                size={120}
              />
            </div>

            {running && (
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-surface">
                <div className="h-full w-full origin-left animate-drift bg-primary" />
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button variant="ghost" onClick={() => ignore(active)} disabled={running}>
                Ignore (again)
              </Button>
              <Button onClick={() => run(active)} disabled={running}>
                {running ? "In progress…" : "Accept mission"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <BabaOverlay
        open={!!done}
        title="MISSION COMPLETE"
        text={BABA_LINES.complete}
        state="celebrating"
        onDone={() => setDone(null)}
      />
    </AppShell>
  );
}
