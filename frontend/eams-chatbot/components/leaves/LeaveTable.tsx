// components/leaves/LeaveTable.tsx
// Client Component — needs onClick handlers, so it can't be a Server
// Component. Shared by HR's and (later) Manager's leave pages; the data
// each one passes in is already correctly scoped by the backend, so this
// component doesn't need to know or care whose leaves it's showing.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveLeave, rejectLeave } from "@/lib/api/leaves";
import type { LeaveResponse } from "@/types/leave";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

export default function LeaveTable({
  leaves,
  readOnly = false,
  showEmployeeName = true,
}: {
  leaves: LeaveResponse[];
  readOnly?: boolean;
  showEmployeeName?: boolean;
}) {
  const router = useRouter();
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  async function handleApprove(leaveId: string) {
    setPendingActionId(leaveId);
    try {
      await approveLeave(leaveId);
      router.refresh();
    } finally {
      setPendingActionId(null);
    }
  }

  async function handleReject(leaveId: string) {
    setPendingActionId(leaveId);
    try {
      await rejectLeave(leaveId);
      router.refresh();
    } finally {
      setPendingActionId(null);
    }
  }

  if (leaves.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        No leave requests to show.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {showEmployeeName && <th className="px-4 py-3">Employee</th>}
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Dates</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leaves.map((leave) => (
            <tr key={leave.leaveId} className="hover:bg-slate-50">
              {showEmployeeName && <td className="px-4 py-3 font-medium text-slate-900">{leave.employeeName}</td>}
              <td className="px-4 py-3 text-slate-600">{leave.type}</td>
              <td className="px-4 py-3 text-slate-600">
                {leave.startDate} → {leave.endDate}
              </td>
              <td className="px-4 py-3 text-slate-600">{leave.reason}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[leave.status]}`}
                >
                  {leave.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {!readOnly && leave.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(leave.leaveId)}
                      disabled={pendingActionId === leave.leaveId}
                      className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(leave.leaveId)}
                      disabled={pendingActionId === leave.leaveId}
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
