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
  PENDING: "bg-amber-50 text-[#D97706]",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

export default function LeaveTable({
  leaves,
  readOnly = false,
  showEmployeeName = true,
  employeeTheme = false,
}: {
  leaves: LeaveResponse[];
  readOnly?: boolean;
  showEmployeeName?: boolean;
  employeeTheme?: boolean;
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
      <div className={`rounded-xl border border-dashed p-8 text-center text-sm ${employeeTheme ? "border-slate-400 bg-white/60 text-slate-600" : "border-slate-300 text-slate-500"}`}>
        No leave requests to show.
      </div>
    );
  }

  return (
    <div className={`${employeeTheme ? "overflow-x-auto rounded-xl" : "overflow-hidden rounded-lg"} border ${employeeTheme ? "border-slate-200 bg-white" : "border-slate-200"}`}>
      <table className={`w-full text-sm ${employeeTheme ? "min-w-[760px]" : ""}`}>
        <thead className={`${employeeTheme ? "bg-[#F4F7FA] text-slate-600" : "bg-slate-50 text-slate-500"} text-left text-xs font-semibold uppercase tracking-wide`}>
          <tr>
            {showEmployeeName && <th className="px-4 py-3">Employee</th>}
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Dates</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className={`divide-y ${employeeTheme ? "divide-slate-200 text-slate-700" : "divide-slate-100"}`}>
          {leaves.map((leave) => (
            <tr key={leave.leaveId} className={employeeTheme ? "hover:bg-slate-100/60" : "hover:bg-slate-50"}>
              {showEmployeeName && <td className={`px-4 py-3 font-medium ${employeeTheme ? "text-[#1F2937]" : "text-slate-900"}`}>{leave.employeeName}</td>}
              <td className={`px-4 py-3 ${employeeTheme ? "text-slate-600" : "text-slate-600"}`}>{leave.type}</td>
              <td className={`px-4 py-3 ${employeeTheme ? "text-slate-600" : "text-slate-600"}`}>
                {leave.startDate} → {leave.endDate}
              </td>
              <td className={`px-4 py-3 ${employeeTheme ? "text-slate-600" : "text-slate-600"}`}>{leave.reason}</td>
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
                      className="rounded-md bg-[#3B82F6] px-3 py-1 text-xs font-medium text-white hover:bg-[#24445F] disabled:opacity-50"
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
