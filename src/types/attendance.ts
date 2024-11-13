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

export interface AttendanceRecord {
  attendanceId: number;
  memberId: number;
  member: string;
  date: string;
  clockInTime: string;
  clockOutTime: string;
  project: string;
  description: string;
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

export interface TeamAttendanceDetail {
  attendanceId: number;
  member: string;
  date: string;
  clockInTime: string;
  clockOutTime: string;
  project: string;
}

export interface Project {
  projectId: number;
  name: string;
  managerName: string;
  managerId: number;
  members?: Employee[];
}
