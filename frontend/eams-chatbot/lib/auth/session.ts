// src/lib/auth/session.ts
// Central place for reading/writing the auth session. Nothing else in the
// app should touch cookies or decode the JWT directly — go through here.

import { jwtDecode } from "jwt-decode";
import type { AuthUser, JwtPayload, Role } from "@/types/user";

const ACCESS_TOKEN_COOKIE = "hrms_access_token";

/**
 * Decodes the JWT and maps it to the AuthUser shape used across the app.
 * Returns null if the token is missing, malformed, or expired.
 */
export function decodeSession(token: string | undefined | null): AuthUser | null {
  if (!token) return null;

  try {
    const payload = jwtDecode<JwtPayload>(token);

    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) return null;

    return {
      userId: payload.sub,
      employeeId: payload.employeeId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      managerId: payload.managerId,
    };
  } catch {
    return null;
  }
}

export function hasRole(user: AuthUser | null, allowed: Role[]): boolean {
  if (!user) return false;
  return allowed.includes(user.role);
}

export const AUTH_COOKIE_NAME = ACCESS_TOKEN_COOKIE;