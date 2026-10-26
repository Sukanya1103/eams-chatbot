import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function forwardCompensation(path: string, method = "GET", body?: unknown) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  if (body !== undefined) headers.set("Content-Type", "application/json");
  try {
    const response = await fetch(`${BACKEND_URL}/api/compensation${path}`, {
      method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }), cache: "no-store",
    });
    const text = await response.text();
    let data: unknown;
    try { data = text ? JSON.parse(text) : null; }
    catch { data = null; }
    if (!response.ok) {
      const message = typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
        ? data.message : "Compensation service could not process the request";
      return NextResponse.json({ message }, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Compensation service is unavailable. Please try again." }, { status: 502 });
  }
}

export async function readJsonBody(request: Request): Promise<{ body?: unknown; error?: NextResponse }> {
  try { return { body: await request.json() }; }
  catch { return { error: NextResponse.json({ message: "Invalid request body" }, { status: 400 }) }; }
}
