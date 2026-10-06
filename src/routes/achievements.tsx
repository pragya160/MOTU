import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Panel, PageTitle } from "@/components/motu/Shell";
import { BabaSays } from "@/components/motu/BabaSpeech";
import { ACHIEVEMENTS, BABA_LINES } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — MOTU" },
      {
        name: "description",
        content: "Trophies for losing your motivation, finding socks and other heroic non-events.",
      },
      { property: "og:title", content: "Achievements — MOTU" },
      { property: "og:description", content: "Prestige, of a kind." },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const { state } = useMotu();
  const unlocked = ACHIEVEMENTS.filter((a) => state.unlocked.includes(a.id)).length;
  const pct = Math.round((unlocked / ACHIEVEMENTS.length) * 100);

  return (
    <AppShell>
      <PageTitle
        kicker="Hall of fame"
        title="Achievements"
        sub="Recognition for remarkable acts of doing nothing at all."
      />

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-3xl tabular-nums">
              {unlocked}
              <span className="text-lg text-muted-foreground"> / {ACHIEVEMENTS.length}</span>
            </p>
            <p className="label-mono mt-1">Trophies unlocked</p>
          </div>
          <div className="flex-1 basis-48">
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-signal)] transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="label-mono mt-2">{pct}% complete · the rest are impossible</p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const has = state.unlocked.includes(a.id);
          return (
            <Panel key={a.id} hover={has} className={cn("relative overflow-hidden", !has && "opacity-60")}>
              {has && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />}
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "grid h-14 w-14 shrink-0 place-items-center rounded-2xl border text-2xl",
                    has ? "border-primary/50 bg-primary/10 glow-aura" : "border-border bg-surface/60 grayscale",
                  )}
                >
                  {has ? a.emoji : "🔒"}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm tracking-wide">{a.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.blurb}</p>
                  <p className={cn("label-mono mt-2", has ? "text-ok" : "")}>
                    {has ? "UNLOCKED" : "LOCKED · keep losing"}
                  </p>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel>
        <BabaSays
          text={unlocked === 0 ? BABA_LINES.lost : BABA_LINES.complete}
          state={unlocked === 0 ? "disappointed" : "proud"}
        />
      </Panel>
    </AppShell>
  );
}
