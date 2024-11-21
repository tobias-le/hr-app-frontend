import { useState, useEffect } from "react";
import { TeamNameWithId } from "../types/team";
import ApiService from "../services/api.service";
import { useSnackbarStore } from "../components/GlobalSnackbar";

export const useTeams = () => {
  const [teams, setTeams] = useState<TeamNameWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useSnackbarStore();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getTeams();
        setTeams(response);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        showMessage("Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [showMessage]);

  return { teams, loading };
};
