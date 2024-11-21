import { Employee } from "../types/employee";
import { VALIDATION_RULES } from "../constants/validationRules";

export const validateEmployee = (
  employee: Partial<Employee>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Email validation
  if (!VALIDATION_RULES.email.test(employee.email || "")) {
    errors.email = "Please enter a valid email address";
  }

  // Phone validation
  if (!VALIDATION_RULES.phone.test(employee.phoneNumber || "")) {
    errors.phoneNumber = "Please enter a valid 9-digit phone number";
  }

  // Required fields validation
  const requiredFields = ["name", "jobTitle", "email", "phoneNumber"];
  requiredFields.forEach((field) => {
    if (!employee[field as keyof Employee]) {
      errors[field] = "This field is required";
    }
  });

  // Numeric fields validation
  const numericFields = [
    "annualSalary",
    "annualLearningBudget",
    "annualBusinessPerformanceBonusMax",
    "annualPersonalPerformanceBonusMax",
  ];
  numericFields.forEach((field) => {
    const value = employee[field as keyof Employee];
    if (typeof value !== "number" || value < 0) {
      errors[field] = "Please enter a valid amount";
    }
  });

  return errors;
};
