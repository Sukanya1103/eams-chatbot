import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getAttendance } from "@/lib/server/attendance";
import ForgotCheckInModal from "@/components/attendance/ForgotCheckInModal";
import EmployeeAttendanceCalendar from "../EmployeeAttendanceCalendar";
import { employeeDisplayName } from "../employeeName";
import type { AttendanceResponse } from "@/types/attendance";

const TIME_ZONE = "Asia/Kolkata";

export default async function MyAttendancePage() {
  const [user, records] = await Promise.all([getCurrentUser(), getAttendance()]);
  const todayStr = localDate(new Date());
  const name = employeeDisplayName(user?.name);
  const history = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const monthStart = `${todayStr.slice(0, 7)}-01`;
  const elapsedWeekdays = dateRange(monthStart, todayStr).filter(isWeekday).length;
  const monthRecords = records.filter((record) => record.date >= monthStart && record.date <= todayStr && isWeekday(record.date));
  const attendedEquivalent = monthRecords.reduce((sum, record) => sum + (record.status === "PRESENT" || record.status === "WFH" ? 1 : record.status === "HALF_DAY" ? 0.5 : 0), 0);
  const attendanceRate = elapsedWeekdays ? Math.round((attendedEquivalent / elapsedWeekdays) * 100) : 0;
  const dateLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short", timeZone: TIME_ZONE }).format(new Date());

  return <div className="mx-auto max-w-[1500px]">
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-[#171b22] p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{dateLabel}</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{name ? `Attendance overview, ${name}` : "Attendance overview"}</h1><p className="mt-1 text-sm text-slate-400">Review your attendance, correction requests, and workday records.</p></div>
      <ForgotCheckInModal />
    </header>

    <section aria-label="Current month attendance summary" className="mt-6 grid gap-4 sm:grid-cols-3">
      <Summary label="Weekday attendance records" value={`${monthRecords.length} / ${elapsedWeekdays}`} detail="Recorded weekday entries / elapsed Monday–Friday dates" />
      <Summary label="Attendance rate to date" value={`${attendanceRate}%`} detail="Based on elapsed weekdays; half days count as half" />
      <Summary label="Weekend schedule" value="Weekly Off" detail="Saturday and Sunday are not regular workdays" />
    </section>
    <p className="mt-3 text-xs text-slate-500">A weekday with no record is left unclassified; it is not labeled absent. Weekend shifts appear below only when an actual record exists.</p>

    <section className="mt-6 grid gap-6 xl:grid-cols-[18rem_1fr]">
      <EmployeeAttendanceCalendar today={todayStr} records={records} />
      <article id="correction" className="rounded-2xl border border-slate-700 bg-[#171b22] p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Correction requests</p><h2 className="mt-1 text-lg font-bold">Request history</h2><p className="mt-1 text-sm text-slate-400">Correction request history is not connected in this application yet.</p></div><div className="flex gap-2"><select aria-label="Request status" disabled className="rounded-lg border border-slate-600 bg-[#20252d] px-3 py-2 text-sm text-slate-400"><option>Filters unavailable</option></select></div></div>
        <div className="mt-7 grid min-h-36 place-items-center rounded-xl border border-dashed border-slate-600 px-5 text-center"><div><p className="font-semibold text-slate-200">No correction request data available</p><p className="mt-1 text-sm text-slate-400">The request form is present, but there is no connected endpoint to save or list requests.</p></div></div>
      </article>
    </section>

    <section className="mt-6 rounded-2xl border border-slate-700 bg-[#171b22] p-6 text-white shadow-lg"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Attendance register</p><h2 className="mt-1 text-lg font-bold">Your attendance table</h2><p className="mt-1 text-sm text-slate-400">Check-in, check-out, actual status, and shift duration where both times are available.</p></div><p className="text-sm text-slate-400">{history.length} record{history.length === 1 ? "" : "s"}</p></div>
      {history.length ? <div className="mt-5 overflow-x-auto rounded-lg border border-slate-700"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#252b34] text-xs font-semibold uppercase tracking-wide text-slate-300"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Day</th><th className="px-4 py-3">Check in</th><th className="px-4 py-3">Check out</th><th className="px-4 py-3">Duration</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-700 text-slate-200">{history.map((record) => <AttendanceRow key={record.attendanceId} record={record} />)}</tbody></table></div> : <div className="mt-5 rounded-xl border border-dashed border-slate-600 p-8 text-center text-sm text-slate-400">No attendance records yet. Check-in and check-out records will appear here when available.</div>}
    </section>
  </div>;
}

function AttendanceRow({ record }: { record: AttendanceResponse }) {
  const weekend = !isWeekday(record.date);
  const minutes = record.checkIn && record.checkOut ? Math.max(0, Math.round((new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime()) / 60000)) : null;
  return <tr className="hover:bg-slate-800/60"><td className="px-4 py-3 font-medium text-slate-100">{formatDate(record.date)}</td><td className="px-4 py-3">{weekdayName(record.date)}{weekend && <span className="ml-2 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300">Weekly Off · recorded shift</span>}</td><td className="px-4 py-3">{formatTime(record.checkIn)}</td><td className="px-4 py-3">{formatTime(record.checkOut)}</td><td className="px-4 py-3">{minutes === null ? "—" : `${Math.floor(minutes / 60)}h ${minutes % 60}m`}</td><td className="px-4 py-3"><span className="rounded-full bg-cyan-950/70 px-2.5 py-1 text-xs font-medium text-cyan-200">{record.status}</span></td></tr>;
}

function Summary({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className="rounded-2xl border border-slate-700 bg-[#20252d] p-5 text-white shadow-md"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-2xl font-bold text-cyan-200">{value}</p><p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p></article>; }
function localDate(date: Date) { const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date); const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ""; return `${value("year")}-${value("month")}-${value("day")}`; }
function dateRange(start: string, end: string) { const current = new Date(`${start}T00:00:00Z`); const last = new Date(`${end}T00:00:00Z`); const dates: string[] = []; while (current <= last) { dates.push(current.toISOString().slice(0, 10)); current.setUTCDate(current.getUTCDate() + 1); } return dates; }
function isWeekday(date: string) { const day = new Date(`${date}T00:00:00Z`).getUTCDay(); return day !== 0 && day !== 6; }
function formatDate(date: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
function weekdayName(date: string) { return new Intl.DateTimeFormat("en-IN", { weekday: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
function formatTime(value?: string) { return value ? new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE }).format(new Date(value)) : "—"; }
