import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { BabaSays } from "@/components/motu/BabaSpeech";
import { BABA_LINES, REMINDER_OPTIONS } from "@/lib/motu/data";
import { useMotu, motivationStatus } from "@/lib/motu/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — MOTU" },
      {
        name: "description",
        content: "Operator credentials, alert settings and the emergency self-destruct (data reset).",
      },
      { property: "og:title", content: "Profile — MOTU" },
      { property: "og:description", content: "You, as MOTU sees you. Unflattering but accurate." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { state, update, signOut, toggleReminder, notify } = useMotu();
  const navigate = useNavigate();
  const s = motivationStatus(state.motivation);

  const reset = () => {
    try {
      localStorage.removeItem("motu:v1");
    } catch {
      /* ignore */
    }
    notify({ tone: "warn", title: "DATA PURGE", body: "All records erased. Your motivation remains missing." });
    window.location.reload();
  };

  return (
    <AppShell>
      <PageTitle
        kicker="Operator file"
        title="Profile"
        sub="Your credentials, your alerts, and the button that erases everything."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <p className="label-mono">Operator identity</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-primary/40 bg-primary/10 text-3xl">
              {state.guest ? "🕵️" : "🧍"}
            </span>
            <div className="flex-1">
              <input
                value={state.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Enter operator name"
                className="w-full rounded-xl border border-border bg-surface/50 px-4 py-3 font-display text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
              />
              <p className="label-mono mt-2">
                {state.guest ? "GUEST MODE · witness protection" : "REGISTERED OPERATOR"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="font-display text-2xl text-primary tabular-nums">{state.points.toLocaleString()}</p>
              <p className="label-mono mt-1">Recovery points</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="font-display text-2xl text-signal tabular-nums">{state.donated}%</p>
              <p className="label-mono mt-1">Motivation donated</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className={cn("font-display text-2xl tabular-nums", s.tone === "alert" ? "text-alert" : "text-ok")}>
                {state.motivation}%
              </p>
              <p className="label-mono mt-1">{s.label}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="font-display text-2xl text-alert tabular-nums">{state.lastSeenMinutes}m</p>
              <p className="label-mono mt-1">Since motivation seen</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {state.signedIn ? (
              <Button
                variant="danger"
                onClick={() => {
                  signOut();
                  navigate({ to: "/" });
                }}
              >
                Sign out
              </Button>
            ) : (
              <Button onClick={() => navigate({ to: "/" })}>Sign in</Button>
            )}
            <Button variant="ghost" onClick={reset}>
              Erase all records
            </Button>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <p className="label-mono">Alert settings</p>
            <div className="mt-4 space-y-2">
              {REMINDER_OPTIONS.map((r) => {
                const on = state.reminders.includes(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => toggleReminder(r.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                      on
                        ? "border-primary/50 bg-primary/10"
                        : "border-border bg-surface/40 hover:border-primary/30",
                    )}
                  >
                    <span>
                      <span className="block font-display text-sm">{r.label}</span>
                      <span className="label-mono mt-0.5 block">{r.time}</span>
                    </span>
                    <span
                      className={cn(
                        "flex h-6 w-11 items-center rounded-full border px-0.5 transition-colors",
                        on ? "border-primary/60 bg-primary/30" : "border-border bg-surface",
                      )}
                    >
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full transition-transform duration-300",
                          on ? "translate-x-5 bg-primary" : "bg-muted-foreground",
                        )}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <p className="label-mono">Notification archive</p>
            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              {state.notifications.map((n) => (
                <div key={n.id} className="rounded-xl border border-border bg-surface/40 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "font-mono text-[0.6rem] tracking-widest",
                        n.tone === "critical" && "text-alert",
                        n.tone === "alert" && "text-alert",
                        n.tone === "warn" && "text-warn",
                        n.tone === "ok" && "text-ok",
                      )}
                    >
                      {n.title}
                    </span>
                    <span className="label-mono text-[0.5rem]">{n.at}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <BabaSays text={BABA_LINES.ignore} state="talking" size={100} compact />
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
