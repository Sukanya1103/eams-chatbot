// components/attendance/AttendanceTable.tsx
// Shared history table — used by both the Employee's own-history view and
// the Manager's team view. Purely presentational; scoping happens upstream
// in getAttendance(), same principle as LeaveTable.

import type { AttendanceResponse } from "@/types/attendance";

const STATUS_STYLES: Record<string, string> = {
  PRESENT: "bg-green-50 text-green-700",
  ABSENT: "bg-red-50 text-red-700",
  HALF_DAY: "bg-amber-50 text-amber-700",
  WFH: "bg-blue-50 text-blue-700",
};

export default function AttendanceTable({
  records,
  showEmployeeName = false,
  employeeTheme = false,
}: {
  records: AttendanceResponse[];
  showEmployeeName?: boolean;
  employeeTheme?: boolean;
}) {
  if (records.length === 0) {
    return (
      <div className={`rounded-lg border border-dashed p-8 text-center text-sm ${employeeTheme ? "border-slate-400 text-slate-500" : "border-slate-300 text-slate-500"}`}>
        No attendance records yet.
      </div>
    );
  }

  return (
    <div className={`${employeeTheme ? "overflow-x-auto" : "overflow-hidden"} rounded-lg border ${employeeTheme ? "border-slate-700" : "border-slate-200"}`}>
      <table className={`w-full text-sm ${employeeTheme ? "min-w-[680px]" : ""}`}>
        <thead className={`${employeeTheme ? "bg-[#252b34] text-slate-300" : "bg-slate-50 text-slate-500"} text-left text-xs font-semibold uppercase tracking-wide`}>
          <tr>
            {showEmployeeName && <th className="px-4 py-3">Employee</th>}
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Check in</th>
            <th className="px-4 py-3">Check out</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${employeeTheme ? "divide-slate-700 text-slate-200" : "divide-slate-100"}`}>
          {records.map((r) => (
            <tr key={r.attendanceId} className={employeeTheme ? "hover:bg-slate-800/60" : "hover:bg-slate-50"}>
              {showEmployeeName && (
                <td className={`px-4 py-3 font-medium ${employeeTheme ? "text-slate-100" : "text-slate-900"}`}>{r.employeeName}</td>
              )}
              <td className={`px-4 py-3 font-medium ${employeeTheme ? "text-slate-100" : "text-slate-900"}`}>{r.date}</td>
              <td className={`px-4 py-3 ${employeeTheme ? "text-slate-300" : "text-slate-600"}`}>
                {r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "—"}
              </td>
              <td className={`px-4 py-3 ${employeeTheme ? "text-slate-300" : "text-slate-600"}`}>
                {r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : "—"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[r.status]}`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
