import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

async function forward(request: NextRequest, method: "GET" | "PATCH") {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const body = method === "PATCH" ? await request.json() : undefined;
  const headers: Record<string, string> = body
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { Authorization: `Bearer ${token}` };
  const response = await fetch(`${BACKEND_URL}/api/employees/me`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) return NextResponse.json({ message: data?.message ?? "Profile request failed" }, { status: response.status });
  return NextResponse.json(data);
}

export async function GET(request: NextRequest) { return forward(request, "GET"); }
export async function PATCH(request: NextRequest) { return forward(request, "PATCH"); }
