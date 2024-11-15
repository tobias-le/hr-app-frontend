import { useProjectStore } from "../store/projectStore";
import { Project } from "../types/project";
import ApiService from "../services/api.service";
import { useCallback } from "react";

export const useProjectSelection = () => {
  const { projects, selectedProject, setSelectedProject, fetchProjects } =
    useProjectStore();

  const handleProjectChange = useCallback(
    (projectId: string | number) => {
      const project = projects.find(
        (p) => p.projectId.toString() === projectId.toString()
      );
      setSelectedProject(project || null);
      return project;
    },
    [projects, setSelectedProject]
  );

  const handleProjectSelect = useCallback(async (project?: Project) => {
    if (project) {
      try {
        const projectDetails = await ApiService.getProjectDetails(
          project.projectId
        );
        return projectDetails;
      } catch (error) {
        console.error("Error fetching project details:", error);
        return null;
      }
    }
    return null;
  }, []);

  return {
    projects,
    selectedProject,
    handleProjectChange,
    handleProjectSelect,
    fetchProjects,
  };
};
