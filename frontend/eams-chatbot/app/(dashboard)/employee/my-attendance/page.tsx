import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getAttendance } from "@/lib/server/attendance";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import ForgotCheckInModal from "@/components/attendance/ForgotCheckInModal";
import EmployeeAttendanceCalendar from "../EmployeeAttendanceCalendar";
import { employeeDisplayName } from "../employeeName";
export default async function MyAttendancePage() {
  const [user, records] = await Promise.all([getCurrentUser(), getAttendance()]);
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const history = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const dateLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short" }).format(today);
  const name = employeeDisplayName(user?.name) ?? "there";

  return <div className="mx-auto max-w-[1500px]">
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-[#171b22] p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{dateLabel}</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Attendance overview, {name}</h1><p className="mt-1 text-sm text-slate-400">Review your attendance, correction requests, and workday records.</p></div>
      <ForgotCheckInModal />
    </header>

    <section className="mt-6 grid gap-6 xl:grid-cols-[18rem_1fr]">
      <EmployeeAttendanceCalendar today={todayStr} records={records} />
      <article id="correction" className="rounded-2xl border border-slate-700 bg-[#171b22] p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Correction requests</p><h2 className="mt-1 text-lg font-bold">Request history</h2><p className="mt-1 text-sm text-slate-400">Correction request history is not connected in this application yet.</p></div><div className="flex gap-2"><select aria-label="Request status" disabled className="rounded-lg border border-slate-600 bg-[#20252d] px-3 py-2 text-sm text-slate-400"><option>Filters unavailable</option></select></div></div>
        <div className="mt-7 grid min-h-36 place-items-center rounded-xl border border-dashed border-slate-600 px-5 text-center"><div><p className="font-semibold text-slate-200">No correction request data available</p><p className="mt-1 text-sm text-slate-400">The request form is present, but there is no connected endpoint to save or list requests.</p></div></div>
      </article>
    </section>

    <section className="mt-6 rounded-2xl border border-slate-700 bg-[#171b22] p-6 text-white shadow-lg"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Attendance register</p><h2 className="mt-1 text-lg font-bold">Your attendance table</h2><p className="mt-1 text-sm text-slate-400">A complete record of your check-in, check-out, and attendance status.</p></div><p className="text-sm text-slate-400">{history.length} record{history.length === 1 ? "" : "s"}</p></div><div className="mt-5"><AttendanceTable records={history} employeeTheme /></div></section>
  </div>;
}
