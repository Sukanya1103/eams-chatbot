import AdminLeaveQueue from "@/components/leaves/AdminLeaveQueue";
import { getLeaves } from "@/lib/server/leaves";

export default async function AdminLeavesPage() {
  const leaves = await getLeaves();
  const pending = leaves.filter((leave) => leave.status === "PENDING").length;
  const approved = leaves.filter((leave) => leave.status === "APPROVED").length;

  return <div className="mx-auto max-w-7xl">
    <header className="rounded-3xl border border-white/85 bg-white/55 p-6 shadow-lg shadow-indigo-950/[0.05] backdrop-blur-2xl sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Admin workspace</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-[#202944] sm:text-3xl">Leave requests</h1>
      <p className="mt-2 text-sm text-slate-600">Review company leave requests, filter by employee or type, and process pending decisions.</p>
    </header>
    <section className="mt-5 grid gap-3 sm:grid-cols-3">
      <Summary label="Pending review" value={pending} />
      <Summary label="Approved" value={approved} />
      <Summary label="Total requests" value={leaves.length} />
    </section>
    <AdminLeaveQueue leaves={leaves} />
  </div>;
}

function Summary({ label, value }: { label: string; value: number }) {
  return <article className="rounded-2xl border border-white/85 bg-white/55 p-4 shadow-sm shadow-indigo-950/[0.04] backdrop-blur-xl"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-[#202944]">{value}</p></article>;
}
