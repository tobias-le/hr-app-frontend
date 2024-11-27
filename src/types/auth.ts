import { Employee } from "./employee";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  employee: Employee;
}
