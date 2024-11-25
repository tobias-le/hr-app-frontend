export interface Employee {
  id: number;
  name: string;
  jobTitle?: string;
  employmentStatus?: string;
  email?: string;
  phoneNumber?: string;
  currentProjects?: string[];
  annualSalary?: number;
  annualLearningBudget?: number;
  annualBusinessPerformanceBonusMax?: number;
  annualPersonalPerformanceBonusMax?: number;
  hr: boolean;
}

export interface EmployeeNameWithId {
  id: number;
  name: string;
}
