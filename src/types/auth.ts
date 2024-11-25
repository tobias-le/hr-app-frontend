import { Employee } from "./employee";

export interface AuthResponse {
  token: string;
  employee: Employee;
}
