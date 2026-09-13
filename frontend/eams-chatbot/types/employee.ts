// types/employee.ts
// Mirrors the backend's RegisterEmployeeRequest / EmployeeResponse DTOs —
// keep these in sync any time the backend DTOs change.

import type { Role } from "./user";

export interface RegisterEmployeeRequest {
  name: string;
  email: string;
  role: Role;
  designation: string;
  department: string;
  managerId?: string;
  dateOfJoining?: string; // ISO date string, e.g. "2026-09-13"
  contactNumber?: string;
}

export interface EmployeeResponse {
  employeeId: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  designation: string;
  department: string;
  managerId?: string;
  dateOfJoining?: string;
  temporaryPassword: string; // only ever present on the registration response
}

// Shape for GET /api/employees (list) — same core fields, no temp password.
export interface EmployeeSummary {
  employeeId: string;
  name: string;
  email: string;
  role: Role;
  designation: string;
  department: string;
  managerId?: string;
  dateOfJoining?: string;
}