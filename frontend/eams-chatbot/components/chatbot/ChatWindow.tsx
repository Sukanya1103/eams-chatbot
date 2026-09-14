// components/chatbot/ChatWindow.tsx
// The one chat UI, reused unchanged across Admin/HR/Manager/Employee. It
// has no idea what role is using it and never should — the scoping that
// makes an Employee only able to ask about themselves happens entirely on
// the backend, not by this component behaving differently per role.

"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { askChatbot } from "@/lib/api/chatbot";
import type { ChatMessage } from "@/types/chat";

export default function ChatWindow({
  placeholder = "Ask about attendance, leaves, or salary…",
  compact = false,
}: {
  placeholder?: string;
  compact?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const query = input.trim();
    if (!query || isSending) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const answer = await askChatbot(query);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: err instanceof Error ? err.message : "Something went wrong.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className={`flex flex-col bg-white ${compact ? "h-[26rem]" : "h-[70vh] rounded-xl border border-cyan-100 shadow-sm"}`}>
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400">
            Ask a question to get started — you&apos;ll only see answers based
            on data you have access to.
          </p>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                m.role === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-cyan-50 text-slate-900"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-lg bg-cyan-50 px-4 py-2 text-sm text-slate-400">
              Thinking…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-cyan-100 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-cyan-200 px-3 py-2 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
