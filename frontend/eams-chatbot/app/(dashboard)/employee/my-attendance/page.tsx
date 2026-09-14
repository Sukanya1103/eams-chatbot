import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getAttendance } from "@/lib/server/attendance";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import ForgotCheckInModal from "@/components/attendance/ForgotCheckInModal";

export default async function MyAttendancePage() {
  const [user, records] = await Promise.all([getCurrentUser(), getAttendance()]);
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const history = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const recordByDate = new Map(records.map((record) => [record.date, record]));
  const dateLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "short" }).format(today);

  return <div className="mx-auto max-w-7xl">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">{dateLabel}</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Attendance overview, {user?.name ?? "there"}</h1><p className="mt-1 text-sm text-slate-500">Review your attendance, correction requests, and workday records.</p></div>
      <ForgotCheckInModal />
    </header>

    <section className="mt-6 grid gap-6 xl:grid-cols-[18rem_1fr]">
      <Calendar month={today} today={todayStr} records={recordByDate} />
      <article id="correction" className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Correction requests</p><h2 className="mt-1 text-lg font-bold text-slate-950">Request history</h2><p className="mt-1 text-sm text-slate-500">Missed check-in or check-out? Your manager can review a correction request.</p></div><div className="flex gap-2"><select aria-label="Request status" className="rounded-lg border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500"><option>All statuses</option><option>Pending</option><option>Approved</option></select><select aria-label="Request type" className="rounded-lg border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500"><option>All types</option><option>Check in</option><option>Check out</option></select></div></div>
        <div className="mt-10 grid min-h-36 place-items-center rounded-xl border border-dashed border-cyan-200 bg-cyan-50/50 px-5 text-center"><div><p className="font-semibold text-slate-800">No correction requests yet</p><p className="mt-1 text-sm text-slate-500">Use the assistant in the bottom-right corner to contact HR about a missed attendance record.</p></div></div>
      </article>
    </section>

    <section className="mt-6 rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Attendance register</p><h2 className="mt-1 text-lg font-bold text-slate-950">Your attendance table</h2><p className="mt-1 text-sm text-slate-500">A complete record of your check-in, check-out, and attendance status.</p></div><p className="text-sm text-slate-500">{history.length} record{history.length === 1 ? "" : "s"}</p></div><div className="mt-5"><AttendanceTable records={history} /></div></section>
  </div>;
}

function Calendar({ month, today, records }: { month: Date; today: string; records: Map<string, { status: string }> }) {
  const year = month.getFullYear(); const monthIndex = month.getMonth(); const first = new Date(year, monthIndex, 1); const offset = first.getDay(); const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const cells = Array.from({ length: offset + totalDays }, (_, index) => index < offset ? null : index - offset + 1);
  const label = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(month);
  return <article className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Monthly record</p><h2 className="mt-1 font-bold text-slate-950">{label}</h2></div><span className="rounded-lg bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700">Current</span></div><div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-1">{cells.map((day, index) => { if (!day) return <span key={`empty-${index}`} />; const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; const status = records.get(date)?.status; const colour = status === "PRESENT" ? "bg-cyan-500 text-white" : status === "ABSENT" ? "bg-red-100 text-red-700" : status === "HALF_DAY" ? "bg-amber-100 text-amber-700" : date === today ? "border border-cyan-400 bg-cyan-50 text-cyan-700" : "text-slate-700 hover:bg-cyan-50"; return <span key={date} className={`grid aspect-square place-items-center rounded-lg text-xs font-semibold ${colour}`}>{day}</span>; })}</div><div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-[10px] text-slate-500"><Legend colour="bg-cyan-500" label="Present" /><Legend colour="bg-red-400" label="Absent" /><Legend colour="bg-amber-400" label="Half day" /><Legend colour="bg-slate-200" label="No record" /></div></article>;
}

function Legend({ colour, label }: { colour: string; label: string }) { return <span className="flex items-center gap-1.5"><i className={`h-2 w-2 rounded-full ${colour}`} />{label}</span>; }
