// lib/api/attendance.ts
// Client-side check-in/check-out — the two actions an EMPLOYEE performs
// on themselves. There's no "mark attendance for someone else" call here
// on purpose; HR/Admin correcting records is a separate, more guarded
// action to add later, not reused from this employee-facing pair.
import type { AttendanceCorrectionRequest, AttendanceCorrectionResponse } from "@/types/attendance";

export async function checkIn(): Promise<void> {
  const res = await fetch("/api/attendance/check-in", { method: "POST" });
  if (!res.ok) throw new Error(await errorMessage(res, "Failed to check in"));
}

export async function checkOut(): Promise<void> {
  const res = await fetch("/api/attendance/check-out", { method: "POST" });
  if (!res.ok) throw new Error(await errorMessage(res, "Failed to check out"));
}

export async function submitAttendanceCorrection(request: AttendanceCorrectionRequest): Promise<AttendanceCorrectionResponse> {
  const response = await fetch("/api/attendance/corrections", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof body?.message === "string" ? body.message : "Failed to submit correction request");
  return body as AttendanceCorrectionResponse;
}

async function errorMessage(res: Response, fallback: string) {
  const data = await res.json().catch(() => null);
  return typeof data?.message === "string" ? data.message : fallback;
}
