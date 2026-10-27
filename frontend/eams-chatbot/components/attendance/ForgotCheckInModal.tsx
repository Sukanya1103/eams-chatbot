"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { submitAttendanceCorrection } from "@/lib/api/attendance";

export default function ForgotCheckInModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [agenda, setAgenda] = useState("");
  const [link, setLink] = useState("");
  const [agendas, setAgendas] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function close() { if (!submitting) { setOpen(false); setError(null); } }
  function reset() {
    setAttendanceDate(""); setCheckInTime(""); setCheckOutDate(""); setCheckOutTime("");
    setReason(""); setRemarks(""); setAgenda(""); setLink(""); setAgendas([]); setLinks([]);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setFeedback(null);
    const start = `${attendanceDate}T${checkInTime}`;
    const end = `${checkOutDate}T${checkOutTime}`;
    if (!attendanceDate || !checkInTime || !checkOutDate || !checkOutTime || end <= start) {
      setError("Check-out must be later than check-in. For an overnight shift, choose the following checkout date.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitAttendanceCorrection({
        attendanceDate, checkInTime, checkOutDate, checkOutTime, reason,
        remarks: remarks.trim() || undefined, agendas, referenceLinks: links,
      });
      reset(); setOpen(false); setFeedback(`Correction request saved with status ${result.status}.`); router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit correction request");
    } finally { setSubmitting(false); }
  }

  return <div>
    <button onClick={() => { setFeedback(null); setOpen(true); }} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">+ Forgot to check in?</button>
    {feedback && <p role="status" className="mt-2 text-sm text-[#16A34A]">{feedback}</p>}
    {open && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-label="Attendance correction request">
      <form onSubmit={submit} className="my-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white text-[#1F2937] shadow-2xl">
        <header className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-5 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3B82F6]">Attendance correction</p><h2 className="mt-1 text-xl font-bold text-[#1F2937]">Forgot check-in request</h2><p className="mt-1 text-sm text-[#64748B]">The request stays pending until it is reviewed.</p></div><button type="button" onClick={close} aria-label="Close request form" className="rounded-lg px-3 py-1 text-xl text-[#64748B] hover:bg-slate-100 hover:text-slate-900">×</button></header>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Attendance date"><input required type="date" value={attendanceDate} onChange={(event) => { setAttendanceDate(event.target.value); if (!checkOutDate) setCheckOutDate(event.target.value); }} className={inputClass} /></Field><Field label="Requested check-in"><input required type="time" value={checkInTime} onChange={(event) => setCheckInTime(event.target.value)} className={inputClass} /></Field><Field label="Check-out date"><input required type="date" min={attendanceDate || undefined} value={checkOutDate} onChange={(event) => setCheckOutDate(event.target.value)} className={inputClass} /></Field><Field label="Requested check-out"><input required type="time" value={checkOutTime} onChange={(event) => setCheckOutTime(event.target.value)} className={inputClass} /></Field></div>
          <Field label="Reason for missing punch"><select required value={reason} onChange={(event) => setReason(event.target.value)} className={inputClass}><option value="">Select a reason</option><option>Forgot to check in</option><option>Forgot to check out</option><option>Technical issue</option><option>Other</option></select></Field>
          <Field label="Work agendas (optional)"><div className="flex gap-2"><input value={agenda} onChange={(event) => setAgenda(event.target.value)} placeholder="e.g. Client project review" className={inputClass} /><button type="button" onClick={() => { if (agenda.trim()) { setAgendas((items) => [...items, agenda.trim()]); setAgenda(""); } }} className={addClass}>+ Add</button></div>{agendas.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{agendas.map((item, index) => <span key={`${item}-${index}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-[#24445F]">{item}</span>)}</div>}</Field>
          <Field label="Additional remarks (optional)"><textarea rows={2} maxLength={1000} value={remarks} onChange={(event) => setRemarks(event.target.value)} className={inputClass} /></Field>
          <Field label="Reference links (optional)"><div className="flex gap-2"><input type="url" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://..." className={inputClass} /><button type="button" onClick={() => { if (link.trim()) { setLinks((items) => [...items, link.trim()]); setLink(""); } }} className={addClass}>+ Add</button></div>{links.length > 0 && <ul className="mt-2 space-y-1 text-xs text-[#24445F]">{links.map((item, index) => <li key={`${item}-${index}`} className="truncate">{item}</li>)}</ul>}</Field>
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">{error}</p>}
        </div>
        <footer className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-5 sm:px-6"><button type="button" onClick={close} disabled={submitting} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50">Cancel</button><button type="submit" disabled={submitting} className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">{submitting ? "Submitting…" : "Send request"}</button></footer>
      </form>
    </div>}
  </div>;
}

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#1F2937] outline-none placeholder:text-[#64748B]  focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
const addClass = "shrink-0 rounded-lg bg-slate-100 px-4 text-sm font-semibold text-[#24445F] hover:bg-slate-100";
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold text-slate-700"><span className="mb-1.5 block">{label}</span>{children}</label>; }
