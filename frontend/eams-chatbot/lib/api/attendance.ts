// lib/api/attendance.ts
// Client-side check-in/check-out — the two actions an EMPLOYEE performs
// on themselves. There's no "mark attendance for someone else" call here
// on purpose; HR/Admin correcting records is a separate, more guarded
// action to add later, not reused from this employee-facing pair.

export async function checkIn(): Promise<void> {
  const res = await fetch("/api/attendance/check-in", { method: "POST" });
  if (!res.ok) throw new Error("Failed to check in");
}

export async function checkOut(): Promise<void> {
  const res = await fetch("/api/attendance/check-out", { method: "POST" });
  if (!res.ok) throw new Error("Failed to check out");
}