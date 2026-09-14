"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerEmployee } from "@/lib/api/employees";
import type { EmployeeResponse } from "@/types/employee";
import type { Role } from "@/types/user";

const roles: Role[] = ["EMPLOYEE", "MANAGER", "HR"];

export default function RegisterEmployeeModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmployeeResponse | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "EMPLOYEE" as Role, designation: "", department: "", managerId: "", dateOfJoining: "", contactNumber: "" });

  function close() { setOpen(false); setError(null); setResult(null); }
  function update(field: keyof typeof form, value: string) { setForm((current) => ({ ...current, [field]: value })); }

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(null); setIsSubmitting(true);
    try {
      const employee = await registerEmployee({ ...form, managerId: form.managerId || undefined, dateOfJoining: form.dateOfJoining || undefined, contactNumber: form.contactNumber || undefined });
      setResult(employee); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Registration failed. Please try again."); }
    finally { setIsSubmitting(false); }
  }

  return <><button onClick={() => setOpen(true)} className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100">Register employee</button>{open && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-label="Register employee"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-cyan-100 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">People operations</p><h2 className="mt-1 text-xl font-bold text-slate-950">Register new employee</h2><p className="mt-1 text-sm text-slate-500">Create a secure workspace account and issue a temporary password.</p></div><button onClick={close} aria-label="Close registration form" className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-cyan-50 hover:text-cyan-700">×</button></header>{result ? <div className="p-6"><div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5"><p className="font-semibold text-slate-950">{result.name} is ready to sign in.</p><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Credential label="Work email" value={result.email} /><Credential label="Temporary password" value={result.temporaryPassword} /></dl></div><button onClick={close} className="mt-5 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">Done</button></div> : <form onSubmit={submit} className="p-6"><div className="grid gap-4 sm:grid-cols-2"><FormInput label="Full name" value={form.name} onChange={(value) => update("name", value)} required /><FormInput label="Work email" type="email" value={form.email} onChange={(value) => update("email", value)} required /><FormInput label="Designation" value={form.designation} onChange={(value) => update("designation", value)} required /><FormInput label="Department" value={form.department} onChange={(value) => update("department", value)} required /><div><label className="text-sm font-medium text-slate-700">Role</label><select value={form.role} onChange={(event) => update("role", event.target.value)} className="mt-1.5 w-full rounded-lg border border-cyan-200 px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100">{roles.map((role) => <option key={role}>{role}</option>)}</select></div><FormInput label="Manager ID" value={form.managerId} onChange={(value) => update("managerId", value)} placeholder="Optional" /><FormInput label="Date of joining" type="date" value={form.dateOfJoining} onChange={(value) => update("dateOfJoining", value)} /><FormInput label="Contact number" value={form.contactNumber} onChange={(value) => update("contactNumber", value)} placeholder="Optional" /></div>{error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}<footer className="mt-6 flex justify-end gap-3 border-t border-cyan-100 pt-5"><button type="button" onClick={close} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-cyan-50">Cancel</button><button disabled={isSubmitting} className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50">{isSubmitting ? "Registering..." : "Create employee"}</button></footer></form>}</div></div>}</>;
}

function FormInput({ label, value, onChange, type = "text", required = false, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) { return <div><label className="text-sm font-medium text-slate-700">{label}</label><input required={required} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-cyan-200 px-3 py-2.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" /></div>; }
function Credential({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{label}</dt><dd className="mt-1 break-all font-mono text-slate-950">{value}</dd></div>; }
