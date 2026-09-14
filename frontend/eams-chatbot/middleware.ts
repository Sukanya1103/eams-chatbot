// src/middleware.ts
// Runs on every matching request, before any page renders. This is the
// frontend's first line of defense — the backend still re-checks role on
// every API call, so this exists purely for UX (fast redirects), not security.

import { NextRequest, NextResponse } from "next/server";
import { decodeSession, AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { ROLE_HOME, type Role } from "@/types/user";

// Which role(s) may access each route prefix.
const ROUTE_ACCESS: Record<string, Role[]> = {
  "/admin": ["ADMIN"],
  "/hr": ["HR", "ADMIN"],
  "/manager": ["MANAGER", "ADMIN"],
  // HR and managers can switch to their personal employee workspace.
  "/employee": ["EMPLOYEE", "HR", "MANAGER", "ADMIN"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = decodeSession(token);

  const isLoginPage = pathname.startsWith("/login");

  // Not logged in and trying to reach a protected page → send to login.
  if (!user && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in and sitting on the login page → send to their dashboard.
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL(ROLE_HOME[user.role], request.url));
  }

  // Logged in but hitting a route their role doesn't own → send to their own dashboard.
  if (user) {
    const matchedPrefix = Object.keys(ROUTE_ACCESS).find((prefix) =>
      pathname.startsWith(prefix)
    );

    if (matchedPrefix && !ROUTE_ACCESS[matchedPrefix].includes(user.role)) {
      return NextResponse.redirect(new URL(ROLE_HOME[user.role], request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/hr/:path*", "/manager/:path*", "/employee/:path*", "/login"],
};
