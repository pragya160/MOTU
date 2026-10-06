import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Baba } from "./Baba";
import type { BabaState } from "@/lib/motu/data";

export function useTypewriter(text: string, speed = 26, active = true) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) {
      setOut(text);
      return;
    }
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);
  return out;
}

/** Cloud-shaped speech bubble. Never a plain rectangle — Baba speaks through clouds. */
export function CloudBubble({
  text,
  className,
  typing = true,
  tail = "left",
}: {
  text: string;
  className?: string;
  typing?: boolean;
  tail?: "left" | "bottom" | "none";
}) {
  const typed = useTypewriter(text, 24, typing);
  return (
    <div className={cn("relative animate-pop", className)}>
      {/* cloud puffs */}
      <div className="absolute -left-3 top-2 h-10 w-10 rounded-full bg-card/85 backdrop-blur-xl" />
      <div className="absolute -top-4 left-8 h-12 w-12 rounded-full bg-card/85 backdrop-blur-xl" />
      <div className="absolute -top-5 right-10 h-14 w-14 rounded-full bg-card/85 backdrop-blur-xl" />
      <div className="absolute -right-4 top-4 h-11 w-11 rounded-full bg-card/85 backdrop-blur-xl" />
      <div className="absolute -bottom-4 left-12 h-11 w-11 rounded-full bg-card/85 backdrop-blur-xl" />
      <div className="absolute -bottom-3 right-14 h-9 w-9 rounded-full bg-card/85 backdrop-blur-xl" />
      <div className="relative rounded-[2rem] bg-card/85 px-6 py-5 backdrop-blur-xl glow-aura">
        <p className="relative font-display text-base leading-relaxed text-foreground sm:text-lg">
          <span className="text-primary">“</span>
          {typed}
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-primary align-middle" />
          <span className="text-primary">”</span>
        </p>
        <p className="label-mono relative mt-2">— MOTU BABA</p>
      </div>
      {tail === "left" && (
        <>
          <div className="absolute -left-7 bottom-3 h-4 w-4 rounded-full bg-card/80" />
          <div className="absolute -left-12 bottom-0 h-2.5 w-2.5 rounded-full bg-card/70" />
        </>
      )}
      {tail === "bottom" && (
        <>
          <div className="absolute -bottom-8 left-10 h-4 w-4 rounded-full bg-card/80" />
          <div className="absolute -bottom-12 left-6 h-2.5 w-2.5 rounded-full bg-card/70" />
        </>
      )}
    </div>
  );
}

/** Inline Baba + cloud, used across pages. */
export function BabaSays({
  text,
  state = "talking",
  size = 120,
  className,
  compact = false,
}: {
  text: string;
  state?: BabaState;
  size?: number;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-6", compact && "gap-3", className)}>
      <Baba state={state} size={size} className="shrink-0" />
      <CloudBubble text={text} className="flex-1" />
    </div>
  );
}

/** Full-screen dramatic Baba moment. */
export function BabaOverlay({
  open,
  text,
  state = "talking",
  title,
  onDone,
  duration = 4200,
}: {
  open: boolean;
  text: string;
  state?: BabaState;
  title?: string;
  onDone?: () => void;
  duration?: number;
}) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => doneRef.current?.(), duration);
    return () => clearTimeout(id);
  }, [open, duration]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-void/85 px-5 backdrop-blur-md grain animate-in fade-in"
      onClick={() => onDone?.()}
    >
      <div className="flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <Baba state={state} size={220} rays className="animate-pop" />
        {title && (
          <h2 className="animate-rise font-display text-2xl tracking-[0.2em] text-aura-gradient sm:text-4xl">
            {title}
          </h2>
        )}
        <CloudBubble text={text} tail="none" className="w-full" />
        <p className="label-mono animate-pulse">tap anywhere to continue</p>
      </div>
    </div>
  );
}
