import type { UIMessage } from "ai";

export interface BabaThread {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
}

const CHAT_KEY = "motu:baba-chats:v1";

export function readBabaThreads(): BabaThread[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CHAT_KEY) ?? "[]") as BabaThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeBabaThreads(threads: BabaThread[]) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(threads));
}

export function createBabaThread(): BabaThread {
  return {
    id: crypto.randomUUID(),
    title: "New spiritual emergency",
    updatedAt: Date.now(),
    messages: [],
  };
}

export function upsertBabaThread(thread: BabaThread) {
  const threads = readBabaThreads();
  const next = [thread, ...threads.filter((item) => item.id !== thread.id)].sort((a, b) => b.updatedAt - a.updatedAt);
  writeBabaThreads(next);
  return next;
}

export function removeBabaThread(id: string) {
  const next = readBabaThreads().filter((thread) => thread.id !== id);
  writeBabaThreads(next);
  return next;
}

export function messageText(message: UIMessage) {
  return message.parts.filter((part) => part.type === "text").map((part) => part.text).join(" ").trim();
}