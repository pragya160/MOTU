import { Link } from "@tanstack/react-router";
import { MessageCircle, Moon, Sun, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMotu, motivationStatus } from "@/lib/motu/store";
import { FriendRail } from "./FriendRail";
import { BabaAlert } from "./BabaAlert";

export const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: "🛰️" },
  { to: "/locate", label: "Locate", icon: "🔎" },
  { to: "/missions", label: "Missions", icon: "🎯" },
  { to: "/map", label: "Map & Globe", icon: "🌍" },
  { to: "/friends", label: "Friends", icon: "🤝" },
] as const;

const MORE_NAV = [
  { to: "/scanner", label: "Scanner", icon: "📡" },
  { to: "/character", label: "Character", icon: "🧍" },
  { to: "/journal", label: "Journal", icon: "📓" },
  { to: "/analytics", label: "Analytics", icon: "📈" },
  { to: "/achievements", label: "Achievements", icon: "🏅" },
  { to: "/store", label: "Store", icon: "🛒" },
  { to: "/profile", label: "Profile", icon: "⚙️" },
] as const;

export function Panel({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn("panel p-5", hover && "panel-hover", className)}>{children}</div>
  );
}

export function PageTitle({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <header className="animate-rise">
      <p className="label-mono">{kicker}</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-aura-gradient sm:text-5xl">
        {title}
      </h1>
      {sub && <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{sub}</p>}
    </header>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "signal" | "danger";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-display text-sm tracking-[0.12em] uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:glow-aura",
        variant === "signal" &&
          "bg-signal text-signal-foreground hover:-translate-y-0.5 hover:glow-signal",
        variant === "danger" && "bg-destructive text-destructive-foreground hover:-translate-y-0.5",
        variant === "ghost" &&
          "border border-border bg-surface/40 text-foreground hover:border-primary/50 hover:bg-surface",
        className,
      )}
    >
      {children}
    </button>
  );
}

function StatusChip() {
  const { state } = useMotu();
  const s = motivationStatus(state.motivation);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-3 py-2">
      <span
        className={cn(
          "h-2 w-2 animate-pulse rounded-full",
          s.tone === "alert" ? "bg-alert" : s.tone === "warn" ? "bg-warn" : "bg-ok",
        )}
      />
      <span className="font-mono text-xs tabular-nums">{state.motivation}%</span>
      <span className="hidden text-xs text-muted-foreground sm:inline">{s.label}</span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state, setTheme } = useMotu();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      {/* sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 shrink-0 overflow-y-auto border-r border-border bg-sidebar/95 px-4 py-6 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link to="/dashboard" className="block px-2" onClick={() => setOpen(false)}>
          <p className="font-display text-2xl font-bold tracking-[0.3em] text-aura-gradient">MOTU</p>
          <p className="label-mono mt-1 text-[0.55rem]">Motivation Tracking &amp; Recovery Unit</p>
        </Link>

        <nav className="mt-6 space-y-1" aria-label="Primary navigation">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "bg-surface-2 text-foreground glow-aura" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-surface/60" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all"
            >
              <span className="text-base">{n.icon}</span>
              <span className="font-display tracking-wide">{n.label}</span>
            </Link>
          ))}
        </nav>

        <div className="my-3 h-px bg-border" />
        <Link to="/baba" onClick={() => setOpen(false)} activeProps={{ className: "bg-primary/15 text-primary" }} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-surface"><MessageCircle className="h-4 w-4" /><span className="font-display">Talk to Baba Ji</span></Link>
        <Link to="/reels" onClick={() => setOpen(false)} activeProps={{ className: "bg-primary/15 text-primary" }} className="mt-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-surface"><span>📱</span><span className="font-display">Reel Multitasking</span></Link>

        <details className="mt-3" open>
          <summary className="cursor-pointer px-3 py-2 font-mono text-[0.65rem] uppercase text-muted-foreground">More systems</summary>
          <nav className="space-y-1" aria-label="More navigation">
            {MORE_NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeProps={{ className: "bg-surface-2 text-foreground" }} inactiveProps={{ className: "text-muted-foreground hover:bg-surface/60" }} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"><span>{n.icon}</span><span>{n.label}</span></Link>)}
          </nav>
        </details>

        <div className="mt-6 rounded-xl border border-border bg-surface/40 p-4">
          <p className="label-mono">Recovery points</p>
          <p className="mt-1 font-display text-2xl font-bold text-primary tabular-nums">
            {state.points.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Redeemable for absolutely nothing of value.
          </p>
        </div>
      </aside>

      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-void/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col xl:pr-16">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-void/70 px-4 py-3 backdrop-blur-xl">
          <button
            className="rounded-lg border border-border px-3 py-2 text-sm lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <p className="label-mono hidden sm:block">
            Operator: {state.name || "unidentified"} · Unit status: searching
          </p>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/friends" className="rounded-md border border-border p-2 xl:hidden" aria-label="Friends"><Users className="h-4 w-4" /></Link>
            <button className="rounded-md border border-border p-2 hover:bg-accent" aria-label={`Switch to ${state.theme === "dark" ? "light" : "dark"} mode`} onClick={() => setTheme(state.theme === "dark" ? "light" : "dark")}>{state.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
            <StatusChip />
          </div>
        </header>

        <BabaAlert />

        <main className="grain flex-1 px-4 py-8 sm:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-8">{children}</div>
        </main>

        <footer className="border-t border-border px-6 py-6 text-center">
          <p className="label-mono">
            MOTU v0.0.1 · No motivation was recovered in the making of this unit
          </p>
        </footer>
      </div>
      <FriendRail />
    </div>
  );
}
