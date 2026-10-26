"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCompensationOptions, getMyCompensationRequests, submitCompensationRequest } from "@/lib/api/compensation";
import type { CompensationOptions, CompensationRequest } from "@/types/compensation";

export default function CompensationRequestsPanel() {
  const router = useRouter();
  const [requests, setRequests] = useState<CompensationRequest[]>([]);
  const [options, setOptions] = useState<CompensationOptions | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [workDate, setWorkDate] = useState("");
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadingError(null);
    try {
      const [policyOptions, history] = await Promise.all([getCompensationOptions(), getMyCompensationRequests()]);
      setOptions(policyOptions);
      setRequests(history);
      setType((current) => current || policyOptions.supportedTypes[0] || "");
    } catch (caught) {
      setLoadingError(caught instanceof Error ? caught.message : "Unable to load compensation requests");
    } finally { setLoaded(true); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  const counts = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((request) => request.status === "PENDING").length,
    approved: requests.filter((request) => request.status === "APPROVED").length,
    rejected: requests.filter((request) => request.status === "REJECTED").length,
  }), [requests]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setSuccess(null);
    if (!options?.available || !type) { setError(options?.message ?? "Compensation requests are currently unavailable."); return; }
    setSubmitting(true);
    try {
      const saved = await submitCompensationRequest({ workDate, compensationType: type, reason });
      setSuccess(`Request saved with status ${saved.status}.`);
      setRequests((current) => [saved, ...current.filter((request) => request.id !== saved.id)]);
      setWorkDate(""); setReason("");
      router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to submit compensation request"); }
    finally { setSubmitting(false); }
  }

  return <section aria-labelledby="compensation-title" aria-busy={!loaded} className="rounded-2xl border border-slate-200 bg-white p-6 text-[#1F2937] shadow-lg">
    <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3B82F6]">Compensation requests</p><h2 id="compensation-title" className="mt-1 text-lg font-bold">Week-off &amp; holiday compensation</h2><p className="mt-1 text-sm text-[#64748B]">Requests are checked against saved attendance and configured eligibility rules. Only Saturday/Sunday can currently be verified; company holidays are not connected. Approval does not change leave balances.</p></div>

    {!loaded ? <p role="status" className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading compensation policy and request history…</p> : loadingError ? <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-[#DC2626]">{loadingError}<button type="button" onClick={() => void load()} className="ml-3 font-semibold text-[#24445F] underline">Retry</button></div> : <>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Summary label="Total requests" value={counts.total} /><Summary label="Pending" value={counts.pending} /><Summary label="Approved" value={counts.approved} /><Summary label="Rejected" value={counts.rejected} /></div>
      {!options?.available && <p role="status" className="mt-5 rounded-lg border border-amber-200/70 bg-amber-50 px-4 py-3 text-sm text-[#D97706]">{options?.message ?? "Compensation eligibility rules have not been configured. Please contact HR."}</p>}
      {options?.available && <form onSubmit={submit} className="mt-5 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <Field label="Work date"><input required type="date" value={workDate} onChange={(event) => setWorkDate(event.target.value)} className={inputClass} /></Field>
        <Field label="Compensation type"><select required value={type} onChange={(event) => setType(event.target.value)} className={inputClass}><option value="" disabled>Select a type</option>{[...options.supportedTypes].sort().map((option) => <option key={option} value={option}>{formatType(option)}</option>)}</select></Field>
        <Field label="Reason"><textarea required maxLength={1000} rows={2} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for requesting compensation" className={`${inputClass} sm:col-span-2`} /></Field>
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626] sm:col-span-2">{error}</p>}
        {success && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#16A34A] sm:col-span-2">{success}</p>}
        <div className="sm:col-span-2"><button type="submit" disabled={submitting || !workDate || !reason.trim()} className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Submitting…" : "Submit request"}</button></div>
      </form>}
      {!options?.available && success && <p role="status" className="mt-3 text-sm text-[#16A34A]">{success}</p>}

      <div className="mt-6"><h3 className="font-semibold text-[#1F2937]">Request history</h3>{requests.length ? <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-[#F4F7FA] text-xs font-semibold uppercase tracking-wide text-slate-600"><tr><th className="px-4 py-3">Work date</th><th className="px-4 py-3">Day type</th><th className="px-4 py-3">Verified hours</th><th className="px-4 py-3">Requested type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Reviewer comments</th></tr></thead><tbody className="divide-y divide-slate-200 text-slate-700">{requests.map((request) => <tr key={request.id} className="bg-white"><td className="px-4 py-3">{dateLabel(request.workDate)}</td><td className="px-4 py-3">{formatType(request.dayType)}</td><td className="px-4 py-3">{formatMinutes(request.verifiedWorkedMinutes)}</td><td className="px-4 py-3">{formatType(request.compensationType)}</td><td className="px-4 py-3"><Status status={request.status} /></td><td className="px-4 py-3">{dateTimeLabel(request.submittedAt)}</td><td className="px-4 py-3">{request.reviewerComments || "—"}</td></tr>)}</tbody></table></div> : <div className="mt-3 grid min-h-24 place-items-center rounded-xl border border-dashed border-slate-300 px-5 text-center text-sm text-[#64748B]">No compensation requests are recorded.</div>}</div>
    </>}
  </section>;
}

function Summary({ label, value }: { label: string; value: number }) { return <article className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-[#64748B]">{label}</p><p className="mt-3 text-2xl font-bold text-[#24445F]">{value}</p></article>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold text-slate-700"><span>{label}</span>{children}</label>; }
function Status({ status }: { status: string }) { const color = status === "APPROVED" ? "bg-green-50 text-[#16A34A]" : status === "REJECTED" ? "bg-red-50 text-[#DC2626]" : "bg-amber-50 text-[#D97706]"; return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>{status}</span>; }
function formatType(value: string) { return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatMinutes(value: number) { return `${Math.floor(value / 60)}h ${value % 60}m`; }
function dateLabel(value: string) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
function dateTimeLabel(value: string) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value)); }
const inputClass = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#1F2937] outline-none placeholder:text-slate-500  focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
