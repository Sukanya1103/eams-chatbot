// components/salary/GenerateSalaryForm.tsx
// Client Component — form state + submit handling. employeeId is a plain
// text field for now, same known limitation as managerId on the register
// form: upgrade to a proper picker once the employees-list endpoint exists.

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { generateSalary } from "@/lib/api/salary";

const currentDate = new Date();

export default function GenerateSalaryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [basic, setBasic] = useState("");
  const [allowances, setAllowances] = useState("");
  const [deductions, setDeductions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await generateSalary({
        employeeId,
        month,
        year,
        basic: Number(basic),
        allowances: Number(allowances || 0),
        deductions: Number(deductions || 0),
      });
      setEmployeeId("");
      setBasic("");
      setAllowances("");
      setDeductions("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate payslip");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">Generate payslip</button>
      {open && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-label="Generate payslip"><form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-cyan-100 bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Payroll</p><h2 className="mt-1 text-xl font-bold text-slate-950">Generate payslip</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Close payslip form" className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-cyan-50">×</button></div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-700">Employee ID</label>
          <input
            required
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Month</label>
          <input
            type="number"
            min={1}
            max={12}
            required
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Year</label>
          <input
            type="number"
            required
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Basic</label>
          <input
            type="number"
            required
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Allowances</label>
          <input
            type="number"
            value={allowances}
            onChange={(e) => setAllowances(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-700">Deductions</label>
          <input
            type="number"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isSubmitting ? "Generating…" : "Generate payslip"}
      </button>
      </form></div>}
    </>
  );
}
