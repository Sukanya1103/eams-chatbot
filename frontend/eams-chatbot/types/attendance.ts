// types/attendance.ts

export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY" | "WFH";

export interface AttendanceResponse {
  attendanceId: string;
  employeeId: string;
  employeeName: string;
  date: string; // ISO date
  checkIn?: string; // ISO datetime
  checkOut?: string; // ISO datetime
  status: AttendanceStatus;
  sessions?: AttendanceSessionResponse[];
  totalWorkedSeconds?: number;
  state?: "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT";
}

export interface AttendanceSessionResponse {
  sessionId: string;
  checkIn: string;
  checkOut?: string;
}

export type AttendanceCorrectionStatus = "PENDING" | "APPROVED" | "REJECTED";
export interface AttendanceCorrectionResponse {
  id: string;
  employeeId: string;
  employeeName: string;
  attendanceDate: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  remarks?: string;
  agendas: string[];
  referenceLinks: string[];
  status: AttendanceCorrectionStatus;
  submittedAt: string;
  reviewerComments?: string;
}
export interface AttendanceCorrectionRequest {
  attendanceDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  reason: string;
  remarks?: string;
  agendas: string[];
  referenceLinks: string[];
}
