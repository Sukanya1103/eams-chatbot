// lib/api/chatbot.ts
// One function, reused by all four roles' chatbot pages. The role-specific
// scoping happens entirely on the backend (same DataScopeService every
// other module uses) — this call looks identical whether an Admin or an
// Employee sends it; only the backend's answer differs.

import type { AskChatbotResponse } from "@/types/chat";

export async function askChatbot(query: string): Promise<string> {
  const res = await fetch("/api/chatbot/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error("The assistant couldn't process that. Try again.");
  }

  const data: AskChatbotResponse = await res.json();
  return data.answer;
}