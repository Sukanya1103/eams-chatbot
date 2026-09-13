// app/api/auth/login/route.ts
// The only place in the frontend that talks to Spring Boot's /auth/login.
// Runs on the server, so it can set an httpOnly cookie the browser JS
// can never read or tamper with — that's the whole point of this route.

import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  const credentials = await request.json();

  const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!backendRes.ok) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const data = await backendRes.json(); // { accessToken, refreshToken, user }

  const response = NextResponse.json(data);

  response.cookies.set(AUTH_COOKIE_NAME, data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours — match your backend's access token expiry
  });

  // Refresh token, if you use one, should also be set httpOnly here
  // with a longer maxAge and a narrower path (e.g. "/api/auth/refresh").

  return response;
}
