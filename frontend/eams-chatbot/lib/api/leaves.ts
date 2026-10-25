// lib/api/leaves.ts
// Client-side leave actions — called from interactive components (buttons,
// forms). Each goes through our own BFF route, same pattern as auth/employees.

import type { ApplyLeaveRequest } from "@/types/leave";

export async function approveLeave(leaveId: string): Promise<void> {
  const res = await fetch(`/api/leaves/${leaveId}/approve`, { method: "POST" });
  if (!res.ok) throw new Error(await responseMessage(res, "Failed to approve leave"));
}

export async function rejectLeave(leaveId: string): Promise<void> {
  const res = await fetch(`/api/leaves/${leaveId}/reject`, { method: "POST" });
  if (!res.ok) throw new Error(await responseMessage(res, "Failed to reject leave"));
}

async function responseMessage(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null);
  return typeof data?.message === "string" ? data.message : fallback;
}

export async function applyLeave(data: ApplyLeaveRequest): Promise<void> {
  const res = await fetch("/api/leaves", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await responseMessage(res, "");

    throw new Error(
      errorText || `Failed to submit leave request (${res.status})`
    );
  }
}

