import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Baba } from "@/components/motu/Baba";
import { createBabaThread, readBabaThreads, upsertBabaThread } from "@/lib/motu/chat-store";

export const Route = createFileRoute("/baba/")({
  head: () => ({ meta: [
    { title: "Baba Ji Chat — MOTU" },
    { name: "description", content: "Start a conversation with MOTU Baba Ji." },
    { property: "og:title", content: "Baba Ji Chat — MOTU" },
    { property: "og:description", content: "Ask Baba Ji about your missing motivation." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: BabaChatEntry,
});

function BabaChatEntry() {
  const navigate = useNavigate();
  useEffect(() => {
    const current = readBabaThreads()[0] ?? createBabaThread();
    upsertBabaThread(current);
    void navigate({ to: "/baba/$threadId", params: { threadId: current.id }, replace: true });
  }, [navigate]);
  return <main className="grid min-h-screen place-items-center bg-background"><div className="text-center"><Baba state="meditation" size={150} /><p className="label-mono mt-6 animate-pulse">Forming a secure cloud...</p></div></main>;
}