import { Employee } from "./employee";

export interface SummaryItemProps {
  title: string;
  count: number;
  change: number;
  changeText: string;
}

export interface AttendanceSummaryType {
  teamName: string;
  totalHours: number;
  expectedHours: number;
  averageHoursPerDay: number;
  attendanceRate: number;
}

export interface AttendanceDetail {
  id: number;
  employeeName: string;
  date: string;
  present: boolean;
}

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface AttendanceRecord {
  attendanceId: number;
  memberId: number;
  member: string;
  date: string;
  clockInTime: string;
  clockOutTime: string;
  project: string;
  description: string;
  status: Status;
}

export interface AttendanceDetailsModalProps {
  open: boolean;
  onClose: () => void;
  details: AttendanceDetail[];
}

export interface Team {
  teamId: number;
  name: string;
  manager: string;
  members: string[];
}

export interface AttendanceRecord {
  attendanceId: number;
  member: string;
  date: string;
  clockInTime: string;
  clockOutTime: string;
  project: string;
  status: Status;
}

export interface Project {
  projectId: number;
  name: string;
  managerName: string;
  managerId: number;
  members?: Employee[];
}
