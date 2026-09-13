// types/salary.ts

export interface SalaryResponse {
  salaryId: string;
  employeeId: string;
  employeeName: string;
  month: number; // 1-12
  year: number;
  basic: number;
  allowances: number;
  deductions: number;
  netPay: number;
}

export interface GenerateSalaryRequest {
  employeeId: string;
  month: number;
  year: number;
  basic: number;
  allowances: number;
  deductions: number;
}