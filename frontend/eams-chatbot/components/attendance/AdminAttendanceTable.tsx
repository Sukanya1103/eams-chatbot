"use client";

import { useMemo, useState } from "react";
import type { AttendanceResponse } from "@/types/attendance";

const statusStyles: Record<string, string> = {
  PRESENT: "bg-green-50 text-[#16A34A]",
  ABSENT: "bg-red-50 text-[#DC2626]",
  HALF_DAY: "bg-amber-50 text-[#D97706]",
  WFH: "bg-blue-50 text-[#24445F]",
};

export default function AdminAttendanceTable({ records }: { records: AttendanceResponse[] }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("ALL");
  const filtered = useMemo(() => records.filter((record) => {
    const matchesQuery = `${record.employeeName} ${record.employeeId}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!date || record.date === date) && (status === "ALL" || record.status === status);
  }), [date, query, records, status]);

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-blue-950/[0.05]">
      <div className="flex flex-col gap-3 border-b border-white/80 p-4 sm:flex-row sm:items-center">
        <input aria-label="Search employee" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee or ID" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
        <input aria-label="Filter by date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-300" />
        <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-300">
          <option value="ALL">All statuses</option><option value="PRESENT">Present</option><option value="ABSENT">Absent</option><option value="HALF_DAY">Half day</option><option value="WFH">Work from home</option>
        </select>
      </div>
      {filtered.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-white/45 text-xs font-bold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Employee</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Check-in</th><th className="px-5 py-3">Check-out</th><th className="px-5 py-3">Status</th></tr></thead>
        <tbody className="divide-y divide-slate-200/70">{filtered.map((record) => <tr key={record.attendanceId} className="transition hover:bg-white/60"><td className="px-5 py-3 font-semibold text-slate-800">{record.employeeName}<span className="mt-0.5 block text-xs font-normal text-slate-500">{record.employeeId}</span></td><td className="px-5 py-3 text-slate-600">{record.date}</td><td className="px-5 py-3 text-slate-600">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td><td className="px-5 py-3 text-slate-600">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td><td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[record.status] ?? "bg-slate-100 text-slate-600"}`}>{record.status.replace("_", " ")}</span></td></tr>)}</tbody>
      </table></div> : <p className="px-5 py-10 text-center text-sm text-slate-500">No attendance records match these filters.</p>}
      <p className="border-t border-white/80 px-5 py-3 text-xs text-slate-500">Showing {filtered.length} of {records.length} records. Missing check-outs are shown as —.</p>
    </section>
  );
}
