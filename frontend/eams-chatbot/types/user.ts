// src/types/user.ts
// Shared across the whole frontend — every auth/role check imports from here.

export type Role = "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";

export interface AuthUser {
  userId: string;
  employeeId: string;
  name: string;
  email: string;
  role: Role;
  managerId?: string; // present for MANAGER/EMPLOYEE, used for scoping
}

// Shape of the decoded JWT payload returned by Spring Boot.
export interface JwtPayload {
  sub: string; // userId
  employeeId: string;
  name: string;
  email: string;
  role: Role;
  managerId?: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// Maps each role to the dashboard route it should land on after login.
export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  HR: "/hr",
  MANAGER: "/manager",
  EMPLOYEE: "/employee",
};