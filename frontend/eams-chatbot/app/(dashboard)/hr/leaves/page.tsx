// app/(dashboard)/hr/leaves/page.tsx

import { getLeaves } from "@/lib/server/leaves";
import LeaveTable from "@/components/leaves/LeaveTable";

export default async function HrLeavesPage() {
  const leaves = await getLeaves();
  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Leave requests</h1>
      <p className="mt-1 text-sm text-slate-500">
        {pendingCount} pending {pendingCount === 1 ? "request" : "requests"} across the company.
      </p>

      <div className="mt-6">
        <LeaveTable leaves={leaves} />
      </div>
    </div>
  );
}
