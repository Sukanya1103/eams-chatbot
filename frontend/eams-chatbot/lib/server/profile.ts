import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import type { MyProfile } from "@/types/employee";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function getMyProfile(): Promise<MyProfile | null> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const response = await fetch(`${BACKEND_URL}/api/employees/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
