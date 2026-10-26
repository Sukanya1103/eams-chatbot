"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { applyWorkFromHome } from "@/lib/api/workFromHome";

export default function ApplyWorkFromHomeForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function close() { if (!submitting) { setOpen(false); setError(null); } }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setFeedback(null);
    if (endDate < startDate) { setError("End date must be on or after the start date."); return; }
    setSubmitting(true);
    try {
      const saved = await applyWorkFromHome({ startDate, endDate, reason, remarks: remarks.trim() || undefined });
      setStartDate(""); setEndDate(""); setReason(""); setRemarks(""); setOpen(false);
      setFeedback(`Request saved with status ${saved.status}.`); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to submit the request"); }
    finally { setSubmitting(false); }
  }

  return <div>
    <button onClick={() => { setFeedback(null); setOpen(true); }} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">+ Apply Request</button>
    {feedback && <p role="status" className="mt-3 text-sm text-emerald-300">{feedback}</p>}
    {open && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-label="Work from home request">
      <form onSubmit={submit} className="my-auto max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#15191f] text-white shadow-2xl">
        <header className="sticky top-0 flex items-start justify-between border-b border-slate-700 bg-[#15191f] px-5 py-5 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Work from home</p><h2 className="mt-1 text-xl font-bold">Apply for a request</h2><p className="mt-1 text-sm text-slate-400">Your request will be saved as pending review.</p></div><button type="button" onClick={close} aria-label="Close request form" className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-700 hover:text-white">×</button></header>
        <div className="space-y-5 p-5 sm:p-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Start date"><input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} /></Field><Field label="End date"><input required type="date" min={startDate || undefined} value={endDate} onChange={(event) => setEndDate(event.target.value)} className={inputClass} /></Field></div><Field label="Reason"><textarea required maxLength={1000} rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Why are you requesting work from home?" className={inputClass} /></Field><Field label="Additional remarks (optional)"><textarea maxLength={1000} rows={2} value={remarks} onChange={(event) => setRemarks(event.target.value)} className={inputClass} /></Field>{error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-200">{error}</p>}</div>
        <footer className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-700 bg-[#15191f] px-5 py-5 sm:px-6"><button type="button" onClick={close} disabled={submitting} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50">Cancel</button><button type="submit" disabled={submitting} className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">{submitting ? "Submitting…" : "Submit request"}</button></footer>
      </form>
    </div>}
  </div>;
}

const inputClass = "mt-1.5 w-full rounded-lg border border-slate-600 bg-[#20252d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 [color-scheme:dark] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-900";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold text-slate-200"><span>{label}</span>{children}</label>; }
