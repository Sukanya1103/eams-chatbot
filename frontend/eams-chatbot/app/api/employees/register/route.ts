// app/api/employees/register/route.ts
// Reads the session cookie server-side and forwards the request to Spring
// Boot as a Bearer token — the backend's JwtAuthFilter + @PreAuthorize on
// EmployeeController is the real enforcement; this route is just the bridge.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  const backendRes = await fetch(`${BACKEND_URL}/api/employees/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => null);

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Registration failed" },
      { status: backendRes.status }
    );
  }

  return NextResponse.json(data);
}