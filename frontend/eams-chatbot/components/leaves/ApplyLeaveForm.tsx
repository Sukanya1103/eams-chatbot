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

  return <><button onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">+ Apply leave</button>{open && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-label="Apply for leave"><form onSubmit={handleSubmit} className="my-auto max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#15191f] text-white shadow-2xl"><header className="sticky top-0 flex items-start justify-between border-b border-slate-700 bg-[#15191f] px-5 py-5 sm:px-7"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Leave management</p><h2 className="mt-1 text-xl font-bold">Apply leave</h2><p className="mt-1 text-sm text-slate-400">Submit your leave request for manager approval.</p></div><button type="button" onClick={close} aria-label="Close leave form" className="rounded-lg px-3 py-1 text-xl text-slate-300 hover:bg-slate-700">×</button></header><div className="space-y-5 p-5 sm:p-7"><Field label="Select leave type"><select value={type} onChange={(event) => setType(event.target.value as LeaveType)} className={inputClass}>{LEAVE_TYPES.map((leaveType) => <option key={leaveType} value={leaveType}>{formatLeaveType(leaveType)}</option>)}</select></Field><div className="grid gap-5 sm:grid-cols-2"><Field label="Start date"><input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} /></Field><Field label="End date"><input required type="date" min={startDate || undefined} value={endDate} onChange={(event) => setEndDate(event.target.value)} className={inputClass} /></Field></div><Field label="Do you want half day?"><select value={halfDay} onChange={(event) => setHalfDay(event.target.value)} className={inputClass}><option value="NO">No, full day</option><option value="YES">Yes, half day</option></select></Field><Field label="Reason"><textarea required rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for leave" className={inputClass} /></Field>{error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-200">{error}</p>}</div><footer className="border-t border-slate-700 px-5 py-5 sm:px-7"><button disabled={isSubmitting} className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">{isSubmitting ? "Submitting..." : "Apply leave"}</button></footer></form></div>}</>;
}

const inputClass = "mt-1.5 w-full rounded-lg border border-slate-600 bg-[#20252d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-900";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold text-slate-200"><span>{label}</span>{children}</label>; }
function formatLeaveType(type: LeaveType) { return type.charAt(0) + type.slice(1).toLowerCase(); }
