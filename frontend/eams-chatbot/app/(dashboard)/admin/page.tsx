import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getEmployees } from "@/lib/server/employees";
import { getAttendance } from "@/lib/server/attendance";
import { getLeaves } from "@/lib/server/leaves";

export default async function AdminOverviewPage() {
  const [user, employees, attendance, leaves] = await Promise.all([
    getCurrentUser(),
    getEmployees(),
    getAttendance(),
    getLeaves(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = attendance.filter((record) => record.date === today);
  const presentToday = todayRecords.filter((record) => record.status === "PRESENT").length;
  const absentToday = todayRecords.filter((record) => record.status === "ABSENT").length;
  const onLeaveToday = new Set(leaves.filter((leave) =>
    leave.status === "APPROVED" && leave.startDate <= today && leave.endDate >= today,
  ).map((leave) => leave.employeeId)).size;
  const pendingLeaves = leaves.filter((leave) => leave.status === "PENDING");
  const attendanceRate = todayRecords.length
    ? Math.round((presentToday / todayRecords.length) * 100)
    : 0;
  const employeeCount = employees.filter((employee) => employee.role === "EMPLOYEE").length;
  const managerCount = employees.filter((employee) => employee.role === "MANAGER").length;
  const hrCount = employees.filter((employee) => employee.role === "HR").length;
  const recentAttendance = [...attendance].sort((a, b) =>
    `${b.date}${b.checkIn ?? ""}`.localeCompare(`${a.date}${a.checkIn ?? ""}`),
  ).slice(0, 5);
  const trend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const records = attendance.filter((record) => record.date === key);
    const present = records.filter((record) => record.status === "PRESENT").length;
    return {
      key,
      label: date.toLocaleDateString("en", { weekday: "short" }),
      rate: records.length ? Math.round((present / records.length) * 100) : 0,
      count: records.length,
    };
  });
  return (
    <div className="mx-auto max-w-7xl">
      <header className="relative overflow-hidden rounded-3xl border border-white/85 bg-white/55 px-6 py-7 shadow-xl shadow-indigo-950/[0.06] backdrop-blur-2xl sm:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />System administration
          </p>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-[#202944] sm:text-3xl">Welcome back, {user?.name ?? "Admin"}</h1>
          <p className="mt-2 text-sm text-slate-600">A live view of workforce activity and the operational queue.</p>
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total registered" value={employees.length} detail="All workforce accounts" />
        <Metric label="Present today" value={presentToday} detail={`${todayRecords.length} attendance records today`} />
        <Metric label="Absent today" value={absentToday} detail="Explicitly marked absent" />
        <Metric label="On approved leave" value={onLeaveToday} detail={`${pendingLeaves.length} requests awaiting review`} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-5">
        <article className="rounded-3xl border border-white/85 bg-white/60 p-6 shadow-lg shadow-indigo-950/[0.05] backdrop-blur-xl xl:col-span-3">
          <div className="flex justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Attendance activity</p>
              <h2 className="mt-1 text-lg font-bold text-[#202944]">Recent attendance</h2>
            </div>
            <Link href="/admin/attendance" className="text-sm font-semibold text-violet-700 transition hover:text-violet-900">View all</Link>
          </div>
          {recentAttendance.length ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500"><tr><th className="pb-3 font-semibold">Employee</th><th className="pb-3 font-semibold">Check-in</th><th className="pb-3 font-semibold">Status</th></tr></thead>
                <tbody className="divide-y divide-slate-200/70">
                  {recentAttendance.map((record) => <tr key={record.attendanceId}><td className="py-3 font-medium text-slate-800">{record.employeeName}</td><td className="py-3 text-slate-600">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td><td className="py-3"><StatusPill status={record.status} /></td></tr>)}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl border border-white/80 bg-white/60 px-4 py-8 text-center text-sm text-slate-500">No attendance records are available yet.</p>
          )}
        </article>

        <article className="rounded-3xl border border-white/85 bg-white/60 p-6 shadow-lg shadow-indigo-950/[0.05] backdrop-blur-xl xl:col-span-2">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Weekly trend</p><h2 className="mt-1 text-lg font-bold text-[#202944]">Attendance rate</h2></div><span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-bold text-violet-700">{attendanceRate}% today</span></div>
          <div className="mt-6 flex h-36 items-end justify-between gap-2" aria-label="Attendance rate over the last seven days">
            {trend.map((day) => <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-medium text-slate-500">{day.count ? `${day.rate}%` : "—"}</span><div className="flex h-24 w-full items-end"><div title={`${day.label}: ${day.rate}% of recorded attendance`} className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-indigo-400" style={{ height: `${day.count ? Math.max(day.rate, 8) : 4}%` }} /></div><span className="text-[10px] font-semibold text-slate-500">{day.label}</span></div>)}
          </div>
          <p className="mt-3 text-xs text-slate-500">Calculated from attendance records submitted each day.</p>
        </article>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Action href="/admin/employees" title="Employee directory" copy={`${employeeCount} employees · ${managerCount} managers · ${hrCount} HR accounts`} />
        <Action href="/admin/leaves" title="Leave requests" copy={`${pendingLeaves.length} pending requests need review`} />
        <Action href="/admin/reports" title="Reports & analytics" copy="Review department and attendance summaries" />
      </section>
    </div>
  );
}
function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="rounded-3xl border border-white/85 bg-white/60 p-5 shadow-lg shadow-indigo-950/[0.05] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:bg-white/80">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-4 text-3xl font-black tracking-tight text-[#202944]">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function Action({ href, title, copy }: { href: string; title: string; copy: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-white/90 bg-white/45 px-4 py-4 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/70 hover:shadow-md hover:shadow-violet-950/5">
      <p className="text-sm font-bold text-slate-800">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{copy}</p>
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PRESENT: "bg-emerald-50 text-emerald-700",
    ABSENT: "bg-rose-50 text-rose-700",
    HALF_DAY: "bg-amber-50 text-amber-700",
    WFH: "bg-sky-50 text-sky-700",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>{status.replace("_", " ")}</span>;
}
