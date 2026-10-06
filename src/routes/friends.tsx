import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { BabaSays } from "@/components/motu/BabaSpeech";
import { BABA_LINES, FRIENDS } from "@/lib/motu/data";
import { useMotu, motivationStatus } from "@/lib/motu/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: "Friends — MOTU" },
      {
        name: "description",
        content: "Track your friends' motivation, donate yours, receive nothing back.",
      },
      { property: "og:title", content: "Friends — MOTU" },
      { property: "og:description", content: "Motivation networking. One-way only." },
    ],
  }),
  component: FriendsPage,
});

function FriendsPage() {
  const { state, update, addMotivation, unlock, notify, addFriend } = useMotu();
  const [lastDonate, setLastDonate] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [feedback, setFeedback] = useState("");
  const allFriends = [...FRIENDS.map((friend) => ({ ...friend, username: friend.name.toLowerCase(), online: true })), ...state.simulatedFriends];

  const donate = (name: string) => {
    if (state.motivation < 5) {
      notify({
        tone: "critical",
        title: "DONATION DENIED",
        body: "You cannot donate motivation you do not have.",
      });
      return;
    }
    addMotivation(-5);
    update({ donated: state.donated + 5 });
    setLastDonate(name);
    unlock("donor");
    notify({ tone: "ok", title: "DONATION SENT", body: `5% motivation donated to ${name}.` });
  };

  return (
    <AppShell>
      <PageTitle
        kicker="Motivation network"
        title="Friends"
        sub="Observe, compare, and donate. Do not expect reciprocity — the network is strictly one-way."
      />

      <Panel hover={false} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1"><label className="label-mono" htmlFor="squad-username">Add by username</label><input id="squad-username" className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="@cosmic_procrastinator" value={username} onChange={(event) => setUsername(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { const result = addFriend(username); setFeedback(result.message); if (result.ok) setUsername(""); } }} /></div>
        <Button onClick={() => { const result = addFriend(username); setFeedback(result.message); if (result.ok) setUsername(""); }}>Add to squad</Button>
        {feedback && <p className="text-xs text-muted-foreground sm:max-w-56">{feedback}</p>}
      </Panel>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {allFriends.map((f) => {
          const s = motivationStatus(f.motivation);
          return (
            <Panel key={f.id} className="flex h-full flex-col">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-2xl">
                  {f.motivation > 50 ? "😀" : f.motivation > 25 ? "😐" : "😵"}
                </span>
                <div>
                  <p className="font-display text-lg">{f.name}</p>
                   <p className="label-mono">@{f.username} · {f.distance} away</p>
                </div>
              </div>
              <p className="mt-4 font-mono text-[0.65rem] text-muted-foreground">{f.status}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">motivation</span>
                  <span className={cn("tabular-nums", f.motivation > 50 ? "text-ok" : "text-alert")}>
                    {f.motivation}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      f.motivation > 50 ? "bg-ok" : "bg-alert",
                    )}
                    style={{ width: `${f.motivation}%` }}
                  />
                </div>
              </div>
              <p className="mt-3 label-mono">{s.label}</p>
              <div className="mt-auto pt-5">
                <Button
                  variant="signal"
                  className="w-full"
                  onClick={() => donate(f.name)}
                  disabled={state.motivation < 5}
                >
                  Donate 5% motivation
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel>
        <BabaSays
          text={lastDonate ? BABA_LINES.donate : BABA_LINES.greeting}
          state={lastDonate ? "proud" : "talking"}
        />
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-surface/40 p-4">
            <p className="font-display text-2xl text-primary tabular-nums">{state.donated}%</p>
            <p className="label-mono mt-1">Total donated</p>
          </div>
          <div className="rounded-xl border border-border bg-surface/40 p-4">
             <p className="font-display text-2xl tabular-nums">{allFriends.length}</p>
            <p className="label-mono mt-1">Tracked friends</p>
          </div>
          <div className="rounded-xl border border-border bg-surface/40 p-4">
            <p className="font-display text-2xl text-alert tabular-nums">0</p>
            <p className="label-mono mt-1">Donations received</p>
          </div>
          <div className="rounded-xl border border-border bg-surface/40 p-4">
            <p className="font-display text-2xl text-ok tabular-nums">
              {state.motivation >= 5 ? "YES" : "NO"}
            </p>
            <p className="label-mono mt-1">Can donate today</p>
          </div>
        </div>
      </Panel>
    </AppShell>
  );
}
