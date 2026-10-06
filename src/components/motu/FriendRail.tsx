import { Link } from "@tanstack/react-router";
import { UserPlus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FRIENDS } from "@/lib/motu/data";
import { useMotu } from "@/lib/motu/store";
import { cn } from "@/lib/utils";

export function FriendRail() {
  const { state, addFriend, notify } = useMotu();
  const [adding, setAdding] = useState(false);
  const [username, setUsername] = useState("");
  const [feedback, setFeedback] = useState("");
  const allFriends = [...FRIENDS.map((friend, index) => ({ ...friend, username: friend.name.toLowerCase(), online: index !== 2 })), ...state.simulatedFriends];

  const submit = () => {
    const result = addFriend(username);
    setFeedback(result.message);
    if (result.ok) {
      notify({ tone: "ok", title: "SQUAD MEMBER DETECTED", body: result.message });
      setUsername("");
    }
  };

  return (
    <>
      <div className="fixed bottom-0 right-0 top-14 z-40 hidden w-16 flex-col items-center gap-3 border-l border-border bg-sidebar/90 py-4 backdrop-blur-xl xl:flex">
        <Button aria-label="Add friend" onClick={() => setAdding(true)} size="icon-sm"><UserPlus /></Button>
        <div className="h-px w-8 bg-border" />
        {allFriends.slice(0, 7).map((friend) => (
          <Link aria-label={`${friend.name}, ${friend.online ? "online" : "offline"}`} className="group relative" key={friend.id} to="/friends">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface-2 text-sm">{friend.motivation > 50 ? "😀" : friend.motivation > 25 ? "😐" : "😵"}</span>
            <span className={cn("absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-sidebar", friend.online ? "bg-ok" : "bg-muted-foreground")} />
            <span className="pointer-events-none absolute right-full top-1/2 mr-3 w-max -translate-y-1/2 rounded-md border border-border bg-popover px-2 py-1 text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100">@{friend.username} · {friend.motivation}%</span>
          </Link>
        ))}
      </div>

      {adding && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-void/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Add squad member">
          <div className="w-full max-w-sm rounded-md border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Add squad member</h2><Button aria-label="Close" onClick={() => setAdding(false)} size="icon-sm" variant="ghost"><X /></Button></div>
            <p className="mt-1 text-sm text-muted-foreground">Enter any username. MOTU will simulate the rest with irresponsible confidence.</p>
            <label className="label-mono mt-5 block" htmlFor="friend-username">Username</label>
            <div className="mt-2 flex gap-2"><input autoFocus id="friend-username" className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="@lost_yoddha" value={username} onChange={(event) => setUsername(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} /><Button onClick={submit}>Add</Button></div>
            {feedback && <p className="mt-3 text-xs text-muted-foreground">{feedback}</p>}
          </div>
        </div>
      )}
    </>
  );
}