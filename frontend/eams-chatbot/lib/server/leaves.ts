// lib/server/leaves.ts
// Server-only fetch for leave lists. The SAME backend endpoint is called
// for every role — the backend's DataScopeService decides what comes back
// based on the JWT's role/employeeId, never a query param the client sets.
// That's the whole point: HR/Admin, Manager, and Employee all hit
// GET /api/leaves, and each just gets back whatever they're allowed to see.

import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import type { LeaveResponse } from "@/types/leave";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function getLeaves(): Promise<LeaveResponse[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return [];

  const res = await fetch(`${BACKEND_URL}/api/leaves`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}