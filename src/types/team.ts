import { Employee } from "./employee";

export interface Team {
  teamId: number;
  name: string;
  managerId: number;
  managerName?: string;
  members?: Employee[];
}
