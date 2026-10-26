export type CompensationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type CompensationDayType = "WEEKLY_OFF" | "REGULAR_WORKDAY";

export interface CompensationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  workDate: string;
  dayType: CompensationDayType;
  verifiedCheckIn: string;
  verifiedCheckOut: string;
  verifiedWorkedMinutes: number;
  compensationType: string;
  reason: string;
  status: CompensationStatus;
  reviewedBy?: string;
  reviewerComments?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface CompensationOptions {
  available: boolean;
  supportedTypes: string[];
  message?: string;
}

export interface SubmitCompensationRequest {
  workDate: string;
  compensationType: string;
  reason: string;
}
