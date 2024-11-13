import { create } from "zustand";
import { Project } from "../types/project";
import ApiService from "../services/api.service";

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  fetchProjects: () => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  fetchProjects: async () => {
    try {
      const data = await ApiService.getProjects();
      set((state) => ({
        projects: data,
        selectedProject:
          state.selectedProject || (data.length > 0 ? data[0] : null),
      }));
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  },
  setSelectedProject: (project) => set({ selectedProject: project }),
}));
