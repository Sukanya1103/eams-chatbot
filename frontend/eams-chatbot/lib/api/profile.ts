import type { MyProfile, UpdateMyProfileRequest } from "@/types/employee";

async function request<T>(method: "GET" | "PATCH", data?: UpdateMyProfileRequest): Promise<T> {
  const response = await fetch("/api/employees/me", {
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
    cache: "no-store",
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message ?? "Could not load your profile");
  return result as T;
}

export function getMyProfile() { return request<MyProfile>("GET"); }
export function updateMyProfile(data: UpdateMyProfileRequest) { return request<MyProfile>("PATCH", data); }
