import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Team } from "../types/team";
import ApiService from "../services/api.service";
import { PageLayout } from "../components/common/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { handleApiError } from "../utils/errorUtils";
import { BaseModal } from "../components/common/BaseModal";
import { Employee } from "../types/employee";
import { TeamForm } from "../components/TeamForm";

const TeamDetails: React.FC = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useSnackbarStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const details = await ApiService.getTeamDetails(Number(teamId));
        setTeam(details);
      } catch (error) {
        handleApiError(error, "Failed to fetch team details");
        navigate("/teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamId, navigate]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (
      !team ||
      !window.confirm("Are you sure you want to delete this team?")
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await ApiService.deleteTeam(team.teamId);
      showMessage("Team deleted successfully");
      navigate("/teams");
    } catch (error) {
      handleApiError(error, "Failed to delete team");
      setIsDeleting(false);
    }
  };

  const handleUpdateTeam = async (updatedData: Partial<Team>) => {
    if (!team) return;

    try {
      const updatedTeam = await ApiService.updateTeam(team.teamId, {
        ...team,
        ...updatedData,
        managerId: updatedData.managerId,
        members: updatedData.members,
      });
      setTeam(updatedTeam);
      setIsEditModalOpen(false);
      showMessage("Team updated successfully");
    } catch (error) {
      handleApiError(error, "Failed to update team");
    }
  };

  const renderParentTeamHierarchy = (team: Team, level: number = 0) => {
    return (
      <div
        style={{
          marginLeft: `${level * 24}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50vw",
          maxWidth: "50vw",
          marginBottom: "16px",
          margin: "0 auto",
        }}
      >
        {team.parentTeam && (
          <div className="mb-4 w-full">
            {renderParentTeamHierarchy(team.parentTeam, level + 1)}
          </div>
        )}
        <TableContainer
          sx={{
            width: "100%",
            backgroundColor: "background.paper",
            "& .MuiTableCell-root": {
              borderBottom: "none",
            },
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  width="50%"
                  sx={{
                    backgroundColor: "secondary.main",
                    "& .MuiTypography-root": {
                      color: "primary.main",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    },
                  }}
                >
                  <Typography variant="subtitle1">Team Name</Typography>
                </TableCell>
                <TableCell
                  width="50%"
                  sx={{
                    backgroundColor: "secondary.main",
                    "& .MuiTypography-root": {
                      color: "primary.main",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    },
                  }}
                >
                  <Typography variant="subtitle1">Team Lead</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                hover
                onClick={() => navigate(`/teams/${team.teamId}`)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: "background.paper",
                  "&:hover": {
                    backgroundColor: "grey.50",
                  },
                  "& .MuiTableCell-root": {
                    borderLeft: 4,
                    borderLeftStyle: "solid",
                    borderLeftColor: "primary.main",
                    py: 2,
                  },
                }}
              >
                <TableCell width="50%">
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.1rem", fontWeight: 500 }}
                  >
                    {level > 0 && "↑ "}
                    {team.name}
                  </Typography>
                </TableCell>
                <TableCell width="50%">
                  <div>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "1.1rem", fontWeight: 500 }}
                    >
                      {team.managerName || "No Team Lead"}
                    </Typography>
                    {team.managerName && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.875rem",
                          mt: 0.5,
                        }}
                      >
                        {team.managerJobTitle || "Team Lead"}
                      </Typography>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <PageLayout title={team?.name || "Team Details"}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outlined"
          onClick={() => navigate("/teams")}
          data-testid="back-button"
        >
          Back to Teams
        </Button>
        <div className="space-x-2">
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdit}
            data-testid="edit-button"
          >
            Edit Team
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            data-testid="delete-button"
          >
            {isDeleting ? "Processing..." : "Delete Team"}
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner testId="details-loading" />
      ) : (
        team && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="subtitle2" color="textSecondary">
                  Team Lead
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    mt: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {team.managerName || "No Team Lead Assigned"}
                </Typography>
              </div>
            </div>

            <div>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                className="mb-2"
              >
                Team Members
              </Typography>
              {team.members && team.members.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Job Title</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {team.members.map((member: Employee) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.jobTitle}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phoneNumber}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">
                  No team members assigned yet
                </Typography>
              )}
            </div>

            {team.parentTeam && (
              <div>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  className="mb-2"
                >
                  Reporting Structure
                </Typography>
                {renderParentTeamHierarchy(team.parentTeam, 0)}
              </div>
            )}
          </div>
        )
      )}

      {isDeleting && <LoadingSpinner testId="delete-loading" />}

      <BaseModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Team"
        maxWidth="md"
      >
        {team && (
          <div>
            <TeamForm
              formData={{
                name: team.name,
                managerId: team.managerId || null,
                managerName: team.managerName || "",
                members: team.members || [],
                employees: team.members || [],
              }}
              setFormData={() => {
                handleUpdateTeam({
                  name: team.name,
                  managerId: team.managerId ?? undefined,
                  members: team.members,
                });
              }}
              onSubmit={async () => {
                setIsEditModalOpen(false);
              }}
              onCancel={() => setIsEditModalOpen(false)}
              isSubmitting={isDeleting}
              isEditing={true}
            />
          </div>
        )}
      </BaseModal>
    </PageLayout>
  );
};

export default TeamDetails;
