// lib/auth/getCurrentUser.ts
// Server-only helper for dashboard pages (they're React Server Components).
// The (dashboard)/layout.tsx already guarantees a logged-in user reaches
// here, so pages can call this without re-checking for null in most cases —
// but it's typed as nullable so TypeScript still keeps you honest.

import "server-only";
import { cookies } from "next/headers";
import { decodeSession, AUTH_COOKIE_NAME } from "./session";
import type { AuthUser } from "@/types/user";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return decodeSession(token);
}