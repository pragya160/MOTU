import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { BabaSays } from "@/components/motu/BabaSpeech";
import { BABA_LINES, SKINS, STORE_ITEMS } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Store — MOTU" },
      {
        name: "description",
        content: "Spend hard-earned recovery points on premium motivation, golden scanners and a potato.",
      },
      { property: "og:title", content: "Store — MOTU" },
      { property: "og:description", content: "Buy things that do nothing. Gloriously." },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const { state, buySkin, buyItem, notify, addMotivation } = useMotu();
  const [flash, setFlash] = useState<string | null>(null);

  const say = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2600);
  };

  const purchase = (kind: "skin" | "item", id: string, cost: number, name: string) => {
    const ok = kind === "skin" ? buySkin(id, cost) : buyItem(id, cost);
    if (ok) {
      if (id === "premium") addMotivation(1);
      notify({ tone: "ok", title: "PURCHASE COMPLETE", body: `${name} acquired. Value retained: 0.` });
      say(`${name} — purchased. It will not help.`);
    } else {
      notify({
        tone: "critical",
        title: "TRANSACTION DECLINED",
        body: `Insufficient recovery points for ${name}. Do more useless missions.`,
      });
      say("Insufficient recovery points. Try doing a pointless mission.");
    }
  };

  return (
    <AppShell>
      <PageTitle
        kicker="Exchange"
        title="Store"
        sub="Recovery points, redeemable for goods of zero value. A perfectly circular economy."
      />

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label-mono">Recovery point balance</p>
            <p className="mt-1 font-display text-4xl font-bold text-primary tabular-nums">
              {state.points.toLocaleString()}
            </p>
          </div>
          <p className="max-w-xs text-xs text-muted-foreground">
            Earn points by completing missions. Spend them here. The points do not want this either.
          </p>
        </div>
        {flash && (
          <p className="mt-4 animate-pop rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 font-mono text-xs text-primary">
            {flash}
          </p>
        )}
      </Panel>

      <Panel>
        <p className="label-mono">Curated uselessness</p>
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {STORE_ITEMS.map((item) => {
            const owned = state.ownedItems.includes(item.id);
            const affordable = state.points >= item.cost;
            return (
              <div
                key={item.id}
                className="flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface-2 text-2xl">
                    {item.emoji}
                  </span>
                  <div>
                    <p className="font-display text-sm tracking-wide">{item.name}</p>
                    <p className="font-mono text-xs text-primary">{item.cost.toLocaleString()} pts</p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-xs text-muted-foreground">{item.blurb}</p>
                <div className="mt-4">
                  {owned ? (
                    <p className="rounded-lg border border-ok/40 bg-ok/10 py-2 text-center font-mono text-[0.6rem] text-ok">
                      OWNED · CONGRATULATIONS?
                    </p>
                  ) : (
                    <Button
                      className="w-full"
                      variant={affordable ? "primary" : "ghost"}
                      onClick={() => purchase("item", item.id, item.cost, item.name)}
                    >
                      {affordable ? "Purchase" : `${(item.cost - state.points).toLocaleString()} pts short`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <p className="label-mono">Vessel skins</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {SKINS.filter((s) => s.cost > 0).map((s) => {
            const owned = state.ownedSkins.includes(s.id);
            const affordable = state.points >= s.cost;
            return (
              <div
                key={s.id}
                className={cn(
                  "flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-signal/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("grid h-12 w-12 place-items-center rounded-xl bg-surface-2 text-2xl", s.anim)}>
                    {s.emoji}
                  </span>
                  <div>
                    <p className="font-display text-sm tracking-wide">{s.name}</p>
                    <p className="font-mono text-xs text-signal">{s.cost.toLocaleString()} pts</p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-xs text-muted-foreground">{s.blurb}</p>
                <div className="mt-4">
                  {owned ? (
                    <p className="rounded-lg border border-ok/40 bg-ok/10 py-2 text-center font-mono text-[0.6rem] text-ok">
                      OWNED · EQUIP IN CHARACTER
                    </p>
                  ) : (
                    <Button
                      className="w-full"
                      variant="signal"
                      disabled={!affordable}
                      onClick={() => purchase("skin", s.id, s.cost, s.name)}
                    >
                      {affordable ? "Purchase" : `${(s.cost - state.points).toLocaleString()} pts short`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <BabaSays text={BABA_LINES.high} state="talking" />
      </Panel>
    </AppShell>
  );
}
