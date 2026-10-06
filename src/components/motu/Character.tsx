import { cn } from "@/lib/utils";
import { SKINS, type CharacterState, type Skin } from "@/lib/motu/data";

const FALLBACK: Skin = {
  id: "monk",
  name: "Motivation Monk",
  cost: 0,
  blurb: "Default vessel. Mildly enlightened.",
  emoji: "🧘",
  anim: "animate-breathe",
};

const STATE_LABEL: Record<CharacterState, string> = {
  idle: "IDLE",
  walking: "WALKING",
  searching: "SEARCHING",
  celebrating: "CELEBRATING",
  meditating: "MEDITATING",
  confused: "CONFUSED",
  exhausted: "EXHAUSTED",
  digging: "DIG DIG DIG",
};

const STATE_ANIM: Record<CharacterState, string> = {
  idle: "animate-breathe",
  walking: "animate-drift",
  searching: "animate-float",
  celebrating: "animate-bounce",
  meditating: "animate-float",
  confused: "animate-pulse",
  exhausted: "animate-breathe",
  digging: "animate-bounce",
};

export function Character({
  skinId = "monk",
  state = "idle",
  size = 96,
  showLabel = true,
  className,
}: {
  skinId?: string;
  state?: CharacterState;
  size?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const skin = SKINS.find((s) => s.id === skinId) ?? FALLBACK;
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full bg-signal/15 blur-2xl" />
        <div className="absolute bottom-0 h-2 w-2/3 rounded-full bg-void/70 blur-sm" />
        <div
          className={cn("relative", STATE_ANIM[state])}
          style={{ fontSize: size * 0.55, lineHeight: 1 }}
        >
          {skin.emoji}
        </div>
      </div>
      {showLabel && <span className="label-mono">{STATE_LABEL[state]}</span>}
    </div>
  );
}
