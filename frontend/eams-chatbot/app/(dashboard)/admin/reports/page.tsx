import Link from "next/link";
import ReportActions from "@/components/reports/ReportActions";
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
  const month = today.slice(0, 7);
  const todayRecords = attendance.filter((record) => record.date === today);
  const monthRecords = attendance.filter((record) => record.date.startsWith(month));
  const presentToday = todayRecords.filter((record) => record.status === "PRESENT").length;
  const absentToday = todayRecords.filter((record) => record.status === "ABSENT").length;
  const attendanceRate = todayRecords.length ? Math.round((presentToday / todayRecords.length) * 100) : 0;
  const pendingLeaves = leaves.filter((leave) => leave.status === "PENDING").length;
  const byDepartment = employees.reduce<Record<string, number>>((result, employee) => {
    const department = employee.department || "Unassigned";
    result[department] = (result[department] ?? 0) + 1;
    return result;
  }, {});
  const byRole = employees.reduce<Record<string, number>>((result, employee) => {
    result[employee.role] = (result[employee.role] ?? 0) + 1;
    return result;
  }, {});
  const byLeaveType = leaves.reduce<Record<string, number>>((result, leave) => {
    result[leave.type] = (result[leave.type] ?? 0) + 1;
    return result;
  }, {});
  const reportDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return <div className="mx-auto max-w-7xl text-[#202944]">
    <header className="flex flex-col gap-5 rounded-3xl border border-white/85 bg-white/55 p-6 shadow-lg shadow-indigo-950/[0.05] backdrop-blur-2xl sm:flex-row sm:items-end sm:justify-between sm:p-8">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Admin workspace</p><h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Reports &amp; analytics</h1><p className="mt-2 text-sm text-slate-600">Workforce and attendance summaries from the connected records.</p><p className="mt-3 text-xs font-semibold text-slate-500">Report date · {reportDate}</p></div>
      <ReportActions records={attendance} />
    </header>

    <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Total workforce" value={employees.length} detail="Registered accounts" />
      <Metric label="Present today" value={presentToday} detail={`Of ${todayRecords.length} today's attendance records`} />
      <Metric label="Absent today" value={absentToday} detail="Explicitly marked absent" />
      <Metric label="Pending leave" value={pendingLeaves} detail="Requests waiting for a decision" />
    </section>

    <section className="mt-5 grid gap-5 xl:grid-cols-3">
      <Distribution title="Department headcount" entries={Object.entries(byDepartment)} />
      <Distribution title="Accounts by role" entries={Object.entries(byRole)} />
      <Distribution title="Leave requests by type" entries={Object.entries(byLeaveType)} />
    </section>

    <section className="mt-5 rounded-3xl border border-white/85 bg-white/60 p-6 shadow-lg shadow-indigo-950/[0.05] backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Attendance period</p><h2 className="mt-1 text-lg font-bold">This month</h2></div><Link href="/admin/attendance" className="text-sm font-semibold text-violet-700 hover:text-violet-900">Filter individual records →</Link></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><Metric label="Attendance records" value={monthRecords.length} detail="Records submitted this month" /><Metric label="Present records" value={monthRecords.filter((record) => record.status === "PRESENT").length} detail="Marked present" /><Metric label="Attendance rate today" value={`${attendanceRate}%`} detail="Present / records submitted today" /></div>
      <p className="mt-4 text-xs leading-5 text-slate-500">No record is treated as an absence. Late arrival reporting requires configured shift hours; corrections require an audited backend endpoint.</p>
    </section>
  </div>;
}

function Metric({ label, value, detail }: { label: string; value: number | string; detail: string }) {
  return <article className="rounded-2xl border border-white/90 bg-white/55 p-4 shadow-sm shadow-indigo-950/[0.04] backdrop-blur-xl"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-black tracking-tight text-[#202944]">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>;
}

function Distribution({ title, entries }: { title: string; entries: [string, number][] }) {
  const max = Math.max(...entries.map(([, count]) => count), 1);
  return <article className="rounded-3xl border border-white/85 bg-white/60 p-6 shadow-lg shadow-indigo-950/[0.05] backdrop-blur-xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Workforce distribution</p><h2 className="mt-1 text-lg font-bold">{title}</h2>{entries.length ? <ul className="mt-5 space-y-4">{entries.sort((a, b) => b[1] - a[1]).map(([label, count]) => <li key={label}><div className="flex justify-between text-sm"><span className="font-medium text-slate-700">{label}</span><span className="font-bold text-slate-900">{count}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/75"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${Math.max((count / max) * 100, 5)}%` }} /></div></li>)}</ul> : <p className="mt-5 text-sm text-slate-500">No workforce data available.</p>}</article>;
}
