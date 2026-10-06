import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw, Rows3 } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell, PageTitle } from "@/components/motu/Shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reels")({
  head: () => ({ meta: [
    { title: "Reel Multitasking — MOTU" },
    { name: "description", content: "Scroll three completely unnecessary MOTU reel feeds at once." },
    { property: "og:title", content: "Reel Multitasking — MOTU" },
    { property: "og:description", content: "Phone, tablet and laptop feeds for maximum divided attention." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ReelsPage,
});

const REELS = [
  { icon: "🛌", title: "POV: the bed increased gravity", stat: "94% pull detected" },
  { icon: "🧦", title: "Scanner reveal goes wrong", stat: "Object: sock" },
  { icon: "📚", title: "Study setup, zero studying", stat: "Aesthetic +72" },
  { icon: "🧘", title: "Baba reacts to your screen time", stat: "Silence: judgmental" },
  { icon: "📡", title: "Motivation signal intercepted", stat: "Strength: 3%" },
];

function DeviceFeed({ type, label, sync, register }: { type: "phone" | "tablet" | "laptop"; label: string; sync: (source: HTMLDivElement) => void; register: (node: HTMLDivElement | null) => void }) {
  return (
    <div className={type === "phone" ? "w-56" : type === "tablet" ? "w-72" : "w-full max-w-md"}>
      <p className="label-mono mb-2 text-center">{label}</p>
      <div className={`border-[6px] border-foreground/80 bg-foreground/80 shadow-2xl ${type === "laptop" ? "rounded-t-md pb-0" : "rounded-[1.8rem] p-1"}`}>
        <div ref={register} onScroll={(event) => sync(event.currentTarget)} className={`snap-y snap-mandatory overflow-y-auto rounded-md bg-void ${type === "phone" ? "h-[430px]" : type === "tablet" ? "h-[430px]" : "h-[330px]"}`}>
          {REELS.map((reel, index) => <article className="relative grid h-full min-h-full snap-start place-items-center overflow-hidden border-b border-border p-5 text-center" key={`${label}-${reel.title}`}><div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-signal/15" /><div className="relative"><span className="text-6xl">{reel.icon}</span><h3 className="mt-5 font-display text-xl text-foreground">{reel.title}</h3><p className="label-mono mt-2 text-primary">{reel.stat}</p><p className="mt-6 text-xs text-muted-foreground">#{index + 1} · spiritually verified content</p></div></article>)}
        </div>
      </div>
      {type === "laptop" && <div className="mx-auto h-3 w-[112%] -translate-x-[5%] rounded-b-xl bg-foreground/70" />}
    </div>
  );
}

function ReelsPage() {
  const refs = useRef<Array<HTMLDivElement | null>>([]);
  const syncing = useRef(false);
  const [linked, setLinked] = useState(true);
  const [playing, setPlaying] = useState(true);
  const sync = (source: HTMLDivElement) => {
    if (!linked || syncing.current) return;
    syncing.current = true;
    const ratio = source.scrollTop / Math.max(1, source.scrollHeight - source.clientHeight);
    refs.current.forEach((node) => { if (node && node !== source) node.scrollTop = ratio * (node.scrollHeight - node.clientHeight); });
    requestAnimationFrame(() => { syncing.current = false; });
  };
  return <AppShell><PageTitle kicker="Attention fragmentation lab" title="Reel Multitasking" sub="Three screens. Five reels. Zero measurable progress." /><div className="flex flex-wrap gap-2"><Button onClick={() => setPlaying((value) => !value)}>{playing ? <Pause /> : <Play />}{playing ? "Pause feeds" : "Resume feeds"}</Button><Button variant={linked ? "default" : "outline"} onClick={() => setLinked((value) => !value)}><Rows3 />Sync scroll</Button><Button variant="outline" onClick={() => refs.current.forEach((node) => { if (node) node.scrollTo({ top: 0, behavior: "smooth" }); })}><RotateCcw />Reset</Button></div><div className={playing ? "mt-7 flex items-end justify-center gap-6 overflow-x-auto pb-6" : "mt-7 flex items-end justify-center gap-6 overflow-x-auto pb-6 opacity-60"}><DeviceFeed type="phone" label="Phone" sync={sync} register={(node) => { refs.current[0] = node; }} /><DeviceFeed type="tablet" label="Tablet" sync={sync} register={(node) => { refs.current[1] = node; }} /><DeviceFeed type="laptop" label="Laptop" sync={sync} register={(node) => { refs.current[2] = node; }} /></div></AppShell>;
}