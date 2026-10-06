import { createFileRoute } from "@tanstack/react-router";
import { BabaChat } from "@/components/motu/BabaChat";

export const Route = createFileRoute("/baba/$threadId")({
  head: () => ({ meta: [
    { title: "Talk to Baba Ji — MOTU" },
    { name: "description", content: "Private browser-saved conversations with MOTU Baba Ji." },
    { property: "og:title", content: "Talk to Baba Ji — MOTU" },
    { property: "og:description", content: "Cosmic guidance for critical motivational incidents." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: BabaThreadPage,
});

function BabaThreadPage() {
  const { threadId } = Route.useParams();
  return <BabaChat key={threadId} threadId={threadId} />;
}