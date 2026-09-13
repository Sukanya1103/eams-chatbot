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
}