// components/attendance/CheckInOutCard.tsx
// Client Component — the interactive check-in/check-out button. Takes
// today's record (if any) as a prop from the server-fetched list, so it
// doesn't need its own fetch just to know current status.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkIn, checkOut } from "@/lib/api/attendance";
import type { AttendanceResponse } from "@/types/attendance";

export default function CheckInOutCard({ today }: { today: AttendanceResponse | undefined }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckIn() {
    setError(null);
    setIsSubmitting(true);
    try {
      await checkIn();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check in");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCheckOut() {
    setError(null);
    setIsSubmitting(true);
    try {
      await checkOut();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check out");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-w-64 rounded-xl border border-slate-700 bg-[#20252d] p-4 text-white shadow-lg">
      <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">Current status</h2>

      {!today?.checkIn ? (
        <>
          <p className="mt-1 text-sm text-slate-500">You haven&apos;t checked in yet.</p>
          <button
            onClick={handleCheckIn}
            disabled={isSubmitting}
            className="mt-3 w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            {isSubmitting ? "Checking in…" : "Check in"}
          </button>
        </>
      ) : !today.checkOut ? (
        <>
          <p className="mt-1 text-sm text-slate-500">
            Checked in at {new Date(today.checkIn).toLocaleTimeString()}.
          </p>
          <button
            onClick={handleCheckOut}
            disabled={isSubmitting}
            className="mt-3 w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            {isSubmitting ? "Checking out…" : "Check out"}
          </button>
        </>
      ) : (
        <p className="mt-1 text-sm text-slate-500">
          Checked in at {new Date(today.checkIn).toLocaleTimeString()}, checked out at{" "}
          {new Date(today.checkOut).toLocaleTimeString()}. You&apos;re done for today.
        </p>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
