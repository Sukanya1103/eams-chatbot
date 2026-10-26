"use client";

import { useMemo, useState } from "react";
import LeaveTable from "@/components/leaves/LeaveTable";
import type { LeaveResponse } from "@/types/leave";

export default function AdminLeaveQueue({ leaves }: { leaves: LeaveResponse[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const filtered = useMemo(() => leaves.filter((leave) => {
    const matchesQuery = `${leave.employeeName} ${leave.employeeId}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "ALL" || leave.status === status) && (type === "ALL" || leave.type === type);
  }), [leaves, query, status, type]);
  const firstOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const leadingDays = (firstOfMonth.getDay() + 6) % 7;
  const calendarCells = Array.from({ length: Math.ceil((leadingDays + daysInMonth) / 7) * 7 }, (_, index) => {
    const dayNumber = index - leadingDays + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return null;
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayNumber);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
    return { key, dayNumber, events: leaves.filter((leave) => leave.startDate <= key && leave.endDate >= key) };
  });

  return <>
    <section className="mt-6 rounded-3xl border border-white/85 bg-white/60 p-5 shadow-lg shadow-indigo-950/[0.05] backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Time off</p><h2 className="mt-1 text-lg font-bold text-[#202944]">Leave calendar</h2></div><div className="flex items-center gap-2"><button type="button" aria-label="Previous month" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/70 text-slate-700 hover:bg-violet-50">‹</button><span className="min-w-28 text-center text-sm font-semibold text-slate-700">{calendarMonth.toLocaleDateString("en", { month: "long", year: "numeric" })}</span><button type="button" aria-label="Next month" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/70 text-slate-700 hover:bg-violet-50">›</button></div></div>
      <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <div key={day} className="pb-1 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">{day}</div>)}
        {calendarCells.map((cell, index) => cell ? <div key={cell.key} className="min-h-16 rounded-xl border border-white/90 bg-white/55 p-1.5 sm:min-h-20 sm:p-2"><p className="text-xs font-semibold text-slate-600">{cell.dayNumber}</p>{cell.events.length > 0 && <div className="mt-1 space-y-1"><p className="truncate rounded-md bg-violet-100 px-1 py-0.5 text-[9px] font-bold text-violet-800 sm:text-[10px]">{cell.events.length} on leave</p>{cell.events[0] && <p className="hidden truncate text-[10px] text-slate-500 sm:block">{cell.events[0].employeeName}</p>}</div>}</div> : <div key={`empty-${index}`} className="min-h-16 rounded-xl bg-white/20 sm:min-h-20" />)}
      </div>
      <p className="mt-3 text-xs text-slate-500">Calendar includes pending and approved requests; use the status filter below to review or decide requests.</p>
    </section>
    <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/50 p-4 backdrop-blur-xl sm:flex-row">
      <input aria-label="Search employee" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100" />
      <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm"><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select>
      <select aria-label="Filter by leave type" value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm"><option value="ALL">All leave types</option><option value="SICK">Sick</option><option value="CASUAL">Casual</option><option value="EARNED">Earned</option><option value="UNPAID">Unpaid</option><option value="OTHER">Other</option></select>
    </section>
    <div className="mt-4 overflow-x-auto rounded-2xl border border-white/80 bg-white/55 backdrop-blur-xl"><LeaveTable leaves={filtered} /></div>
    <p className="mt-2 text-xs text-slate-500">Showing {filtered.length} of {leaves.length} requests. Approvals and rejections are sent to the existing backend actions.</p>
  </>;
}
