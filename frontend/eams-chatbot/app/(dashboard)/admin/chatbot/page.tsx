// app/(dashboard)/admin/chatbot/page.tsx

import ChatWindow from "@/components/chatbot/ChatWindow";

export default function AdminChatbotPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Assistant</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ask about anyone in the company — attendance, leaves, salary, or headcount.
      </p>
      <div className="mt-6">
        <ChatWindow placeholder="e.g. Who's on leave today?" />
      </div>
    </div>
  );
}
