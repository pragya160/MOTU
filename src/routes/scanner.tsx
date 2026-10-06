import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell, Button, Panel, PageTitle } from "@/components/motu/Shell";
import { BabaOverlay } from "@/components/motu/BabaSpeech";
import { BABA_LINES, FALSE_ALARMS, SCAN_OBJECTS, SEARCH_LOCATIONS } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "Motivation Scanner — MOTU" },
      {
        name: "description",
        content: "A 360° radar sweep of your room that reliably detects socks instead of motivation.",
      },
      { property: "og:title", content: "Motivation Scanner — MOTU" },
      { property: "og:description", content: "Sweep the room. Find a sock. Repeat." },
    ],
  }),
  component: Scanner,
});

function Scanner() {
  const { state, addPoints, notify, unlock } = useMotu();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const start = () => {
    if (scanning) return;
    setScanning(true);
    setResult(null);
    setProgress(0);
    setLog([]);
    let p = 0;
    timer.current = setInterval(() => {
      p += 4;
      setProgress(Math.min(100, p));
      if (p % 16 === 0) {
        const loc = SEARCH_LOCATIONS[Math.floor(Math.random() * SEARCH_LOCATIONS.length)];
        setLog((l) => [`Sweeping: ${loc} — no signal`, ...l].slice(0, 8));
      }
      if (p >= 100) {
        if (timer.current) clearInterval(timer.current);
        const alarm = FALSE_ALARMS[Math.floor(Math.random() * FALSE_ALARMS.length)]!;
        setScanning(false);
        setResult(alarm);
        addPoints(25);
        unlock("false-alarm");
        notify({ tone: "warn", title: "FALSE ALARM", body: alarm });
      }
    }, 70);
  };

  return (
    <AppShell>
      <PageTitle
        kicker="Instrument bay"
        title="Motivation scanner"
        sub="A 360° quantum radar sweep. Accuracy: extremely high. Usefulness: none."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel hover={false} className="grid place-items-center py-10">
          <div className="relative aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full border border-signal/30" />
            <div className="absolute inset-[12%] rounded-full border border-signal/20" />
            <div className="absolute inset-[28%] rounded-full border border-signal/15" />
            <div className="absolute inset-[44%] rounded-full border border-signal/10" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-signal/15" />
            <div className="absolute top-1/2 left-0 h-px w-full bg-signal/15" />
            <div
              className="absolute inset-0 rounded-full animate-spin-slow"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--color-signal) 0deg, transparent 55deg)",
                opacity: scanning ? 0.35 : 0.12,
                animationDuration: scanning ? "1.6s" : "16s",
              }}
            />
            {SCAN_OBJECTS.map((o, i) => {
              const a = (i / SCAN_OBJECTS.length) * Math.PI * 2;
              const r = 18 + (i % 4) * 8;
              return (
                <span
                  key={o.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80 px-2 py-1 font-mono text-[0.55rem] whitespace-nowrap"
                  style={{
                    left: `${50 + Math.cos(a) * r}%`,
                    top: `${50 + Math.sin(a) * r}%`,
                    opacity: progress > (i / SCAN_OBJECTS.length) * 100 ? 1 : 0.15,
                    color: "var(--color-primary-foreground)",
                  }}
                >
                  {o.name} {o.confidence}%
                </span>
              );
            })}
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-3xl font-bold tabular-nums text-signal">
                {progress}%
              </span>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel hover={false}>
            <p className="label-mono">Control</p>
            <Button className="mt-3 w-full" variant="signal" onClick={start} disabled={scanning}>
              {scanning ? "Scanning…" : "Initiate 360° sweep"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Each completed sweep awards 25 recovery points and 0 motivation.
            </p>
          </Panel>

          <Panel hover={false}>
            <p className="label-mono">Live telemetry</p>
            <div className="mt-3 space-y-1 font-mono text-[0.7rem] text-muted-foreground">
              {log.length === 0 && <p>› standby…</p>}
              {log.map((l, i) => (
                <p key={`${l}-${i}`} className="animate-rise">
                  › {l}
                </p>
              ))}
            </div>
          </Panel>

          <Panel hover={false}>
            <p className="label-mono">Signal strength</p>
            <p className="mt-1 font-display text-3xl font-bold text-alert">
              {(state.motivation / 10).toFixed(1)} dB
            </p>
            <p className="text-xs text-muted-foreground">Below the noise floor, as always.</p>
          </Panel>
        </div>
      </div>

      <BabaOverlay
        open={!!result}
        title="FALSE ALARM"
        text={`${BABA_LINES.scannerFail} ${result ?? ""}`}
        state="disappointed"
        onDone={() => setResult(null)}
      />
    </AppShell>
  );
}
