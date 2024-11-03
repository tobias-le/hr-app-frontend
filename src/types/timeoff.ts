export interface TimeOffRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: "VACATION" | "SICK" | "PERSONAL";
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string;
}

export interface TimeOffSummary {
  vacationDaysLeft: number;
  sickDaysLeft: number;
  personalDaysLeft: number;
  pendingRequests: number;
}
