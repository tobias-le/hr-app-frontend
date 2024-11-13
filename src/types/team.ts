import { Employee } from "./employee";

export interface TeamHierarchy {
  parentTeam?: TeamReference;
  subTeams?: TeamReference[];
}

export interface TeamReference {
  teamId: number;
  name: string;
}

export interface Team {
  teamId: number;
  name: string;
  managerId: number;
  managerName?: string;
  members?: Employee[];
  hierarchy?: TeamHierarchy;
}
