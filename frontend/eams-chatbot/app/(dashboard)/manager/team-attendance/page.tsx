// app/(dashboard)/manager/team-attendance/page.tsx
// Same getAttendance() call and same AttendanceTable component as the
// employee page — a Manager's JWT just gets back their team's records
// instead of one person's, courtesy of the backend's scoping. No
// CheckInOutCard here: a Manager views the team's attendance, they don't
// check in on anyone else's behalf.

import { getAttendance } from "@/lib/server/attendance";
import AttendanceTable from "@/components/attendance/AttendanceTable";

export default async function TeamAttendancePage() {
  const records = await getAttendance();
  const today = new Date().toISOString().slice(0, 10);
  const presentToday = records.filter((r) => r.date === today && r.status === "PRESENT").length;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Team attendance</h1>
      <p className="mt-1 text-sm text-slate-500">
        {presentToday} team {presentToday === 1 ? "member" : "members"} present today.
      </p>

      <div className="mt-6">
        <AttendanceTable records={records} showEmployeeName />
      </div>
    </div>
  );
}
