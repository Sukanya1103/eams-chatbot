// app/api/attendance/check-in/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const backendRes = await fetch(`${BACKEND_URL}/api/attendance/check-in`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!backendRes.ok) {
    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(
      { message: data?.message ?? "Failed to check in" },
      { status: backendRes.status }
    );
  }

  return NextResponse.json({ success: true });
}