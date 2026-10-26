import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getEmployeeAttendance, getAttendanceCorrections } from "@/lib/server/attendance";
import ForgotCheckInModal from "@/components/attendance/ForgotCheckInModal";
import EmployeeAttendanceCalendar from "../EmployeeAttendanceCalendar";
import { employeeDisplayName } from "../employeeName";
import type { AttendanceResponse } from "@/types/attendance";

const TIME_ZONE = "Asia/Kolkata";

export default async function MyAttendancePage() {
  const [user, attendanceResult, corrections] = await Promise.all([getCurrentUser(), getEmployeeAttendance(), getAttendanceCorrections()]);
  const records = attendanceResult.records;
  const todayStr = localDate(new Date());
  const name = employeeDisplayName(user?.name);
  const history = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const monthStart = `${todayStr.slice(0, 7)}-01`;
  const elapsedWeekdays = dateRange(monthStart, todayStr).filter(isWeekday).length;
  const monthRecords = records.filter((record) => record.date >= monthStart && record.date <= todayStr && isWeekday(record.date));
  const attendedEquivalent = monthRecords.reduce((sum, record) => sum + (record.status === "PRESENT" || record.status === "WFH" ? 1 : record.status === "HALF_DAY" ? 0.5 : 0), 0);
  const attendanceRate = elapsedWeekdays ? Math.round((attendedEquivalent / elapsedWeekdays) * 100) : 0;
  const weekStart = mondayOf(todayStr);
  const elapsedWeekdaysThisWeek = dateRange(weekStart, todayStr).filter(isWeekday).length;
  const weekRecords = records.filter((record) => record.date >= weekStart && record.date <= todayStr && isWeekday(record.date));
  const weekAttended = weekRecords.reduce((sum, record) => sum + (record.status === "PRESENT" || record.status === "WFH" ? 1 : record.status === "HALF_DAY" ? 0.5 : 0), 0);
  const weeklyProgress = elapsedWeekdaysThisWeek ? Math.round(weekAttended / elapsedWeekdaysThisWeek * 100) : 0;
  const dateLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short", timeZone: TIME_ZONE }).format(new Date());

  return <div className="mx-auto max-w-[1500px]">
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-[#1F2937] shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3B82F6]">{dateLabel}</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{name ? `Attendance overview, ${name}` : "Attendance overview"}</h1><p className="mt-1 text-sm text-[#64748B]">Review your attendance, correction requests, and workday records.</p></div>
      <ForgotCheckInModal />
    </header>

    <section aria-label="Current attendance summary" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Summary label="Weekday attendance records" value={attendanceResult.available ? `${monthRecords.length} / ${elapsedWeekdays}` : "—"} detail={attendanceResult.available ? "Recorded weekday entries / elapsed Monday–Friday dates" : "Attendance data unavailable"} />
      <Summary label="Attendance rate to date" value={attendanceResult.available ? `${attendanceRate}%` : "—"} detail={attendanceResult.available ? "Based on elapsed weekdays; half days count as half" : "Attendance data unavailable"} />
      <Summary label="This week" value={attendanceResult.available ? `${weekAttended} / ${elapsedWeekdaysThisWeek} days` : "—"} detail={attendanceResult.available ? `${weeklyProgress}% of applicable elapsed weekdays; weekends excluded` : "Attendance data unavailable"} />
      <Summary label="Weekend schedule" value="Weekly Off" detail="Saturday and Sunday are not regular workdays" />
    </section>
    <p className="mt-3 text-xs text-slate-500">{attendanceResult.available ? "A weekday with no record is left unclassified; it is not labeled absent. Weekend shifts appear below only when an actual record exists." : "Attendance records could not be loaded. No dates are classified while the data source is unavailable."}</p>

    <section className="mt-6 grid gap-6 xl:grid-cols-[18rem_1fr]">
      <EmployeeAttendanceCalendar today={todayStr} records={records} available={attendanceResult.available} />
      <article id="correction" className="rounded-2xl border border-slate-200 bg-white p-6 text-[#1F2937] shadow-lg">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3B82F6]">Correction requests</p><h2 className="mt-1 text-lg font-bold">Request history</h2><p className="mt-1 text-sm text-[#64748B]">Requests remain pending until an authorized reviewer decides them.</p></div>
        {corrections.length ? <div className="mt-5 space-y-3">{corrections.map((request) => <article key={request.id} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold text-[#1F2937]">{formatDate(request.attendanceDate)} · {request.reason}</p><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-[#D97706]">{request.status}</span></div><p className="mt-1 text-sm text-[#64748B]">Requested {formatTime(request.requestedCheckIn)}–{formatTime(request.requestedCheckOut)}</p>{request.reviewerComments && <p className="mt-2 text-sm text-slate-600">Reviewer: {request.reviewerComments}</p>}</article>)}</div> : <div className="mt-7 grid min-h-28 place-items-center rounded-xl border border-dashed border-slate-300 px-5 text-center text-sm text-[#64748B]">No correction requests have been submitted.</div>}
      </article>
    </section>

    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-[#1F2937] shadow-lg"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3B82F6]">Attendance register</p><h2 className="mt-1 text-lg font-bold">Your attendance table</h2><p className="mt-1 text-sm text-[#64748B]">Check-in, check-out, actual status, and shift duration where both times are available.</p></div><p className="text-sm text-[#64748B]">{history.length} record{history.length === 1 ? "" : "s"}</p></div>
      {!attendanceResult.available ? <div className="mt-5 rounded-xl border border-dashed border-amber-800 p-8 text-center text-sm text-[#D97706]">Attendance data is unavailable; try refreshing after the service is restored.</div> : history.length ? <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#F4F7FA] text-xs font-semibold uppercase tracking-wide text-slate-600"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Day</th><th className="px-4 py-3">Check in</th><th className="px-4 py-3">Check out</th><th className="px-4 py-3">Duration</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-200 text-slate-700">{history.map((record) => <AttendanceRow key={record.attendanceId} record={record} />)}</tbody></table></div> : <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-[#64748B]">No attendance records yet. Check-in and check-out records will appear here when available.</div>}
    </section>
  </div>;
}

function AttendanceRow({ record }: { record: AttendanceResponse }) {
  const weekend = !isWeekday(record.date);
  const sessions = record.sessions?.length ? record.sessions : record.checkIn ? [{ sessionId: "legacy", checkIn: record.checkIn, checkOut: record.checkOut }] : [];
  const duration = typeof record.totalWorkedSeconds === "number" ? record.totalWorkedSeconds : sessions.reduce((sum, session) => sum + (session.checkOut ? Math.max(0, Math.floor((Date.parse(session.checkOut) - Date.parse(session.checkIn)) / 1000)) : 0), 0);
  const durationLabel = sessions.length ? `${Math.floor(duration / 3600)}h ${Math.floor(duration % 3600 / 60)}m ${duration % 60}s` : "—";
  return <tr className="hover:bg-slate-100/60"><td className="px-4 py-3 font-medium text-[#1F2937]">{formatDate(record.date)}</td><td className="px-4 py-3">{weekdayName(record.date)}{weekend && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">Weekly Off · recorded shift</span>}</td><td className="px-4 py-3">{sessions.length ? sessions.map((session, index) => <div key={session.sessionId}>S{index + 1} · {formatTime(session.checkIn)}</div>) : "—"}</td><td className="px-4 py-3">{sessions.length ? sessions.map((session, index) => <div key={session.sessionId}>S{index + 1} · {formatTime(session.checkOut)}</div>) : "—"}</td><td className="px-4 py-3">{durationLabel}</td><td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#24445F]">{record.status}</span></td></tr>;
}

function Summary({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className="rounded-2xl border border-slate-200 bg-white p-5 text-[#1F2937] shadow-md"><p className="text-sm text-[#64748B]">{label}</p><p className="mt-3 text-2xl font-bold text-[#24445F]">{value}</p><p className="mt-1 text-xs leading-5 text-[#64748B]">{detail}</p></article>; }
function localDate(date: Date) { const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date); const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ""; return `${value("year")}-${value("month")}-${value("day")}`; }
function dateRange(start: string, end: string) { const current = new Date(`${start}T00:00:00Z`); const last = new Date(`${end}T00:00:00Z`); const dates: string[] = []; while (current <= last) { dates.push(current.toISOString().slice(0, 10)); current.setUTCDate(current.getUTCDate() + 1); } return dates; }
function mondayOf(date: string) { const current = new Date(`${date}T00:00:00Z`); const day = current.getUTCDay(); current.setUTCDate(current.getUTCDate() - (day === 0 ? 6 : day - 1)); return current.toISOString().slice(0, 10); }
function isWeekday(date: string) { const day = new Date(`${date}T00:00:00Z`).getUTCDay(); return day !== 0 && day !== 6; }
function formatDate(date: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
function weekdayName(date: string) { return new Intl.DateTimeFormat("en-IN", { weekday: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
function formatTime(value?: string) { return value ? new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE }).format(new Date(value)) : "—"; }
