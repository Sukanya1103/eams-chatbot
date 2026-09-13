// app/(dashboard)/employee/my-leaves/page.tsx

import { getLeaves } from "@/lib/server/leaves";
import LeaveTable from "@/components/leaves/LeaveTable";
import ApplyLeaveForm from "@/components/leaves/ApplyLeaveForm";

export default async function MyLeavesPage() {
  const leaves = await getLeaves();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">My leaves</h1>
      <p className="mt-1 text-sm text-slate-500">
        Apply for leave and track the status of your requests.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeaveTable leaves={leaves} readOnly />
        </div>
        <div>
          <ApplyLeaveForm />
        </div>
      </div>
    </div>
  );
}
