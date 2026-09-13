// lib/api/salary.ts
// Client-side salary actions. Same BFF pattern as employees/leaves.

import type { GenerateSalaryRequest } from "@/types/salary";

export async function generateSalary(data: GenerateSalaryRequest): Promise<void> {
  const res = await fetch("/api/salary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Failed to generate payslip");
  }
}