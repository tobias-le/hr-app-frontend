import { create } from "zustand";
import { Team } from "../types/team";
import ApiService from "../services/api.service";

interface TeamState {
  teams: Team[];
  selectedTeam: Team | null;
  fetchTeams: () => Promise<void>;
  setSelectedTeam: (team: Team | null) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  teams: [],
  selectedTeam: null,
  fetchTeams: async () => {
    try {
      const data = await ApiService.getTeams();
      set((state) => ({
        teams: data as unknown as Team[],
        selectedTeam:
          state.selectedTeam ||
          (data.length > 0 ? (data[0] as unknown as Team) : null),
      }));
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  },
  setSelectedTeam: (team) => set({ selectedTeam: team }),
}));
