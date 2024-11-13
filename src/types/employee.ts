export interface Employee {
  id: number;
  name: string;
  jobTitle?: string;
  employmentStatus?: string;
  email?: string;
  phoneNumber?: string;
  currentProjects?: string[];
  managedProjects?: number[];
}

export interface EmployeeNameWithId {
  id: number;
  name: string;
}
