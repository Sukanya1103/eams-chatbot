"use client";

import { useState } from "react";
import type { EmployeeSummary } from "@/types/employee";
import { DEPARTMENTS, normalizeDepartment } from "@/lib/constants/departments";

export default function EmployeeDirectory({ employees }: { employees: EmployeeSummary[] }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const departments = [...new Set([
    ...DEPARTMENTS,
    ...employees.map((employee) => normalizeDepartment(employee.department)).filter(Boolean),
  ])];
  const filtered = employees.filter((employee) => {
    const matchesQuery = `${employee.name} ${employee.employeeId} ${employee.email}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (role === "ALL" || employee.role === role) && (department === "ALL" || normalizeDepartment(employee.department) === department);
  });

  return <>
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/50 p-4 backdrop-blur-xl sm:flex-row">
      <input aria-label="Search employees" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or employee ID" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
      <select aria-label="Filter by role" value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm"><option value="ALL">All roles</option><option value="EMPLOYEE">Employee</option><option value="MANAGER">Manager</option><option value="HR">HR</option></select>
      <select aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)} className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm"><option value="ALL">All departments</option>{departments.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    </div>
    {filtered.length ? <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-950/[0.04]"><table className="w-full min-w-[720px] text-left text-sm">
      <thead className="bg-white/50 text-xs font-bold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Name / ID</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Department</th><th className="px-5 py-3">Designation</th></tr></thead>
      <tbody className="divide-y divide-slate-200/70">{filtered.map((employee) => <tr key={employee.employeeId} className="transition hover:bg-white/70"><td className="px-5 py-3 font-semibold text-slate-800">{employee.name}<span className="mt-0.5 block text-xs font-normal text-slate-500">{employee.employeeId}</span></td><td className="px-5 py-3 text-slate-600">{employee.email}</td><td className="px-5 py-3"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#3B82F6]">{employee.role}</span></td><td className="px-5 py-3 text-slate-600">{normalizeDepartment(employee.department) || "—"}</td><td className="px-5 py-3 text-slate-600">{employee.designation || "—"}</td></tr>)}</tbody>
    </table></div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white/40 p-8 text-center text-sm text-slate-500">No employees match these filters.</div>}
    <p className="mt-2 text-xs text-slate-500">Showing {filtered.length} of {employees.length}. The current backend supports registration and listing; employee editing and deactivation are not available yet.</p>
  </>;
}
