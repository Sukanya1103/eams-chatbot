"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkIn, checkOut } from "@/lib/api/attendance";
import type { AttendanceResponse } from "@/types/attendance";

export default function CheckInOutCard({ today, dataAvailable = true }: { today: AttendanceResponse | undefined; dataAvailable?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const sessions = today?.sessions?.length ? today.sessions : today?.checkIn ? [{ sessionId: "legacy", checkIn: today.checkIn, checkOut: today.checkOut }] : [];
  const active = sessions.some((session) => !session.checkOut) || today?.state === "CHECKED_IN";
  const workedSeconds = sessions.length ? sessions.reduce((sum, session) => {
    const start = Date.parse(session.checkIn); const end = session.checkOut ? Date.parse(session.checkOut) : now;
    return sum + (Number.isFinite(start) && Number.isFinite(end) && end > start ? Math.floor((end - start) / 1000) : 0);
  }, 0) : (today?.totalWorkedSeconds ?? 0);
  const progress = Math.min(100, (workedSeconds / 28800) * 100);

  async function act(action: "check-in" | "check-out") {
    setError(null); setIsSubmitting(true);
    try { if (action === "check-in") await checkIn(); else await checkOut(); router.refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : `Failed to ${action}`); }
    finally { setIsSubmitting(false); }
  }

  return <div className="min-w-64 rounded-xl border border-slate-700 bg-[#20252d] p-4 text-white shadow-lg">
    <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">Current status</h2>
    {!dataAvailable ? <p className="mt-2 text-sm text-amber-200">Attendance data is unavailable. Actions are disabled until it loads.</p> : <>
      <p className="mt-1 text-sm text-slate-300">{!sessions.length ? "You haven’t checked in yet." : active ? "You have an active attendance session." : "All attendance sessions are checked out."}</p>
      {active ? <button onClick={() => act("check-out")} disabled={isSubmitting} className={buttonClass}>{isSubmitting ? "Checking out…" : "Check out"}</button>
        : <button onClick={() => act("check-in")} disabled={isSubmitting} className={buttonClass}>{isSubmitting ? "Checking in…" : sessions.length ? "Check in again" : "Check in"}</button>}
      {sessions.length > 0 && <div className="mt-4 space-y-2.5">
        <div className="flex justify-between text-xs"><span className="text-slate-400">Total time worked</span><span className="font-semibold text-slate-100">{formatDuration(workedSeconds)}</span></div>
        <div role="progressbar" aria-label="Eight-hour shift progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-2 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
        <ul className="space-y-1.5 text-xs text-slate-300">{sessions.map((session, index) => <li key={session.sessionId} className="flex justify-between gap-2"><span>Session {index + 1}: {formatTime(session.checkIn)} – {session.checkOut ? formatTime(session.checkOut) : "Active"}</span><span>{formatDuration(Math.max(0, (Date.parse(session.checkOut ?? new Date(now).toISOString()) - Date.parse(session.checkIn)) / 1000))}</span></li>)}</ul>
      </div>}
    </>}
    {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
  </div>;
}

const buttonClass = "mt-3 w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300";
function formatDuration(seconds: number) { const value = Math.floor(seconds); return `${Math.floor(value / 3600)}h ${Math.floor((value % 3600) / 60)}m ${value % 60}s`; }
function formatTime(value: string) { return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(value)); }
