import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED_JOURNAL } from "./data";

export interface JournalEntry {
  id: string;
  time: string;
  activity: string;
  level: number;
  killer: string;
  place: string;
}

export interface MotuNotification {
  id: string;
  tone: "alert" | "ok" | "critical" | "warn";
  title: string;
  body: string;
  at: string;
}

export interface SimulatedFriend {
  id: string;
  username: string;
  name: string;
  motivation: number;
  distance: string;
  status: string;
  online: boolean;
  x: number;
  y: number;
}

export interface FiledReport {
  id: string;
  caseNumber: string;
  note: string;
  status: "FILED";
  filedAt: string;
}

export interface MotuState {
  name: string;
  signedIn: boolean;
  guest: boolean;
  motivation: number;
  points: number;
  skin: string;
  ownedSkins: string[];
  ownedItems: string[];
  completedMissions: string[];
  ignoredMissions: number;
  unlocked: string[];
  journal: JournalEntry[];
  notifications: MotuNotification[];
  reminders: string[];
  donated: number;
  lastSeenMinutes: number;
  booted: boolean;
  theme: "dark" | "light";
  simulatedFriends: SimulatedFriend[];
  filedReports: FiledReport[];
  dismissedNotifications: string[];
}

const DEFAULT_STATE: MotuState = {
  name: "",
  signedIn: false,
  guest: false,
  motivation: 3,
  points: 2450,
  skin: "monk",
  ownedSkins: ["monk"],
  ownedItems: [],
  completedMissions: [],
  ignoredMissions: 0,
  unlocked: ["first-loss"],
  journal: SEED_JOURNAL,
  notifications: [
    {
      id: "n1",
      tone: "critical",
      title: "CRITICAL",
      body: "Your motivation has been missing for 7h 42m.",
      at: "just now",
    },
    {
      id: "n2",
      tone: "alert",
      title: "MOTIVATION ALERT",
      body: "Your motivation dropped 32% after contact with a mattress.",
      at: "18m ago",
    },
    {
      id: "n3",
      tone: "ok",
      title: "SIGNAL DETECTED",
      body: "A small motivation signal has been detected nearby.",
      at: "1h ago",
    },
    {
      id: "n4",
      tone: "warn",
      title: "FALSE ALARM",
      body: "It was your phone.",
      at: "2h ago",
    },
  ],
  reminders: ["morning", "low"],
  donated: 0,
  lastSeenMinutes: 462,
  booted: false,
  theme: "dark",
  simulatedFriends: [],
  filedReports: [],
  dismissedNotifications: [],
};

const KEY = "motu:v1";

interface MotuContextValue {
  state: MotuState;
  update: (patch: Partial<MotuState>) => void;
  signIn: (name: string, guest?: boolean) => void;
  signOut: () => void;
  addPoints: (n: number) => void;
  spend: (n: number) => boolean;
  addMotivation: (n: number) => void;
  completeMission: (id: string, reward: number, gain: number) => void;
  unlock: (id: string) => void;
  addJournal: (entry: Omit<JournalEntry, "id">) => void;
  notify: (n: Omit<MotuNotification, "id" | "at">) => void;
  toggleReminder: (id: string) => void;
  buySkin: (id: string, cost: number) => boolean;
  buyItem: (id: string, cost: number) => boolean;
  lastUnlocked: string | null;
  clearLastUnlocked: () => void;
  setTheme: (theme: "dark" | "light") => void;
  addFriend: (username: string) => { ok: boolean; message: string };
  fileReport: (note: string) => FiledReport;
  dismissNotification: (id: string) => void;
}

const MotuContext = createContext<MotuContextValue | null>(null);

export function MotuProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MotuState>(DEFAULT_STATE);
  const [lastUnlocked, setLastUnlocked] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw), booted: false }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    document.documentElement.style.colorScheme = state.theme;
  }, [state.theme]);

  const update = useCallback((patch: Partial<MotuState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const unlock = useCallback((id: string) => {
    setState((s) => {
      if (s.unlocked.includes(id)) return s;
      setLastUnlocked(id);
      return { ...s, unlocked: [...s.unlocked, id] };
    });
  }, []);

  const value = useMemo<MotuContextValue>(
    () => ({
      state,
      update,
      lastUnlocked,
      clearLastUnlocked: () => setLastUnlocked(null),
      signIn: (name, guest = false) =>
        setState((s) => ({ ...s, name: name || "Anonymous Yoddha", signedIn: true, guest })),
      signOut: () => setState((s) => ({ ...s, signedIn: false, booted: false })),
      addPoints: (n) => setState((s) => ({ ...s, points: s.points + n })),
      spend: (n) => {
        let ok = false;
        setState((s) => {
          if (s.points >= n) {
            ok = true;
            return { ...s, points: s.points - n };
          }
          return s;
        });
        return ok;
      },
      addMotivation: (n) =>
        setState((s) => ({ ...s, motivation: Math.max(0, Math.min(100, s.motivation + n)) })),
      completeMission: (id, reward, gain) =>
        setState((s) => ({
          ...s,
          points: s.points + reward,
          motivation: Math.max(0, Math.min(100, s.motivation + gain)),
          completedMissions: s.completedMissions.includes(id)
            ? s.completedMissions
            : [...s.completedMissions, id],
        })),
      unlock,
      addJournal: (entry) =>
        setState((s) => ({
          ...s,
          journal: [...s.journal, { ...entry, id: `j${Date.now()}` }].sort((a, b) =>
            a.time.localeCompare(b.time),
          ),
        })),
      notify: (n) =>
        setState((s) => ({
          ...s,
          notifications: [{ ...n, id: `n${Date.now()}`, at: "just now" }, ...s.notifications].slice(
            0,
            30,
          ),
        })),
      toggleReminder: (id) =>
        setState((s) => ({
          ...s,
          reminders: s.reminders.includes(id)
            ? s.reminders.filter((r) => r !== id)
            : [...s.reminders, id],
        })),
      buySkin: (id, cost) => {
        let ok = false;
        setState((s) => {
          if (s.ownedSkins.includes(id)) return s;
          if (s.points < cost) return s;
          ok = true;
          return { ...s, points: s.points - cost, ownedSkins: [...s.ownedSkins, id] };
        });
        return ok;
      },
      buyItem: (id, cost) => {
        let ok = false;
        setState((s) => {
          if (s.ownedItems.includes(id)) return s;
          if (s.points < cost) return s;
          ok = true;
          return { ...s, points: s.points - cost, ownedItems: [...s.ownedItems, id] };
        });
        return ok;
      },
      setTheme: (theme) => setState((s) => ({ ...s, theme })),
      addFriend: (username) => {
        const clean = username.trim().replace(/^@/, "").slice(0, 24);
        if (clean.length < 2) return { ok: false, message: "Enter at least 2 characters." };
        if (state.simulatedFriends.some((friend) => friend.username.toLowerCase() === clean.toLowerCase())) {
          return { ok: false, message: `@${clean} is already in your squad.` };
        }
        const seed = [...clean].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const friend: SimulatedFriend = {
          id: `friend-${Date.now()}`,
          username: clean,
          name: clean.replace(/[._-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
          motivation: 8 + (seed % 89),
          distance: `${((seed % 94) / 10 + 0.3).toFixed(1)} km`,
          status: ["AVOIDING RESPONSIBILITY", "SCROLLING BRAVELY", "FAKE STUDY MODE", "ON A SIDE QUEST"][seed % 4] ?? "ONLINE",
          online: seed % 3 !== 0,
          x: 12 + (seed % 76),
          y: 14 + ((seed * 7) % 72),
        };
        setState((s) => ({ ...s, simulatedFriends: [...s.simulatedFriends, friend] }));
        return { ok: true, message: `@${clean} joined your highly unproductive squad.` };
      },
      fileReport: (note) => {
        const report: FiledReport = {
          id: `report-${Date.now()}`,
          caseNumber: `MOTU-${state.lastSeenMinutes}-${state.filedReports.length + 1}`,
          note: note.trim() || "Motivation disappeared under suspiciously comfortable circumstances.",
          status: "FILED",
          filedAt: new Date().toLocaleString(),
        };
        setState((s) => ({
          ...s,
          filedReports: [report, ...s.filedReports],
          notifications: [{
            id: `n${Date.now()}`,
            tone: "ok" as const,
            title: "REPORT SUCCESSFULLY IGNORED",
            body: `${report.caseNumber} was filed directly into an unread archive.`,
            at: "just now",
          }, ...s.notifications].slice(0, 30),
        }));
        return report;
      },
      dismissNotification: (id) => setState((s) => ({
        ...s,
        dismissedNotifications: s.dismissedNotifications.includes(id)
          ? s.dismissedNotifications
          : [...s.dismissedNotifications, id],
      })),
    }),
    [state, update, unlock, lastUnlocked],
  );

  return <MotuContext.Provider value={value}>{children}</MotuContext.Provider>;
}

export function useMotu() {
  const ctx = useContext(MotuContext);
  if (!ctx) throw new Error("useMotu must be used inside MotuProvider");
  return ctx;
}

export function motivationStatus(v: number) {
  if (v < 10) return { label: "CRITICALLY LOW", tone: "alert" as const };
  if (v < 30) return { label: "SEVERELY DEPLETED", tone: "alert" as const };
  if (v < 55) return { label: "UNSTABLE BUT PRESENT", tone: "warn" as const };
  if (v < 80) return { label: "SIGNAL STRONG", tone: "ok" as const };
  return { label: "SUSPICIOUSLY ABUNDANT", tone: "ok" as const };
}
