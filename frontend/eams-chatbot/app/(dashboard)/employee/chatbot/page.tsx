// app/(dashboard)/employee/chatbot/page.tsx

import ChatWindow from "@/components/chatbot/ChatWindow";

export default function EmployeeChatbotPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Assistant</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ask about your own attendance, leave balance, or salary.
      </p>
      <div className="mt-6">
        <ChatWindow placeholder="e.g. How many leave days do I have left?" />
      </div>
    </div>
  );
}
