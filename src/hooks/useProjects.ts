import { useState, useEffect } from "react";
import { ProjectNameWithId } from "../types/project";
import ApiService from "../services/api.service";
import { useSnackbarStore } from "../components/GlobalSnackbar";

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectNameWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useSnackbarStore();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getProjects();
        setProjects(response);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        showMessage("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [showMessage]);

  return { projects, loading };
};
