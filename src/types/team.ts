import { Employee } from "./employee";
export interface Team {
  teamId: number;
  name: string;
  managerName?: string;
  managerId?: number;
  managerJobTitle?: string;
  members: Employee[];
  parentTeam?: Team;
}

export interface TeamNameWithId {
  teamId: number;
  name: string;
}
