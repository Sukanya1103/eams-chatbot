import type { AttendanceResponse } from "@/types/attendance";
export function workedSeconds(record: AttendanceResponse, now?: number): number;
export function attendanceBarPercentage(seconds: number): number;
export function formatWorkedDuration(seconds: number): string;
