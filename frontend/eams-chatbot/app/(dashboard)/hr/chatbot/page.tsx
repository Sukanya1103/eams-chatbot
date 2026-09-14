// app/(dashboard)/hr/chatbot/page.tsx

import ChatWindow from "@/components/chatbot/ChatWindow";

export default function HrChatbotPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Assistant</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ask about any employee — attendance, leave balances, or payroll status.
      </p>
      <div className="mt-6">
        <ChatWindow placeholder="e.g. How many pending leave requests are there?" />
      </div>
    </div>
  );
}
