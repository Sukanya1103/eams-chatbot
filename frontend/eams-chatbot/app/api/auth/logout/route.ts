// app/api/auth/logout/route.ts
// Clears the auth cookie. A client component can't delete an httpOnly
// cookie itself, so this tiny server route exists just for that.

import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}