import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Baba } from "@/components/motu/Baba";
import { CloudBubble } from "@/components/motu/BabaSpeech";
import { Button } from "@/components/motu/Shell";
import { BABA_LINES } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MOTU — Boot Sequence" },
      {
        name: "description",
        content:
          "Initialising the Motivation Tracking & Recovery Unit. Calibrating sensors. Locating your missing motivation.",
      },
      { property: "og:title", content: "MOTU — Boot Sequence" },
      {
        property: "og:description",
        content: "Initialising the Motivation Tracking & Recovery Unit.",
      },
    ],
  }),
  component: Index,
});

const BOOT_LINES = [
  "Initialising MOTU core...",
  "Calibrating motivation sensors...",
  "Scanning known hiding places...",
  "Contacting Baba for spiritual guidance...",
  "Motivation not found. Proceeding anyway.",
];

function Index() {
  const { state, signIn } = useMotu();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [booted, setBooted] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (state.signedIn) void navigate({ to: "/dashboard" });
  }, [state.signedIn, navigate]);

  useEffect(() => {
    if (booted) return;
    const id = setTimeout(() => {
      if (step >= BOOT_LINES.length - 1) setBooted(true);
      else setStep((s) => s + 1);
    }, 900);
    return () => clearTimeout(id);
  }, [step, booted]);

  const enter = (guest: boolean) => {
    signIn(guest ? "Anonymous Yoddha" : name, guest);
    void navigate({ to: "/dashboard" });
  };

  if (!booted) {
    return (
      <div className="grain grid min-h-screen place-items-center px-5">
        <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
          <Baba state="meditation" size={220} rays />
          <div>
            <h1 className="font-display text-4xl font-bold tracking-[0.35em] text-aura-gradient sm:text-6xl">
              MOTU
            </h1>
            <p className="label-mono mt-2">Motivation Tracking &amp; Recovery Unit</p>
          </div>
          <div className="w-full space-y-2">
            {BOOT_LINES.slice(0, step + 1).map((l) => (
              <p key={l} className="animate-rise font-mono text-xs text-muted-foreground sm:text-sm">
                <span className="text-signal">›</span> {l}
              </p>
            ))}
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${((step + 1) / BOOT_LINES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grain grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <Baba state="talking" size={170} />
          <CloudBubble text={BABA_LINES.login} tail="none" className="w-full" />
        </div>

        <form
          className="panel space-y-5 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            enter(false);
          }}
        >
          <div>
            <label className="label-mono" htmlFor="name">
              Operator identification
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name, balak"
              className="mt-2 w-full rounded-xl border border-input bg-surface/60 px-4 py-3 text-sm outline-none transition focus:border-primary/60 focus:glow-aura"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We do not store this. We do not store anything. We barely function.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="submit">Begin recovery</Button>
            <Button variant="ghost" onClick={() => enter(true)}>
              Continue without motivation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
