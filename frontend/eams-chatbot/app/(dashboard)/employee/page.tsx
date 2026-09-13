// app/(dashboard)/employee/page.tsx
// Landing page after an Employee logs in. Only ever shows this one
// person's own data — the backend enforces this regardless, but the UI
// shouldn't even offer inputs that could imply otherwise.

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import StatCard from "@/components/ui/StatCard";

export default async function EmployeeOverviewPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Welcome back, {user?.name ?? "there"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Your attendance, leave balance, and payslips at a glance.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Leave balance" value="—" hint="Connect backend" />
        <StatCard label="Days present this month" value="—" />
        <StatCard label="Last payslip" value="—" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/employee/my-leaves"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Apply for leave
        </Link>
        <Link
          href="/employee/my-attendance"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          View my attendance
        </Link>
      </div>
    </div>
  );
}