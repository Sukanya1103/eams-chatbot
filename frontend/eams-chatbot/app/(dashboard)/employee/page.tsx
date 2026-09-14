import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getAttendance } from "@/lib/server/attendance";
import { getLeaves } from "@/lib/server/leaves";
import CheckInOutCard from "@/components/attendance/CheckInOutCard";

export default async function EmployeeOverviewPage() {
  const [user, attendance, leaves] = await Promise.all([getCurrentUser(), getAttendance(), getLeaves()]);
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const monthKey = today.slice(0, 7);
  const todayRecord = attendance.find((record) => record.date === today);
  const presentThisMonth = attendance.filter((record) => record.date.startsWith(monthKey) && record.status === "PRESENT").length;
  const pendingLeaves = leaves.filter((leave) => leave.status === "PENDING").length;
  const upcomingLeave = leaves.filter((leave) => leave.status === "APPROVED" && leave.startDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  const week = getWeek(today);
  const weekRecords = new Map(attendance.map((record) => [record.date, record]));
  const weekPresent = attendance.filter((record) => week.includes(record.date) && record.status === "PRESENT").length;
  const dateLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short" }).format(now);

  return <div className="mx-auto max-w-7xl">
    <header className="flex flex-col gap-4 rounded-2xl border border-cyan-100 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">{dateLabel}</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Welcome back, {user?.name ?? "there"}</h1><p className="mt-1 text-sm text-slate-500">Here&apos;s your workday at a glance.</p></div>
      <div className="rounded-xl bg-cyan-50 px-4 py-3 text-sm"><p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Today&apos;s status</p><p className="mt-1 font-semibold text-slate-950">{todayRecord?.checkOut ? "Day completed" : todayRecord?.checkIn ? "Checked in" : "Ready to start"}</p></div>
    </header>

    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric title="Attendance" value={todayRecord?.checkIn ? "Active" : "Not started"} detail={todayRecord?.checkIn ? `Checked in ${formatTime(todayRecord.checkIn)}` : "Check in when your workday begins"} tone="cyan" />
      <Metric title="Present this month" value={presentThisMonth} detail="Working days recorded" tone="blue" />
      <Metric title="Leave requests" value={pendingLeaves} detail={pendingLeaves === 1 ? "Request awaiting approval" : "Requests awaiting approval"} tone="violet" />
      <Metric title="Upcoming leave" value={upcomingLeave ? formatShortDate(upcomingLeave.startDate) : "None"} detail={upcomingLeave ? `${upcomingLeave.type.toLowerCase()} leave approved` : "No approved leave planned"} tone="amber" />
    </section>

    <section className="mt-6 grid gap-6 xl:grid-cols-3">
      <article className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm xl:col-span-2">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Weekly attendance</p><h2 className="mt-1 text-lg font-bold text-slate-950">Keep your week on track</h2><p className="mt-1 text-sm text-slate-500">Your attendance recorded for the current week.</p></div><Link href="/employee/my-attendance" className="shrink-0 text-sm font-semibold text-cyan-700 hover:text-cyan-800">View history</Link></div>
        <div className="mt-8 grid grid-cols-7 gap-3 sm:gap-5">{week.map((date) => { const record = weekRecords.get(date); const isToday = date === today; return <div key={date} className="text-center"><div className={`mx-auto grid h-16 w-full max-w-14 place-items-center rounded-xl border text-sm font-bold ${record?.status === "PRESENT" ? "border-cyan-200 bg-cyan-500 text-white" : isToday ? "border-cyan-300 bg-cyan-50 text-cyan-700" : "border-slate-100 bg-slate-50 text-slate-400"}`}>{record?.status === "PRESENT" ? "✓" : formatDay(date)}</div><p className="mt-2 text-xs font-semibold text-slate-700">{formatWeekday(date)}</p><p className="mt-0.5 text-[10px] text-slate-400">{formatDay(date)}</p></div>; })}</div>
        <div className="mt-7 h-2 overflow-hidden rounded-full bg-cyan-50"><div className="h-full rounded-full bg-cyan-500" style={{ width: `${Math.min((weekPresent / 5) * 100, 100)}%` }} /></div><p className="mt-2 text-xs text-slate-500">{weekPresent} of 5 weekday attendance records completed</p>
      </article>
      <CheckInOutCard today={todayRecord} />
    </section>

    <section className="mt-6 grid gap-6 md:grid-cols-2">
      <article className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Time off</p><h2 className="mt-1 text-lg font-bold text-slate-950">Leave centre</h2><p className="mt-2 text-sm text-slate-500">Plan time away and follow the status of your requests.</p><Link href="/employee/my-leaves" className="mt-5 inline-flex rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700">Manage my leaves</Link></article>
      <article className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Payroll</p><h2 className="mt-1 text-lg font-bold text-slate-950">Payslips & salary</h2><p className="mt-2 text-sm text-slate-500">View your salary records and download the latest payslip.</p><Link href="/employee/my-salary" className="mt-5 inline-flex rounded-lg border border-cyan-200 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50">View salary details</Link></article>
    </section>
  </div>;
}

function Metric({ title, value, detail, tone }: { title: string; value: string | number; detail: string; tone: "cyan" | "blue" | "violet" | "amber" }) {
  const colours = { cyan: "bg-cyan-100 text-cyan-700", blue: "bg-blue-100 text-blue-700", violet: "bg-violet-100 text-violet-700", amber: "bg-amber-100 text-amber-700" };
  return <article className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{title}</p><span className={`grid h-9 w-9 place-items-center rounded-xl text-sm ${colours[tone]}`}>●</span></div><p className="mt-5 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>;
}

function getWeek(today: string) { const current = new Date(`${today}T12:00:00`); current.setDate(current.getDate() - ((current.getDay() + 6) % 7)); return Array.from({ length: 7 }, (_, index) => { const day = new Date(current); day.setDate(current.getDate() + index); return day.toISOString().slice(0, 10); }); }
function formatWeekday(date: string) { return new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(new Date(`${date}T12:00:00`)); }
function formatDay(date: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric" }).format(new Date(`${date}T12:00:00`)); }
function formatShortDate(date: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`)); }
function formatTime(date?: string) { return date ? new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(date)) : ""; }
