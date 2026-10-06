import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { BabaSays } from "@/components/motu/BabaSpeech";
import { BABA_LINES, SEARCH_LOCATIONS } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — MOTU" },
      {
        name: "description",
        content: "A forensic log of exactly where and when your motivation died each day.",
      },
      { property: "og:title", content: "Journal — MOTU" },
      { property: "og:description", content: "Every loss, timestamped. No judgement. Some judgement." },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const { state, addJournal, notify } = useMotu();
  const [activity, setActivity] = useState("");
  const [killer, setKiller] = useState("");
  const [place, setPlace] = useState<string>("Under your bed");
  const [level, setLevel] = useState(50);

  const submit = () => {
    if (!activity.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    addJournal({ time, activity: activity.trim(), level, killer: killer.trim() || "Unknown", place });
    notify({
      tone: "warn",
      title: "LOG ENTRY ADDED",
      body: `Motivation fell to ${level}% during "${activity.trim()}". Recorded for posterity.`,
    });
    setActivity("");
    setKiller("");
    setLevel(50);
  };

  return (
    <AppShell>
      <PageTitle
        kicker="Forensic diary"
        title="Motivation journal"
        sub="Log every activity and what killed your motivation during it. Science demands it."
      />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <p className="label-mono">Entry log · {state.journal.length} recorded</p>
          <div className="mt-4 space-y-3">
            {[...state.journal].reverse().map((j) => (
              <div
                key={j.id}
                className="rounded-2xl border border-border bg-surface/40 p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-primary tabular-nums">{j.time}</span>
                    <span className="font-display text-sm">{j.activity}</span>
                  </div>
                  <span
                    className={
                      "font-mono text-xs tabular-nums " +
                      (j.level > 50 ? "text-ok" : j.level > 20 ? "text-warn" : "text-alert")
                    }
                  >
                    {j.level}%
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface">
                  <div
                    className={
                      "h-full rounded-full " +
                      (j.level > 50 ? "bg-ok" : j.level > 20 ? "bg-warn" : "bg-alert")
                    }
                    style={{ width: `${j.level}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Motivation killer: <span className="text-foreground">{j.killer}</span> · Last seen
                  near: <span className="text-foreground">{j.place}</span>
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <p className="label-mono">New entry</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="label-mono" htmlFor="j-activity">
                  Activity
                </label>
                <input
                  id="j-activity"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  placeholder="e.g. 'Studying' (allegedly)"
                  className="mt-2 w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
                />
              </div>
              <div>
                <label className="label-mono" htmlFor="j-killer">
                  Motivation killer
                </label>
                <input
                  id="j-killer"
                  value={killer}
                  onChange={(e) => setKiller(e.target.value)}
                  placeholder="e.g. Phone, bed, slide 41…"
                  className="mt-2 w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
                />
              </div>
              <div>
                <label className="label-mono" htmlFor="j-place">
                  Motivation last seen near
                </label>
                <select
                  id="j-place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm outline-none focus:border-primary/60"
                >
                  {SEARCH_LOCATIONS.map((l) => (
                    <option key={l} value={l} className="bg-surface text-foreground">
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="label-mono" htmlFor="j-level">
                    Motivation level after
                  </label>
                  <span className="font-mono text-xs tabular-nums text-primary">{level}%</span>
                </div>
                <input
                  id="j-level"
                  type="range"
                  min={0}
                  max={100}
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--color-primary)]"
                />
              </div>
              <Button className="w-full" onClick={submit} disabled={!activity.trim()}>
                Commit to the record
              </Button>
            </div>
          </Panel>

          <Panel>
            <BabaSays text={BABA_LINES.search} state="talking" size={100} compact />
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
