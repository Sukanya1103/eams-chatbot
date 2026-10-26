// app/(dashboard)/employee/chatbot/page.tsx

import ChatWindow from "@/components/chatbot/ChatWindow";

export default function EmployeeChatbotPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="rounded-2xl border border-slate-700 bg-[#171b22] p-6 text-white shadow-lg"><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-300">Employee support</p><h1 className="mt-2 text-2xl font-bold">EAMS Assistant</h1>
      <p className="mt-1 text-sm text-slate-400">
        Ask about your own attendance, leave balance, or salary.
      </p>
      </header><div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-[#171b22] p-2 shadow-lg">
        <ChatWindow employeeTheme placeholder="e.g. How many leave days do I have left?" />
      </div>
    </div>
  );
}
