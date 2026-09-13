// app/(dashboard)/hr/page.tsx
// Landing page after an HR user logs in.

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import StatCard from "@/components/ui/StatCard";

export default async function HrOverviewPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Welcome back, {user?.name ?? "there"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage employees, leave approvals, and payroll from here.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Active employees" value="—" hint="Connect backend" />
        <StatCard label="Pending leave requests" value="—" />
        <StatCard label="Payroll due this month" value="—" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/hr/register-employee"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Register new employee
        </Link>
        <Link
          href="/hr/leaves"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Review pending leaves
        </Link>
      </div>
    </div>
  );
}
