import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Baba } from "./Baba";
import { useMotu } from "@/lib/motu/store";

export function BabaAlert() {
  const { state, dismissNotification } = useMotu();
  const alert = state.notifications.find((notification) => !state.dismissedNotifications.includes(notification.id));
  if (!alert || state.reminders.length === 0) return null;
  return (
    <div className="sticky top-14 z-30 border-b border-primary/30 bg-card/95 px-4 py-2 backdrop-blur-xl animate-rise">
      <div className="mx-auto flex max-w-6xl items-center gap-3 pr-12 xl:pr-0">
        <Baba state={alert.tone === "ok" ? "happy" : "talking"} size={44} />
        <div className="min-w-0 flex-1"><p className="font-mono text-[0.65rem] text-primary">BABA ALERT · {alert.title}</p><p className="truncate text-sm text-foreground">{alert.body}</p></div>
        <Button aria-label="Dismiss alert" onClick={() => dismissNotification(alert.id)} size="icon-sm" variant="ghost"><X /></Button>
      </div>
    </div>
  );
}