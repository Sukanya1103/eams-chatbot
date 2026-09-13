// types/leave.ts

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export type LeaveType = "SICK" | "CASUAL" | "EARNED" | "UNPAID" | "OTHER";

export interface LeaveResponse {
  leaveId: string;
  employeeId: string;
  employeeName: string; // denormalized by the backend so tables don't need a join
  type: LeaveType;
  startDate: string; // ISO date
  endDate: string; // ISO date
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
}

export interface ApplyLeaveRequest {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}