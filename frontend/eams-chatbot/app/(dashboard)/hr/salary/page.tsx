// app/(dashboard)/hr/salary/page.tsx

import { getSalaries } from "@/lib/server/salary";
import GenerateSalaryForm from "@/components/salary/GenerateSalaryForm";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default async function HrSalaryPage() {
  const salaries = await getSalaries();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Salary</h1>
      <p className="mt-1 text-sm text-slate-500">
        Generate and review payslips across the company.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {salaries.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No payslips generated yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Period</th>
                    <th className="px-4 py-3">Basic</th>
                    <th className="px-4 py-3">Allowances</th>
                    <th className="px-4 py-3">Deductions</th>
                    <th className="px-4 py-3">Net pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salaries.map((s) => (
                    <tr key={s.salaryId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{s.employeeName}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {MONTH_NAMES[s.month - 1]} {s.year}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{s.basic.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-600">{s.allowances.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-600">{s.deductions.toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {s.netPay.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <GenerateSalaryForm />
        </div>
      </div>
    </div>
  );
}

