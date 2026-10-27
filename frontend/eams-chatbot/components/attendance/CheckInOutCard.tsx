"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkIn, checkOut } from "@/lib/api/attendance";
import type { AttendanceResponse } from "@/types/attendance";

export default function CheckInOutCard({ today, dataAvailable = true }: { today: AttendanceResponse | undefined; dataAvailable?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedInOverride, setCheckedInOverride] = useState<boolean | null>(null);
  const checkedIn = checkedInOverride ?? (today?.state === "CHECKED_IN" || (!!today?.checkIn && !today.checkOut));
  const actionLabel = checkedIn ? "Check Out" : "Check In";

  async function act(action: "check-in" | "check-out") {
    setError(null); setIsSubmitting(true);
    try {
      if (action === "check-in") await checkIn(); else await checkOut();
      setCheckedInOverride(action === "check-in");
      router.refresh();
    }
    catch (caught) { setError(caught instanceof Error ? caught.message : `Failed to ${action}`); }
    finally { setIsSubmitting(false); }
  }

  return <div className="w-fit min-w-0 rounded-xl border border-slate-200 bg-white p-3 text-[#1F2937] shadow-lg">
    {dataAvailable && <div className="flex justify-center"><button onClick={() => act(checkedIn ? "check-out" : "check-in")} disabled={isSubmitting} aria-busy={isSubmitting} className={buttonClass}>
      {isSubmitting && <span aria-hidden="true" className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white align-[-3px]" />}
      {actionLabel}
    </button></div>}
    {error && <p role="alert" className="mt-3 text-sm text-[#DC2626]">{error}</p>}
  </div>;
}

const buttonClass = "inline-flex items-center rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400";
