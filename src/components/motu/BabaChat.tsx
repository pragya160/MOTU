import { Link, useNavigate } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button as UiButton } from "@/components/ui/button";
import { Baba } from "./Baba";
import { AppShell } from "./Shell";
import { createBabaThread, messageText, readBabaThreads, removeBabaThread, upsertBabaThread, type BabaThread } from "@/lib/motu/chat-store";

export function BabaChat({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<BabaThread[]>([]);
  const [errorText, setErrorText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initial = useMemo(() => readBabaThreads().find((thread) => thread.id === threadId), [threadId]);

  useEffect(() => setThreads(readBabaThreads()), []);

  const persist = useCallback((messages: UIMessage[]) => {
    const firstUser = messages.find((message) => message.role === "user");
    const current = readBabaThreads().find((thread) => thread.id === threadId);
    const thread: BabaThread = {
      id: threadId,
      title: firstUser ? messageText(firstUser).slice(0, 42) || "Spiritual emergency" : current?.title ?? "New spiritual emergency",
      updatedAt: Date.now(),
      messages,
    };
    setThreads(upsertBabaThread(thread));
  }, [threadId]);

  const [messages, setMessages] = useState<UIMessage[]>(initial?.messages ?? []);
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming" | "error">("ready");
  const abortRef = useRef<AbortController | null>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => inputRef.current?.focus(), [threadId]);
  useEffect(() => { if (messages.length > 0) persist(messages); }, [messages, persist]);

  const stop = () => abortRef.current?.abort();
  const sendMessage = async (text: string) => {
    const userMessage: UIMessage = { id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text }] };
    const assistantId = crypto.randomUUID();
    const next = [...messages, userMessage];
    setMessages(next);
    setStatus("submitted");
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }), signal: controller.signal });
      if (!response.ok || !response.body) throw new Error((await response.text()) || "Baba's cosmic network did not respond.");
      setStatus("streaming");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      setMessages([...next, { id: assistantId, role: "assistant", parts: [{ type: "text", text: "" }] }]);
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        answer += decoder.decode(chunk.value, { stream: true });
        setMessages([...next, { id: assistantId, role: "assistant", parts: [{ type: "text", text: answer }] }]);
      }
      const completed: UIMessage[] = [...next, { id: assistantId, role: "assistant", parts: [{ type: "text", text: answer }] }];
      setMessages(completed);
      persist(completed);
      setStatus("ready");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") setStatus("ready");
      else { setErrorText(error instanceof Error ? error.message : "Baba's cosmic network failed."); setStatus("error"); }
    } finally {
      abortRef.current = null;
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const createThread = () => {
    const thread = createBabaThread();
    upsertBabaThread(thread);
    void navigate({ to: "/baba/$threadId", params: { threadId: thread.id } });
  };

  return (
    <AppShell>
      <div className="grid min-h-[calc(100vh-9rem)] gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="flex max-h-64 flex-col rounded-md border border-border bg-card/70 p-3 lg:max-h-none">
          <div className="flex items-center justify-between gap-2">
            <p className="font-display font-semibold">Baba Ji chats</p>
            <UiButton aria-label="New Baba chat" onClick={createThread} size="icon-sm"><Plus /></UiButton>
          </div>
          <div className="mt-3 space-y-1 overflow-y-auto">
            {threads.map((thread) => (
              <div className="flex items-center gap-1" key={thread.id}>
                <Link className="min-w-0 flex-1 rounded-md px-3 py-2 text-sm hover:bg-accent" activeProps={{ className: "bg-accent text-accent-foreground" }} to="/baba/$threadId" params={{ threadId: thread.id }}>
                  <span className="block truncate">{thread.title}</span>
                </Link>
                <UiButton aria-label={`Delete ${thread.title}`} onClick={() => {
                  const next = removeBabaThread(thread.id);
                  setThreads(next);
                  if (thread.id === threadId) createThread();
                }} size="icon-sm" variant="ghost"><Trash2 /></UiButton>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[620px] flex-col overflow-hidden rounded-md border border-border bg-card/70">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Baba state={busy ? "talking" : "meditation"} size={58} />
            <div><h1 className="font-display text-lg font-semibold">Direct line to Baba Ji</h1><p className="text-xs text-muted-foreground">Cosmic advice. Surprisingly practical.</p></div>
          </header>
          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="mx-auto w-full max-w-3xl gap-5 px-4 py-6">
              {messages.length === 0 ? (
                <ConversationEmptyState icon={<Baba state="happy" size={120} />} title="Baba is listening" description="Report a motivational emergency, ask for advice, or confess that you opened another reel." />
              ) : messages.map((message) => (
                <Message data-message-role={message.role} from={message.role} key={message.id}>
                  <MessageContent className={message.role === "user" ? "bg-primary text-primary-foreground" : undefined}>
                    {message.parts.map((part, index) => part.type === "text" ? <MessageResponse key={`${message.id}-${index}`}>{part.text}</MessageResponse> : null)}
                  </MessageContent>
                </Message>
              ))}
              {status === "submitted" && <Shimmer className="text-sm" duration={1.6}>Baba is consulting the cosmic network...</Shimmer>}
              {errorText && <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{errorText}</p>}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="border-t border-border p-3">
            <PromptInput className="mx-auto max-w-3xl bg-background" onSubmit={async ({ text }) => {
              const prompt = text.trim();
              if (!prompt || busy) return;
              setErrorText("");
              await sendMessage(prompt);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}>
              <PromptInputTextarea ref={inputRef} placeholder="Speak, Priya Shishya..." />
              <PromptInputFooter className="justify-end"><PromptInputSubmit onStop={stop} status={status} /></PromptInputFooter>
            </PromptInput>
          </div>
        </section>
      </div>
    </AppShell>
  );
}