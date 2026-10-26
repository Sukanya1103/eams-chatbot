import AdminAttendanceTable from "@/components/attendance/AdminAttendanceTable";
import { getAttendance } from "@/lib/server/attendance";

export default async function AdminAttendancePage() {
  const records = await getAttendance();
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter((record) => record.date === today);
  const present = todayRecords.filter((record) => record.status === "PRESENT").length;
  const absent = todayRecords.filter((record) => record.status === "ABSENT").length;
  const missingCheckOut = todayRecords.filter((record) => record.status === "PRESENT" && !record.checkOut).length;

  return <div className="mx-auto max-w-7xl">
    <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-blue-950/[0.05] backdrop-blur-2xl sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3B82F6]">Admin workspace</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-[#1F2937] sm:text-3xl">Attendance management</h1>
      <p className="mt-2 text-sm text-slate-600">Review submitted attendance records and find missing check-outs.</p>
    </header>
    <section className="mt-5 grid gap-3 sm:grid-cols-3">
      <Summary label="Present today" value={present} />
      <Summary label="Marked absent" value={absent} />
      <Summary label="Missing check-out" value={missingCheckOut} />
    </section>
    <AdminAttendanceTable records={records} />
    <p className="mt-3 text-xs text-slate-500">Late status and manual corrections need shift rules and an audited correction endpoint from the backend.</p>
  </div>;
}

function Summary({ label, value }: { label: string; value: number }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-blue-950/[0.04] backdrop-blur-xl"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-[#1F2937]">{value}</p></article>;
}
