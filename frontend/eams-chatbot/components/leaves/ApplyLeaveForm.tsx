"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { applyLeave } from "@/lib/api/leaves";
import type { LeaveType } from "@/types/leave";

const LEAVE_TYPES: LeaveType[] = ["SICK", "CASUAL", "EARNED", "UNPAID", "OTHER"];

export default function ApplyLeaveForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<LeaveType>("CASUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [halfDay, setHalfDay] = useState("NO");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() { setOpen(false); setError(null); }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setError(null); setIsSubmitting(true);
    try { await applyLeave({ type, startDate, endDate, reason: halfDay === "YES" ? `[Half day] ${reason}` : reason }); setStartDate(""); setEndDate(""); setReason(""); setHalfDay("NO"); close(); router.refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Failed to submit request"); }
    finally { setIsSubmitting(false); }
  }

  return <><button onClick={() => setOpen(true)} className="inline-flex items-center justify-center rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700">+ Apply leave</button>{open && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-label="Apply for leave"><form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-2xl border border-cyan-100 bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-cyan-100 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Leave management</p><h2 className="mt-1 text-xl font-bold text-slate-950">Apply leave</h2><p className="mt-1 text-sm text-slate-500">Submit your leave request for manager approval.</p></div><button type="button" onClick={close} aria-label="Close leave form" className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-cyan-50 hover:text-cyan-700">×</button></header><div className="space-y-5 p-6"><Field label="Select leave type"><select value={type} onChange={(event) => setType(event.target.value as LeaveType)} className={inputClass}>{LEAVE_TYPES.map((leaveType) => <option key={leaveType} value={leaveType}>{formatLeaveType(leaveType)}</option>)}</select></Field><div className="grid gap-5 sm:grid-cols-2"><Field label="Start date"><input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} /></Field><Field label="End date"><input required type="date" min={startDate || undefined} value={endDate} onChange={(event) => setEndDate(event.target.value)} className={inputClass} /></Field></div><Field label="Do you want half day?"><select value={halfDay} onChange={(event) => setHalfDay(event.target.value)} className={inputClass}><option value="NO">No, full day</option><option value="YES">Yes, half day</option></select></Field><Field label="Reason"><textarea required rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for leave" className={inputClass} /></Field>{error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}</div><footer className="border-t border-cyan-100 px-6 py-5"><button disabled={isSubmitting} className="w-full rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50">{isSubmitting ? "Submitting..." : "Apply leave"}</button></footer></form></div>}</>;
}

const inputClass = "mt-1.5 w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold text-slate-700"><span>{label}</span>{children}</label>; }
function formatLeaveType(type: LeaveType) { return type.charAt(0) + type.slice(1).toLowerCase(); }
