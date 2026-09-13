// app/(dashboard)/employee/my-salary/page.tsx
// Same getSalaries() call as HR's page — the backend returns only this
// employee's own payslips for an EMPLOYEE-role token, automatically.
// No GenerateSalaryForm here: employees view payslips, they don't create them.

import { getSalaries } from "@/lib/server/salary";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default async function MySalaryPage() {
  const salaries = await getSalaries();
  const sorted = [...salaries].sort((a, b) => b.year - a.year || b.month - a.month);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">My salary</h1>
      <p className="mt-1 text-sm text-slate-500">Your payslip history.</p>

      {sorted.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No payslips have been generated yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {sorted.map((s) => (
            <div
              key={s.salaryId}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  {MONTH_NAMES[s.month - 1]} {s.year}
                </h2>
                <span className="text-lg font-semibold text-slate-900">
                  {s.netPay.toLocaleString()}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <dt className="text-slate-500">Basic</dt>
                  <dd className="font-medium text-slate-900">{s.basic.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Allowances</dt>
                  <dd className="font-medium text-slate-900">{s.allowances.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Deductions</dt>
                  <dd className="font-medium text-slate-900">{s.deductions.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
