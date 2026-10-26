"use client";

import { useMemo, useState } from "react";
import LeaveTable from "@/components/leaves/LeaveTable";
import type { LeaveResponse } from "@/types/leave";

export default function EmployeeLeaveRequests({ leaves }: { leaves: LeaveResponse[] }) {
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const filtered = useMemo(() => leaves.filter((leave) => (status === "ALL" || leave.status === status) && (type === "ALL" || leave.type === type)), [leaves, status, type]);
  return <>
    <div className="flex flex-wrap gap-2"><label className="sr-only" htmlFor="employee-leave-status">Filter by status</label><select id="employee-leave-status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select><label className="sr-only" htmlFor="employee-leave-type">Filter by leave type</label><select id="employee-leave-type" value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"><option value="ALL">All types</option><option value="CASUAL">Casual</option><option value="SICK">Sick</option><option value="EARNED">Earned</option><option value="UNPAID">Unpaid</option><option value="OTHER">Other</option></select></div>
    <div className="mt-5"><LeaveTable leaves={filtered} readOnly showEmployeeName={false} employeeTheme /></div>
  </>;
}
