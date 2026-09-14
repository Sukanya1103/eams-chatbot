// app/(dashboard)/admin/reports/page.tsx
// Rather than waiting on a dedicated backend reports endpoint, this derives
// its stats from the same three list endpoints already built (employees,
// leaves, attendance). If a real analytics/reports endpoint gets built
// later, swap the three fetches below for one call — the page shape stays
// the same.

import { getEmployees } from "@/lib/server/employees";
import { getLeaves } from "@/lib/server/leaves";
import { getAttendance } from "@/lib/server/attendance";

export default async function AdminReportsPage() {
  const [employees, leaves, attendance] = await Promise.all([
    getEmployees(),
    getLeaves(),
    getAttendance(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const presentToday = attendance.filter((a) => a.date === today && a.status === "PRESENT").length;
  const pendingLeaves = leaves.filter((l) => l.status === "PENDING").length;

  const byDepartment = employees.reduce<Record<string, number>>((acc, emp) => {
    acc[emp.department] = (acc[emp.department] ?? 0) + 1;
    return acc;
  }, {});

  const byRole = employees.reduce<Record<string, number>>((acc, emp) => {
    acc[emp.role] = (acc[emp.role] ?? 0) + 1;
    return acc;
  }, {});

  const departmentEntries = Object.entries(byDepartment).sort((a, b) => b[1] - a[1]);
  const roleEntries = Object.entries(byRole).sort((a, b) => b[1] - a[1]);
  const largestDepartment = Math.max(...departmentEntries.map(([, count]) => count), 1);
  const largestRole = Math.max(...roleEntries.map(([, count]) => count), 1);
  const attendanceRate = employees.length
    ? Math.round((presentToday / employees.length) * 100)
    : 0;
  const reportDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-7xl text-slate-900">
      <section className="relative overflow-hidden rounded-2xl border border-cyan-600 bg-cyan-700 px-6 py-7 shadow-xl shadow-cyan-950/15 sm:px-8">
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_2px_rgb(74_222_128)]" />
              Operations control room
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Workforce reports</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Live personnel and attendance intelligence across the facility.
            </p>
          </div>
          <div className="border-l-2 border-white/70 pl-4 text-sm text-cyan-100">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Report date</p>
            <p className="mt-1 font-semibold text-white">{reportDate}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total workforce" value={employees.length} code="HR-01" accent="amber" />
        <MetricCard label="On site today" value={presentToday} code="AT-24" accent="emerald" detail={`${attendanceRate}% attendance`} />
        <MetricCard label="Leave queue" value={pendingLeaves} code="LV-08" accent="orange" detail="Awaiting action" />
        <MetricCard label="Active divisions" value={departmentEntries.length} code="DP-16" accent="sky" detail="Department groups" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-white shadow-sm xl:col-span-3">
          <PanelHeader title="Department load" code="HEADCOUNT / DIVISION" />
          {departmentEntries.length === 0 ? (
            <EmptyPanel />
          ) : (
            <ul className="divide-y divide-slate-100 px-6">
              {departmentEntries.map(([department, count], index) => (
                <BarRow key={department} label={department} value={count} max={largestDepartment} index={index} />
              ))}
            </ul>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-white shadow-sm xl:col-span-2">
          <PanelHeader title="Role distribution" code="HEADCOUNT / ACCESS" />
          {roleEntries.length === 0 ? (
            <EmptyPanel />
          ) : (
            <ul className="divide-y divide-slate-100 px-6">
              {roleEntries.map(([role, count], index) => (
                <BarRow key={role} label={role} value={count} max={largestRole} index={index} compact />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, code, detail, accent }: { label: string; value: number; code: string; detail?: string; accent: "amber" | "emerald" | "orange" | "sky" }) {
  const accents = { amber: "bg-cyan-400", emerald: "bg-cyan-500", orange: "bg-cyan-600", sky: "bg-sky-500" };
  return <article className="relative overflow-hidden rounded-xl border border-cyan-100 bg-white p-5 shadow-sm"><div className={`absolute inset-x-0 top-0 h-1 ${accents[accent]}`} /><div className="flex items-start justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p><span className="rounded border border-cyan-100 px-1.5 py-0.5 font-mono text-[10px] text-cyan-700">{code}</span></div><p className="mt-5 text-4xl font-black tracking-tight text-slate-950">{value}</p><p className="mt-2 text-xs text-slate-500">{detail ?? "Current system count"}</p></article>;
}

function PanelHeader({ title, code }: { title: string; code: string }) {
  return <header className="flex items-center justify-between border-b border-cyan-100 bg-cyan-50 px-6 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-700">{code}</p><h2 className="mt-1 text-base font-extrabold text-slate-900">{title}</h2></div><span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /></header>;
}

function BarRow({ label, value, max, index, compact = false }: { label: string; value: number; max: number; index: number; compact?: boolean }) {
  const barColors = ["bg-amber-400", "bg-orange-500", "bg-sky-500", "bg-emerald-500"];
  return <li className="py-4"><div className="flex items-center justify-between gap-4 text-sm"><span className="truncate font-semibold text-slate-700">{label}</span><span className="shrink-0 font-mono text-xs font-bold text-slate-950">{value.toString().padStart(2, "0")}</span></div><div className={`mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 ${compact ? "" : "max-w-2xl"}`}><div className={`h-full rounded-full ${barColors[index % barColors.length]}`} style={{ width: `${Math.max((value / max) * 100, 5)}%` }} /></div></li>;
}

function EmptyPanel() { return <p className="px-6 py-10 text-sm text-slate-400">No operational data recorded yet.</p>; }
