// app/(dashboard)/hr/register-employee/page.tsx
// HR's employee registration form. No password field — see
// lib/api/employees.ts / EmployeeResponse: the backend generates a
// temporary password and returns it once, shown here so HR can share it.

"use client";

import { useState, type FormEvent } from "react";
import { registerEmployee } from "@/lib/api/employees";
import type { Role } from "@/types/user";
import type { EmployeeResponse } from "@/types/employee";

// ADMIN intentionally excluded — HR shouldn't be creating other admins
// from this form. Restrict that to a separate, more guarded flow later.
const ROLE_OPTIONS: Role[] = ["EMPLOYEE", "MANAGER", "HR"];

export default function RegisterEmployeePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("EMPLOYEE");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [managerId, setManagerId] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmployeeResponse | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await registerEmployee({
        name,
        email,
        role,
        designation,
        department,
        managerId: managerId || undefined,
        dateOfJoining: dateOfJoining || undefined,
        contactNumber: contactNumber || undefined,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setResult(null);
    setName("");
    setEmail("");
    setRole("EMPLOYEE");
    setDesignation("");
    setDepartment("");
    setManagerId("");
    setDateOfJoining("");
    setContactNumber("");
  }

  if (result) {
    return (
      <div className="max-w-lg">
        <h1 className="text-xl font-semibold text-slate-900">Employee registered</h1>
        <p className="mt-1 text-sm text-slate-500">
          Share these credentials with {result.name} so they can sign in. This
          password won&apos;t be shown again.
        </p>

        <div className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <Field label="Name" value={result.name} />
          <Field label="Email" value={result.email} />
          <Field label="Temporary password" value={result.temporaryPassword} mono />
          <Field label="Role" value={result.role} />
        </div>

        <button
          onClick={resetForm}
          className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Register another employee
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-slate-900">Register employee</h1>
      <p className="mt-1 text-sm text-slate-500">
        A temporary password is generated automatically — you&apos;ll see it
        once, after submitting.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input label="Full name" value={name} onChange={setName} required />
        <Input
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <Input label="Designation" value={designation} onChange={setDesignation} required />
        <Input label="Department" value={department} onChange={setDepartment} required />
        <Input
          label="Manager ID"
          value={managerId}
          onChange={setManagerId}
          placeholder="Optional — leave blank if none"
        />
        <Input
          label="Date of joining"
          type="date"
          value={dateOfJoining}
          onChange={setDateOfJoining}
        />
        <Input
          label="Contact number"
          value={contactNumber}
          onChange={setContactNumber}
          placeholder="Optional"
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? "Registering…" : "Register employee"}
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
      />
    </div>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium text-slate-900 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
