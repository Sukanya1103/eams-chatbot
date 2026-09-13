// lib/api/employees.ts
// Calls our own BFF route (app/api/employees/register), which attaches the
// JWT as an Authorization header before forwarding to Spring Boot — same
// pattern as lib/api/auth.ts.

import type {
  RegisterEmployeeRequest,
  EmployeeResponse,
  EmployeeSummary,
} from "@/types/employee";

export async function registerEmployee(
  data: RegisterEmployeeRequest
): Promise<EmployeeResponse> {
  const res = await fetch("/api/employees/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to register employee");
  }

  return res.json();
}

export async function listEmployees(): Promise<EmployeeSummary[]> {
  const res = await fetch("/api/employees", { method: "GET" });

  if (!res.ok) {
    throw new Error("Failed to load employees");
  }

  return res.json();
}