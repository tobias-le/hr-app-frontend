import { Employee } from "./employee";

export interface Project {
  projectId: number;
  name: string;
  managerName: string;
  managerId: number;
  members?: Employee[];
}

export interface ProjectNameWithId {
  projectId: number;
  name: string;
}
