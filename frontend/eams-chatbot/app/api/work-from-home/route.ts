import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";
async function getToken() { return (await cookies()).get(AUTH_COOKIE_NAME)?.value; }

export async function GET() {
  const token = await getToken();
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  const response = await fetch(`${BACKEND_URL}/api/work-from-home`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  return NextResponse.json(body ?? [], { status: response.status });
}

export async function POST(request: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ message: "Invalid request body" }, { status: 400 }); }
  const response = await fetch(`${BACKEND_URL}/api/work-from-home`, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const responseBody = await response.json().catch(() => ({ message: "Unable to read backend response" }));
  return NextResponse.json(responseBody, { status: response.status });
}
