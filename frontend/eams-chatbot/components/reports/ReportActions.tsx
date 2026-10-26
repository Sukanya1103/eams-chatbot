"use client";

import type { AttendanceResponse } from "@/types/attendance";

export default function ReportActions({ records }: { records: AttendanceResponse[] }) {
  function exportCsv() {
    const rows = [
      ["Employee", "Employee ID", "Date", "Check-in", "Check-out", "Status"],
      ...records.map((record) => [record.employeeName, record.employeeId, record.date, record.checkIn ?? "", record.checkOut ?? "", record.status]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `eams-attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <div className="flex flex-wrap gap-2 print:hidden">
    <button type="button" onClick={exportCsv} className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-[#24445F] transition hover:bg-blue-50">Export attendance CSV</button>
    <button type="button" onClick={() => window.print()} className="rounded-xl border border-slate-200 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">Print report</button>
  </div>;
}
