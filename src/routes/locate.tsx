import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { BabaSays } from "@/components/motu/BabaSpeech";
import { CASE_EVIDENCE, SUSPECTS, BABA_LINES, SEARCH_LOCATIONS } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";

export const Route = createFileRoute("/locate")({
  head: () => ({
    meta: [
      { title: "Case File — MOTU" },
      {
        name: "description",
        content: "The official investigation into the disappearance of your motivation.",
      },
      { property: "og:title", content: "Case File — MOTU" },
      { property: "og:description", content: "Evidence, suspects and one very guilty bed." },
    ],
  }),
  component: Locate,
});

function Locate() {
  const { state, unlock, fileReport } = useMotu();
  const [checked, setChecked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [filed, setFiled] = useState<{ caseNumber: string; filedAt: string } | null>(null);

  const toggle = (l: string) => {
    unlock("under-the-bed");
    setChecked((c) => (c.includes(l) ? c.filter((x) => x !== l) : [...c, l]));
  };

  return (
    <AppShell>
      <PageTitle
        kicker={`Case #MTV-${state.lastSeenMinutes}`}
        title="The disappearance"
        sub="Status: OPEN · Likelihood of resolution: 4.6% · Assigned officer: a floating guru"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel hover={false}>
          <p className="label-mono">Evidence timeline</p>
          <ol className="mt-4 space-y-4 border-l border-border pl-5">
            {CASE_EVIDENCE.map((e) => (
              <li key={e.time} className="relative">
                <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                <p className="font-mono text-xs text-signal">{e.time}</p>
                <p className="text-sm">{e.text}</p>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface">
                  <div className="h-full bg-alert" style={{ width: `${e.weight}%` }} />
                </div>
                <p className="label-mono mt-1">Suspicion {e.weight}%</p>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="space-y-6">
          <Panel hover={false}>
            <p className="label-mono">Prime suspects</p>
            <div className="mt-4 space-y-3">
              {SUSPECTS.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-display tracking-wide">{s.name}</span>
                    <span className="font-mono text-xs text-alert">{s.guilt}% guilty</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-warn to-alert transition-all duration-700"
                      style={{ width: `${s.guilt}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel hover={false}>
            <p className="label-mono">Search checklist</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {SEARCH_LOCATIONS.map((l) => (
                <button
                  key={l}
                  onClick={() => toggle(l)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition-all ${
                    checked.includes(l)
                      ? "border-ok/50 bg-ok/10 text-ok line-through"
                      : "border-border bg-surface/40 hover:border-primary/40"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {checked.length} of {SEARCH_LOCATIONS.length} locations searched. Motivation found: 0.
            </p>
          </Panel>
        </div>
      </div>

      <Panel hover={false} className="p-6">
        <BabaSays
          text={BABA_LINES.suspect}
          state="confused"
          size={130}
          className="flex-col text-center sm:flex-row sm:text-left"
        />
      </Panel>

      <Panel hover={false}>
        <p className="label-mono">Official conclusion</p>
        <p className="mt-2 font-display text-xl">
          Your motivation was last seen entering a bed and has not been heard from since.
        </p>
        <label className="label-mono mt-5 block" htmlFor="report-note">Final witness statement</label>
        <textarea id="report-note" value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="Describe the exact moment productivity vanished..." />
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button variant="ghost" onClick={() => { unlock("never-there"); setFiled(fileReport(note)); }}>
            File the report nobody will read
          </Button>
          {filed && <div className="animate-pop rounded-md border border-ok/40 bg-ok/10 px-4 py-2"><p className="font-mono text-xs text-ok">REPORT SUCCESSFULLY IGNORED</p><p className="mt-1 text-xs text-muted-foreground">{filed.caseNumber} · Filed {filed.filedAt}</p></div>}
        </div>
      </Panel>
    </AppShell>
  );
}
