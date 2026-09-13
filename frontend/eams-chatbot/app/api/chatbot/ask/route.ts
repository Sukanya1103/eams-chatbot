// app/api/chatbot/ask/route.ts
// Forwards to Spring Boot's ChatbotController (not built yet — this is the
// frontend half). The backend is where the real work happens: resolving
// the caller's role from the JWT, fetching only the data DataScopeService
// says they're allowed to see, then calling the LLM with that scoped
// context. This route never sees or decides any of that — it just relays.

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

  const backendRes = await fetch(`${BACKEND_URL}/api/chatbot/ask`, {
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
      { message: data?.message ?? "The assistant is unavailable right now." },
      { status: backendRes.status }
    );
  }

  return NextResponse.json(data);
}