import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getLeaves } from "@/lib/server/leaves";
import ApplyLeaveForm from "@/components/leaves/ApplyLeaveForm";
import EmployeeLeaveRequests from "../EmployeeLeaveRequests";
import { employeeDisplayName } from "../employeeName";
import CompensationRequestsPanel from "@/components/leaves/CompensationRequestsPanel";

export default async function MyLeavesPage() {
  const [user, leaves] = await Promise.all([getCurrentUser(), getLeaves()]);
  const count = (type: string) => leaves.filter((leave) => leave.type === type).length;
  const approved = leaves.filter((leave) => leave.status === "APPROVED").length;
  const pending = leaves.filter((leave) => leave.status === "PENDING").length;
  const dateLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short" }).format(new Date());
  const name = employeeDisplayName(user?.name) ?? "there";

  return <div className="mx-auto max-w-7xl">
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-[#1F2937] shadow-lg sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3B82F6]">{dateLabel}</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Leave centre, {name}</h1><p className="mt-1 text-sm text-[#64748B]">Manage leave requests and approval status.</p></div><ApplyLeaveForm /></header>
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Casual leave requests" value={count("CASUAL")} tone="cyan" /><Metric label="Sick leave requests" value={count("SICK")} tone="violet" /><Metric label="Approved requests" value={approved} tone="emerald" /><Metric label="Pending requests" value={pending} tone="amber" /></section>
    <p className="mt-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-[#64748B]">Leave balances are unavailable here; the connected leave API provides request records only.</p>
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-[#1F2937] shadow-lg"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3B82F6]">Leave requests</p><h2 className="mt-1 text-lg font-bold">Request history</h2><p className="mt-1 text-sm text-[#64748B]">All leave requests you have submitted.</p></div><EmployeeLeaveRequests leaves={leaves} /></div></section>
    <section className="mt-6"><CompensationRequestsPanel /></section>
  </div>;
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "cyan" | "violet" | "emerald" | "amber" }) { const colours = { cyan: "text-[#3B82F6]", violet: "text-[#3B82F6]", emerald: "text-[#16A34A]", amber: "text-[#D97706]" }; return <article className="rounded-2xl border border-slate-200 bg-white p-5 text-[#1F2937] shadow-md"><div className="flex items-start justify-between"><p className="text-sm font-medium text-[#64748B]">{label}</p><span className={`text-lg ${colours[tone]}`}>●</span></div><p className="mt-5 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-[#64748B]">Current request total</p></article>; }
