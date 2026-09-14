// app/(dashboard)/manager/chatbot/page.tsx

import ChatWindow from "@/components/chatbot/ChatWindow";

export default function ManagerChatbotPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Assistant</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ask about your team&apos;s attendance and leave status.
      </p>
      <div className="mt-6">
        <ChatWindow placeholder="e.g. Who on my team is out this week?" />
      </div>
    </div>
  );
}
