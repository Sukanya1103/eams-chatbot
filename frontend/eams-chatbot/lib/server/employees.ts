// lib/server/employees.ts
// Server-only data fetching for pages (React Server Components). Unlike
// lib/api/employees.ts (used by CLIENT components via relative fetch to our
// own BFF routes), this calls Spring Boot directly — a Server Component
// already runs on the server, so there's no browser/cookie boundary to
// bridge here, just attach the token and call the backend.

import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import type { EmployeeSummary } from "@/types/employee";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function getEmployees(): Promise<EmployeeSummary[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return [];

  const res = await fetch(`${BACKEND_URL}/api/employees`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}