import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import type { WorkFromHomeRequest } from "@/types/workFromHome";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";
export async function getWorkFromHomeRequests(): Promise<WorkFromHomeRequest[]> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return [];
  const response = await fetch(`${BACKEND_URL}/api/work-from-home`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  if (!response.ok) return [];
  return response.json();
}
