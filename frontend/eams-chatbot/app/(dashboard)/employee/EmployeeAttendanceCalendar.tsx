"use client";

import { useState } from "react";
import type { AttendanceResponse } from "@/types/attendance";

export default function EmployeeAttendanceCalendar({ today, records }: { today: string; records: AttendanceResponse[] }) {
  const [offset, setOffset] = useState(0);
  const current = new Date(`${today}T12:00:00`);
  current.setDate(1);
  current.setMonth(current.getMonth() + offset);
  const year = current.getFullYear(); const monthIndex = current.getMonth();
  const days = new Date(year, monthIndex + 1, 0).getDate(); const firstDay = new Date(year, monthIndex, 1).getDay();
  const byDate = new Map(records.map((record) => [record.date, record.status]));
  const observed = new Set(byDate.values());
  const cells = Array.from({ length: firstDay + days }, (_, i) => i < firstDay ? null : i - firstDay + 1);
  const label = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(current);
  const legends = [{ key: "PRESENT", label: "Present", color: "bg-cyan-500" }, { key: "ABSENT", label: "Absent", color: "bg-red-500" }, { key: "HALF_DAY", label: "Half day", color: "bg-amber-400" }, { key: "WFH", label: "WFH", color: "bg-blue-500" }];

  return <article className="rounded-2xl border border-slate-700 bg-[#171b22] p-5 text-white shadow-lg"><div className="flex items-center justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Monthly record</p><h2 className="mt-1 font-bold">{label}</h2></div><div className="flex gap-1"><button onClick={() => setOffset((value) => value - 1)} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">‹</button><button onClick={() => setOffset((value) => value + 1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">›</button></div></div><div className="mt-5 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-1">{cells.map((day, index) => { if (!day) return <span key={`gap-${index}`} />; const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; const status = byDate.get(date); const color = status === "PRESENT" ? "bg-cyan-500 text-white" : status === "ABSENT" ? "bg-red-500 text-white" : status === "HALF_DAY" ? "bg-amber-400 text-slate-950" : status === "WFH" ? "bg-blue-500 text-white" : date === today ? "border border-cyan-300 bg-cyan-900/40 text-cyan-200" : "text-slate-300 hover:bg-slate-800"; return <span key={date} title={status ?? (date === today ? "Today" : undefined)} className={`grid aspect-square place-items-center rounded-lg text-xs font-semibold ${color}`}>{day}</span>; })}</div><div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-[10px] text-slate-300">{legends.filter((item) => observed.has(item.key as AttendanceResponse["status"])).map((item) => <span key={item.key} className="flex items-center gap-1.5"><i className={`h-2 w-2 rounded-full ${item.color}`} />{item.label}</span>)}<span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full border border-cyan-300" />Today</span></div></article>;
}
