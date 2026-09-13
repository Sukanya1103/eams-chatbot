// lib/server/salary.ts
// Same principle as lib/server/leaves.ts: one endpoint, scoped by the
// backend based on the caller's role — HR/Admin see everyone, Employee
// sees only their own payslips. No role/scope param sent from the client.

import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import type { SalaryResponse } from "@/types/salary";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function getSalaries(): Promise<SalaryResponse[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return [];

  const res = await fetch(`${BACKEND_URL}/api/salary`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}