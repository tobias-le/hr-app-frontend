import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@mui/material";
import ApiService from "../services/api.service";
import { Team } from "../types/team";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { PageLayout } from "../components/common/PageLayout";
import { DataTable } from "../components/common/DataTable";
import { BaseModal } from "../components/common/BaseModal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { handleApiError } from "../utils/errorUtils";
import { useForm } from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { TeamForm, TeamFormData } from "../components/TeamForm";

const TeamManagement: React.FC = () => {
  const { formData, setFormData, isSubmitting, setIsSubmitting } =
    useForm<TeamFormData>({
      name: "",
      managerId: null,
      managerName: "",
      members: [],
      employees: [],
    });

  const [teams, setTeams] = useState<Team[]>([]);
  const { showMessage } = useSnackbarStore();
  const [teamsLoading, setTeamsLoading] = useState(true);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchTeams = useCallback(async () => {
    setTeamsLoading(true);
    try {
      const response = await ApiService.getAllTeams();
      setTeams(response);
    } catch (error) {
      handleApiError(error, "Failed to fetch teams");
    } finally {
      setTeamsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleOpenDialog = async (team?: Team) => {
    setOpenDialog(true);
    if (team) {
      setIsEditing(true);
      setFormData({
        name: team.name,
        managerId: team.managerId ?? null,
        managerName: team.managerName || "",
        members: team.members || [],
        employees: [],
      });
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        managerId: null,
        managerName: "",
        members: [],
        employees: [],
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: "",
      managerId: null,
      managerName: "",
      members: [],
      employees: [],
    });
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!formData.managerId) {
        showMessage("Please select a manager");
        return;
      }

      const apiTeamData = {
        ...formData,
        managerId: formData.managerId || undefined,
      };

      await ApiService.createTeam(apiTeamData);
      showMessage("Team created successfully");
      fetchTeams();
      handleCloseDialog();
    } catch (error) {
      showMessage("Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (teamId: number) => {
    navigate(`/teams/${teamId}`);
  };

  const columns = [
    { header: "Team Name", accessor: "name" as keyof Team },
    { header: "Manager", accessor: "managerName" as keyof Team },
  ];

  return (
    <PageLayout title="Team Management">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
          data-testid="add-team-button"
        >
          Add Team
        </Button>
      </div>

      {teamsLoading ? (
        <LoadingSpinner testId="teams-loading" />
      ) : (
        <DataTable
          data={teams}
          columns={columns}
          onRowClick={(team: Team) => handleRowClick(team.teamId)}
          testId="teams-table"
        />
      )}

      <BaseModal
        open={openDialog}
        onClose={handleCloseDialog}
        title={isEditing ? "Edit Team" : "Create Team"}
        maxWidth="md"
        actions={
          <>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : isEditing ? "Save" : "Create"}
            </Button>
          </>
        }
      >
        <TeamForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCloseDialog}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
        />
      </BaseModal>
    </PageLayout>
  );
};

export default TeamManagement;
