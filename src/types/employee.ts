import exp from "constants";

export interface Employee {
  id: number;
  name: string;
  jobTitle?: string;
  employmentStatus?: string;
  email?: string;
  phoneNumber?: string;
  currentProjects?: string[];
}

export interface EmployeeNameWithId {
  id: number;
  name: string;
}
