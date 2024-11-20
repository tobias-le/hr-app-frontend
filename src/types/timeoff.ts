import {Employee, EmployeeNameWithId} from "./employee";

export interface Leave {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  leaveType: LeaveType
  status: LeaveStatus
  reason: string;
  leaveAmount:number;
}

export enum LeaveType {
  Vacation = "VACATION_LEAVE",
  Sick = "SICK_LEAVE",
  Personal = "PERSONAL_LEAVE"
}

export enum LeaveStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED"
}

export interface EmployeeLeaveBalance {
  id: number;
  employeeId: Employee | null;
  vacationDaysLeft: number;
  sickDaysLeft: number;
  personalDaysLeft: number;
}

export interface LeaveDto {
  employeeId: number;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  leaveStatus: LeaveStatus;
  leaveAmount: number;
  reason: string;
}

export interface PendingRequest {
  id: number;
  employee: EmployeeNameWithId;
  leaveType?: LeaveType;
  startDate?: string;
  endDate?: string;
  datetime: string;
  leaveAmount?: number;
  currentDaysLeft?: number;
  message: string;
}