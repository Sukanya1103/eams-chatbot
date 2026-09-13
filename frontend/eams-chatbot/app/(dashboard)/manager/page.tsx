// app/(dashboard)/manager/page.tsx
// Landing page after a Manager logs in. All numbers here must come from
// endpoints already scoped to "my team" by the backend's DataScopeService —
// this page should never receive or request company-wide data.

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import StatCard from "@/components/ui/StatCard";

export default async function ManagerOverviewPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Welcome back, {user?.name ?? "there"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        A snapshot of the team reporting to you.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Team members" value="—" hint="Connect backend" />
        <StatCard label="Present today" value="—" />
        <StatCard label="Pending leave approvals" value="—" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/manager/team-leaves"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Review pending leaves
        </Link>
        <Link
          href="/manager/team-attendance"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          View team attendance
        </Link>
      </div>
    </div>
  );
}
