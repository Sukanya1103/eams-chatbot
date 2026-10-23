// app/(dashboard)/employee/my-salary/page.tsx
// Same getSalaries() call as HR's page — the backend returns only this
// employee's own payslips for an EMPLOYEE-role token, automatically.
// No GenerateSalaryForm here: employees view payslips, they don't create them.

import { getSalaries } from "@/lib/server/salary";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { employeeDisplayName } from "../employeeName";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default async function MySalaryPage() {
  const [salaries, user] = await Promise.all([getSalaries(), getCurrentUser()]);
  const sorted = [...salaries].sort((a, b) => b.year - a.year || b.month - a.month);
  const name = employeeDisplayName(user?.name) ?? "there";

  return (
    <div className="mx-auto max-w-5xl">
      <header className="rounded-2xl border border-slate-700 bg-[#171b22] p-6 text-white shadow-lg"><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-300">Payroll</p><h1 className="mt-2 text-2xl font-bold">Salary records, {name}</h1><p className="mt-1 text-sm text-slate-400">Your payslip history and salary breakdown.</p></header>

      {sorted.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-400 bg-white/60 p-8 text-center text-sm text-slate-600">
          No payslips have been generated yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {sorted.map((s) => (
            <div
              key={s.salaryId}
              className="rounded-2xl border border-slate-700 bg-[#20252d] p-5 text-white shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-100">
                  {MONTH_NAMES[s.month - 1]} {s.year}
                </h2>
                <span className="text-lg font-bold text-cyan-300">
                  {money(s.netPay)}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <dt className="text-slate-500">Basic</dt>
                  <dd className="font-medium text-slate-100">{money(s.basic)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Allowances</dt>
                  <dd className="font-medium text-slate-100">{money(s.allowances)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Deductions</dt>
                  <dd className="font-medium text-slate-100">{money(s.deductions)}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function money(value: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value); }
