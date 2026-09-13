// app/(dashboard)/employee/my-attendance/page.tsx

import { getAttendance } from "@/lib/server/attendance";
import CheckInOutCard from "@/components/attendance/CheckInOutCard";
import AttendanceTable from "@/components/attendance/AttendanceTable";

export default async function MyAttendancePage() {
  const records = await getAttendance();
  const todayStr = new Date().toISOString().slice(0, 10);
  const today = records.find((r) => r.date === todayStr);
  const history = [...records].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">My attendance</h1>
      <p className="mt-1 text-sm text-slate-500">Check in, check out, and review your history.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceTable records={history} />
        </div>

        <div>
          <CheckInOutCard today={today} />
        </div>
      </div>
    </div>
  );
}
