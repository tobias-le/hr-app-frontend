export interface TimeOffRequest {
  id: number;
  employeeName: string; //later employee entity
  startDate: string;
  endDate: string;
  type: RequestType
  status: RequestStatus
  reason: string;
}

export enum RequestType {
  Vacation = "Vacation",
  Sick = "Sickness",
  Personal = "Personal"
}

export enum RequestStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED"
}

export interface TimeOffSummary {
  vacationDaysLeft: number;
  sickDaysLeft: number;
  personalDaysLeft: number;
  pendingRequests: number;
}
