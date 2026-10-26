import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getEmployeeAttendance } from "@/lib/server/attendance";
import { getLeaves } from "@/lib/server/leaves";
import CheckInOutCard from "@/components/attendance/CheckInOutCard";
import { employeeDisplayName } from "./employeeName";
import { attendanceBarPercentage, formatWorkedDuration, workedSeconds as actualWorkedSeconds } from "@/lib/attendance/duration.mjs";

export default async function EmployeeOverviewPage() {
  const [user, attendanceResult, leaves] = await Promise.all([getCurrentUser(), getEmployeeAttendance(), getLeaves()]);
  const attendance = attendanceResult.records;
  const now = new Date();
  const name = employeeDisplayName(user?.name);
  const today = localDate(now);
  const todayRecord = attendance.find((record) => record.date === today) ?? attendance.find((record) => record.state === "CHECKED_IN" || !record.checkOut);
  const days = currentWeek(today);
  const weekRecords = new Map(attendance.map((record) => [record.date, record]));
  const weekdays = days.filter((day) => weekday(day) >= 1 && weekday(day) <= 5 && day <= today);
  const present = weekdays.reduce((sum, day) => sum + (weekRecords.get(day)?.status === "HALF_DAY" ? 0.5 : ["PRESENT", "WFH"].includes(weekRecords.get(day)?.status ?? "") ? 1 : 0), 0);
  const weekdayCount = weekdays.length;
  const pending = leaves.filter((leave) => leave.status === "PENDING").length;
  const upcoming = leaves.filter((leave) => leave.status === "APPROVED" && leave.startDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  const workedSeconds = todayRecord ? actualWorkedSeconds(todayRecord, now.getTime()) : null;
  const workedMs = workedSeconds === null ? null : workedSeconds * 1000;
  const shiftComplete = workedSeconds !== null && workedSeconds >= 8 * 60 * 60;

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <header className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-700 bg-[#171b22] p-5 text-white shadow-lg sm:flex-row sm:items-center sm:px-7">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-300">{new Intl.DateTimeFormat("en-IN", { weekday: "long", month: "short", day: "numeric", timeZone: "Asia/Kolkata" }).format(now)}</p><h1 className="mt-2 text-2xl font-bold sm:text-3xl">{name ? <>Welcome back, <span className="text-cyan-200">{name}</span>!</> : "Welcome back!"}</h1><p className="mt-1 text-sm text-slate-400">Your workday, attendance, and requests at a glance.</p></div>
      <CheckInOutCard today={todayRecord} dataAvailable={attendanceResult.available} />
    </header>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Today’s status" value={shiftComplete ? "Shift complete" : todayRecord?.checkOut ? "Checked out" : todayRecord?.checkIn ? "Active" : "Not started"} detail={todayRecord?.checkIn ? `Checked in at ${new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(todayRecord.checkIn))}` : "Check in when your day begins"} tone="green" />
      <Metric label="Time worked today" value={workedMs === null ? "—" : duration(workedMs)} detail={workedMs === null ? "No check-in recorded" : shiftComplete ? "Eight-hour requirement reached" : `${duration(8 * 60 * 60 * 1000 - workedMs)} remaining of 8h`} tone="cyan" />
      <Metric label="Pending leave requests" value={pending} detail="Your requests awaiting a decision" tone="amber" />
      <Metric label="Upcoming approved leave" value={upcoming ? shortDate(upcoming.startDate) : "None"} detail={upcoming ? `${pretty(upcoming.type)} leave` : "No upcoming approved leave"} tone="violet" />
    </section>

    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
      <article className="rounded-2xl border border-slate-700 bg-[#171b22] p-5 text-white shadow-lg sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-300">Attendance</p><h2 className="mt-1 text-xl font-bold">Your week at a glance</h2><p className="mt-1 text-sm text-slate-400">Based on your personal attendance records.</p></div><Link href="/employee/my-attendance" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">View history →</Link></div>
        <div className="mt-7 grid grid-cols-7 gap-2 sm:gap-4">{days.map((day) => { const record = weekRecords.get(day); const isToday = day === today; const isOff = weekday(day) === 0 || weekday(day) === 6; const isUpcoming = day > today && !isOff; const seconds = record ? actualWorkedSeconds(record, now.getTime()) : 0; const fill = attendanceBarPercentage(seconds); return <div key={day} className="text-center"><div title={record ? `${record.status} · ${formatWorkedDuration(seconds)} worked` : isOff ? "Weekly Off" : isUpcoming ? "Upcoming workday" : "No attendance record"} className={`mx-auto flex aspect-[.72] max-h-32 w-full items-end overflow-hidden rounded-xl border p-1.5 ${record ? "border-cyan-500/50 bg-cyan-500/10" : isOff ? "border-slate-800 bg-slate-900/70" : "border-slate-700 bg-slate-800/70"}`}>{record ? <div className="w-full rounded-md bg-gradient-to-t from-blue-600 to-cyan-400" style={{ height: `${fill}%` }} /> : <span className="mb-auto mt-auto w-full text-[9px] leading-tight text-slate-500">{isOff ? "Weekly Off" : isUpcoming ? "Upcoming" : "—"}</span>}</div><p className={`mt-2 text-xs font-semibold ${isToday ? "text-cyan-300" : "text-slate-300"}`}>{new Intl.DateTimeFormat("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" }).format(new Date(`${day}T12:00:00+05:30`))}</p><p className="mt-0.5 text-[11px] text-slate-500">{new Date(`${day}T12:00:00+05:30`).getDate()}</p><p className="mt-1 text-[10px] text-slate-500">{record?.status ?? (isOff ? "Weekly Off" : isUpcoming ? "Upcoming" : day === today ? "Today" : "No record")}</p>{record && <p className="text-[10px] text-slate-400">{formatWorkedDuration(seconds)}</p>}</div>; })}</div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500"><span>Saturday and Sunday · Weekly Off</span><span>{attendanceResult.available ? `${present} of ${weekdayCount} elapsed weekday attendance days` : "Attendance data unavailable"}</span></div>
        {attendanceResult.available && <div aria-label="Weekday attendance record progress" className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${weekdayCount ? Math.round((present / weekdayCount) * 100) : 0}%` }} /></div>}
      </article>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <Shortcut href="/employee/my-leaves" eyebrow="Time off" title="Leave centre" detail="Apply and follow your leave requests." action="Manage leave" tone="green" />
        <Shortcut href="/employee/my-salary" eyebrow="Payroll" title="Salary records" detail="Review your available payslip details." action="View salary" tone="amber" />
        <Shortcut href="/employee/chatbot" eyebrow="Support" title="EAMS Assistant" detail="Ask a question using the workplace assistant." action="Open chatbot" tone="cyan" />
      </div>
    </section>
  </div>;
}

function Metric({ label, value, detail, tone }: { label: string; value: string | number; detail: string; tone: string }) { const tint: Record<string, string> = { green: "text-emerald-300", cyan: "text-cyan-300", amber: "text-amber-300", violet: "text-violet-300" }; return <article className="rounded-2xl border border-slate-700 bg-[#20252d] p-5 text-white shadow-md"><p className="text-sm text-slate-400">{label}</p><p className={`mt-4 text-2xl font-bold ${tint[tone]}`}>{value}</p><p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p></article>; }
function Shortcut({ href, eyebrow, title, detail, action, tone }: { href: string; eyebrow: string; title: string; detail: string; action: string; tone: string }) { const tint: Record<string, string> = { green: "text-emerald-300", cyan: "text-cyan-300", amber: "text-amber-300" }; return <article className="rounded-2xl border border-slate-700 bg-[#20252d] p-5 text-white shadow-md"><p className={`text-xs font-bold uppercase tracking-[.14em] ${tint[tone]}`}>{eyebrow}</p><h3 className="mt-2 font-bold">{title}</h3><p className="mt-1 text-sm text-slate-400">{detail}</p><Link href={href} className="mt-4 inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:brightness-110">{action}</Link></article>; }
function currentWeek(today: string) { const start = new Date(`${today}T00:00:00Z`); start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7)); return Array.from({ length: 7 }, (_, index) => { const date = new Date(start); date.setUTCDate(start.getUTCDate() + index); return date.toISOString().slice(0, 10); }); }
function weekday(date: string) { return new Date(`${date}T00:00:00Z`).getUTCDay(); }
function localDate(date: Date) { const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date); const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ""; return `${get("year")}-${get("month")}-${get("day")}`; }
function duration(milliseconds: number) { const totalSeconds = Math.floor(milliseconds / 1000); return `${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m ${totalSeconds % 60}s`; }
function shortDate(value: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`)); }
function pretty(value: string) { return value.charAt(0) + value.slice(1).toLowerCase(); }
