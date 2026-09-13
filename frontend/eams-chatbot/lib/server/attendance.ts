// lib/server/attendance.ts
// Same principle as leaves/salary: one endpoint, scoped by the backend
// based on the caller's role/employeeId in the JWT.

import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import type { AttendanceResponse } from "@/types/attendance";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function getAttendance(): Promise<AttendanceResponse[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return [];

  const res = await fetch(`${BACKEND_URL}/api/attendance`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}