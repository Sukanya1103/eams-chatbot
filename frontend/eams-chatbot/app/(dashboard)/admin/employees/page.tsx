// app/(dashboard)/admin/employees/page.tsx
// Admin's company-wide employee list. Server Component — fetches directly
// via lib/server/employees.ts, no client-side loading state needed.

import { getEmployees } from "@/lib/server/employees";
import EmployeeDirectory from "@/components/employees/EmployeeDirectory";
import RegisterEmployeeModal from "@/components/employees/RegisterEmployeeModal";

export default async function AdminEmployeesPage() {
  const employees = await getEmployees();

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-3xl border border-white/85 bg-white/55 p-6 shadow-lg shadow-indigo-950/[0.05] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Admin workspace</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-[#202944]">All employees</h1>
          <p className="mt-1 text-sm text-slate-600">
            {employees.length} {employees.length === 1 ? "employee" : "employees"} across the company.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3"><RegisterEmployeeModal /><span className="text-xs text-slate-500">Create employee, manager, or HR accounts</span></div>
      </div>
      <EmployeeDirectory employees={employees} />
    </div>
  );
}
