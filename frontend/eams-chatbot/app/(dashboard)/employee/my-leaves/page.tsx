import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getLeaves } from "@/lib/server/leaves";
import LeaveTable from "@/components/leaves/LeaveTable";
import ApplyLeaveForm from "@/components/leaves/ApplyLeaveForm";

export default async function MyLeavesPage() {
  const [user, leaves] = await Promise.all([getCurrentUser(), getLeaves()]);
  const count = (type: string) => leaves.filter((leave) => leave.type === type).length;
  const approved = leaves.filter((leave) => leave.status === "APPROVED").length;
  const pending = leaves.filter((leave) => leave.status === "PENDING").length;
  const dateLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short" }).format(new Date());

  return <div className="mx-auto max-w-7xl">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">{dateLabel}</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Leave centre, {user?.name ?? "there"}</h1><p className="mt-1 text-sm text-slate-500">Manage leave requests, balances, and approval status.</p></div><ApplyLeaveForm /></header>
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Casual leave requests" value={count("CASUAL")} tone="cyan" /><Metric label="Sick leave requests" value={count("SICK")} tone="violet" /><Metric label="Approved requests" value={approved} tone="emerald" /><Metric label="Pending requests" value={pending} tone="amber" /></section>
    <section className="mt-6 rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Leave requests</p><h2 className="mt-1 text-lg font-bold text-slate-950">Request history</h2><p className="mt-1 text-sm text-slate-500">All leave requests you have submitted.</p></div><div className="flex gap-2"><select aria-label="Filter leave status" className="rounded-lg border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-700"><option>All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select><select aria-label="Filter leave type" className="rounded-lg border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-700"><option>All types</option><option>Casual</option><option>Sick</option><option>Earned</option></select></div></div><div className="mt-5"><LeaveTable leaves={leaves} readOnly showEmployeeName={false} /></div></section>
    <section className="mt-6"><article className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Compensation requests</p><h2 className="mt-1 text-lg font-bold text-slate-950">Week-off & holiday compensation</h2><p className="mt-1 text-sm text-slate-500">Requests raised for work completed on a weekly off or public holiday.</p><div className="mt-5 grid min-h-32 place-items-center rounded-xl border border-dashed border-cyan-200 bg-cyan-50/50 text-center"><div><p className="font-semibold text-slate-800">No compensation requests</p><p className="mt-1 text-sm text-slate-500">There are no compensation requests to show.</p></div></div></article></section>
  </div>;
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "cyan" | "violet" | "emerald" | "amber" }) { const colours = { cyan: "bg-cyan-100 text-cyan-700", violet: "bg-violet-100 text-violet-700", emerald: "bg-emerald-100 text-emerald-700", amber: "bg-amber-100 text-amber-700" }; return <article className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl ${colours[tone]}`}>●</span></div><p className="mt-5 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">Current request total</p></article>; }
