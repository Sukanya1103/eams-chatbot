// app/(dashboard)/admin/page.tsx
// Landing page after an Admin logs in. Stats here are placeholders —
// wire these up to real Spring Boot endpoints
// (e.g. GET /api/admin/stats) once the backend exists.

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import StatCard from "@/components/ui/StatCard";

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Welcome back, {user?.name ?? "Admin"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Company-wide overview across every department.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total employees" value="—" hint="Connect backend" />
        <StatCard label="Present today" value="—" />
        <StatCard label="Pending leave requests" value="—" />
        <StatCard label="Open departments" value="—" />
      </div>

      <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        Recent activity, headcount charts, and payroll summaries will render
        here once the reporting endpoints are connected.
      </div>
    </div>
  );
}
