// app/(dashboard)/manager/team-leaves/page.tsx
// Identical shape to app/(dashboard)/hr/leaves/page.tsx, reusing the same
// getLeaves() call and the same LeaveTable component. The backend's
// DataScopeService is what makes this safe and correct: a Manager's JWT
// makes GET /api/leaves return only their team's requests, so this page
// never needs its own "manager mode" — it's the exact same code path as
// HR's page, just naturally showing less because the backend allows less.

import { getLeaves } from "@/lib/server/leaves";
import LeaveTable from "@/components/leaves/LeaveTable";

export default async function ManagerTeamLeavesPage() {
  const leaves = await getLeaves();
  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Team leave requests</h1>
      <p className="mt-1 text-sm text-slate-500">
        {pendingCount} pending {pendingCount === 1 ? "request" : "requests"} from your team.
      </p>

      <div className="mt-6">
        <LeaveTable leaves={leaves} />
      </div>
    </div>
  );
}
