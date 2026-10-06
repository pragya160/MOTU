import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { Character } from "@/components/motu/Character";
import { BabaSays } from "@/components/motu/BabaSpeech";
import { BABA_LINES, SKINS, type CharacterState } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/character")({
  head: () => ({
    meta: [
      { title: "Character — MOTU" },
      {
        name: "description",
        content: "Dress your operator vessel in costumes with absolutely no tactical advantage.",
      },
      { property: "og:title", content: "Character — MOTU" },
      { property: "og:description", content: "Choose your vessel. It changes nothing." },
    ],
  }),
  component: CharacterPage,
});

const STATES: CharacterState[] = [
  "idle",
  "walking",
  "searching",
  "celebrating",
  "meditating",
  "confused",
  "exhausted",
  "digging",
];

function CharacterPage() {
  const { state, update } = useMotu();
  const [preview, setPreview] = useState<CharacterState>("idle");

  return (
    <AppShell>
      <PageTitle
        kicker="Operator vessel"
        title="Character"
        sub="Customize the unit that will fail to find your motivation. Cosmetics only. Obviously."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Panel className="flex flex-col items-center justify-center gap-6 py-10">
          <Character skinId={state.skin} state={preview} size={160} />
          <div className="flex flex-wrap justify-center gap-2">
            {STATES.map((s) => (
              <button
                key={s}
                onClick={() => setPreview(s)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-widest transition-all",
                  preview === s
                    ? "border-primary/60 bg-surface-2 text-primary"
                    : "border-border text-muted-foreground hover:bg-surface/60",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <p className="label-mono">Vessel wardrobe</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {SKINS.map((s) => {
                const owned = state.ownedSkins.includes(s.id);
                const equipped = state.skin === s.id;
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "rounded-2xl border p-4 transition-all",
                      equipped
                        ? "border-primary/60 glow-aura"
                        : "border-border bg-surface/40 hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("text-3xl", s.anim)}>{s.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-display text-sm">{s.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{s.blurb}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      {equipped ? (
                        <p className="rounded-lg border border-ok/40 bg-ok/10 py-1.5 text-center font-mono text-[0.6rem] text-ok">
                          EQUIPPED
                        </p>
                      ) : owned ? (
                        <Button className="w-full" onClick={() => update({ skin: s.id })}>
                          Equip
                        </Button>
                      ) : (
                        <p className="rounded-lg border border-border py-1.5 text-center font-mono text-[0.6rem] text-muted-foreground">
                          {s.cost} pts · buy in store
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <BabaSays text={BABA_LINES.boot} state="meditation" size={100} compact />
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
