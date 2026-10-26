export type WorkFromHomeStatus = "PENDING" | "APPROVED" | "REJECTED";
export interface WorkFromHomeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  remarks?: string;
  status: WorkFromHomeStatus;
  submittedAt: string;
  reviewerComments?: string;
}
export interface ApplyWorkFromHomeRequest {
  startDate: string;
  endDate: string;
  reason: string;
  remarks?: string;
}
