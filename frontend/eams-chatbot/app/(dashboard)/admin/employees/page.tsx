// app/(dashboard)/admin/employees/page.tsx
// Admin's company-wide employee list. Server Component — fetches directly
// via lib/server/employees.ts, no client-side loading state needed.

import Link from "next/link";
import { getEmployees } from "@/lib/server/employees";

export default async function AdminEmployeesPage() {
  const employees = await getEmployees();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">All employees</h1>
          <p className="mt-1 text-sm text-slate-500">
            {employees.length} {employees.length === 1 ? "employee" : "employees"} across the company.
          </p>
        </div>
        <Link
          href="/hr/register-employee"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Register employee
        </Link>
      </div>

      {employees.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No employees yet. Once the backend&apos;s employee list endpoint is
          connected, or after registering someone, they&apos;ll show up here.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Designation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{emp.name}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.email}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.role}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.department}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
