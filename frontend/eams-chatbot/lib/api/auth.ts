// lib/api/auth.ts
// Frontend-facing auth functions. These call OUR Next.js API routes
// (app/api/auth/...), not Spring Boot directly — the route sets the
// httpOnly cookie that middleware.ts and the backend both rely on.

import type { LoginRequest, LoginResponse } from "@/types/user";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}