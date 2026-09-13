// app/api/leaves/[id]/approve/route.ts
// The [id] folder is Next.js's dynamic route segment syntax — this file
// handles POST /api/leaves/ANY_ID_HERE/approve, and "ANY_ID_HERE" is
// captured as params.id below.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const backendRes = await fetch(`${BACKEND_URL}/api/leaves/${id}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!backendRes.ok) {
    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(
      { message: data?.message ?? "Failed to approve leave" },
      { status: backendRes.status }
    );
  }

  return NextResponse.json({ success: true });
}