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
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Status } from "../types/attendance";
import { Project } from "../types/project";
import ApiService from "../services/api.service";
import { PageLayout } from "../components/common/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { handleApiError } from "../utils/errorUtils";
import { BaseModal } from "../components/common/BaseModal";
import { ProjectForm } from "../components/ProjectForm";
import { DataTable } from "../components/common/DataTable";
import { AttendanceRecord } from "../types/attendance";
import { StatusBadge } from "../components/common/StatusBadge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Employee } from "../types/employee";
import { useEmployeeStore } from "../store/employeeStore";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useSnackbarStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const currentEmployee = useEmployeeStore((state) => state.currentEmployee);

  const isHr = currentEmployee?.hr || false;
  const isManager = project?.managerId === currentEmployee?.id;

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const details = await ApiService.getProjectDetails(Number(projectId));
        setProject(details);
      } catch (error) {
        handleApiError(error, "Failed to fetch project details");
        navigate("/project-management");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (activeTab === 1 && project) {
        setLoadingAttendance(true);
        try {
          const data = await ApiService.getProjectAttendanceDetails(
            project.projectId
          );
          console.log("Attendance Data:", data);
          setAttendanceData(data);
        } catch (error) {
          handleApiError(error, "Failed to fetch attendance details");
        } finally {
          setLoadingAttendance(false);
        }
      }
    };

    fetchAttendance();
  }, [activeTab, project]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (
      !project ||
      !window.confirm("Are you sure you want to delete this project?")
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await ApiService.deleteProject(project.projectId);
      showMessage("Project deleted successfully");
      navigate("/project-management");
    } catch (error) {
      handleApiError(error, "Failed to delete project");
      setIsDeleting(false);
    }
  };

  const handleUpdateProject = async (updatedData: Partial<Project>) => {
    if (!project) return;

    try {
      const updatedProject = await ApiService.updateProject(project.projectId, {
        ...project,
        ...updatedData,
      });
      setProject(updatedProject);
      setIsEditModalOpen(false);
      showMessage("Project updated successfully");
    } catch (error) {
      handleApiError(error, "Failed to update project");
    }
  };

  const handleStatusUpdate = async (
    attendanceId: number,
    newStatus: Status
  ) => {
    try {
      const existingRecord = attendanceData.find(
        (record) => record.attendanceId === attendanceId
      );
      if (!existingRecord) return;

      const updatedRecord = await ApiService.updateAttendanceRecord(
        attendanceId,
        {
          ...existingRecord,
          status: newStatus,
        }
      );
      console.log("Updating with:", existingRecord);

      // Update the local state with the new record
      setAttendanceData((prev) =>
        prev.map((record) =>
          record.attendanceId === attendanceId ? updatedRecord : record
        )
      );

      showMessage(`Attendance ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      handleApiError(error, `Failed to ${newStatus.toLowerCase()} attendance`);
    }
  };

  return (
    <PageLayout title={project?.name || "Project Details"}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outlined"
          onClick={() => navigate("/project-management")}
          data-testid="back-button"
        >
          Back to Projects
        </Button>
        {isHr && (
          <div className="space-x-2">
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
              data-testid="edit-button"
            >
              Edit Project
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
              data-testid="delete-button"
            >
              {isDeleting ? "Processing..." : "Delete Project"}
            </Button>
          </div>
        )}
      </div>

      {(isHr || isManager) && (
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          className="mb-4"
        >
          <Tab label="Project Details" />
          <Tab label="Attendance History" />
        </Tabs>
      )}

      {loading ? (
        <LoadingSpinner testId="details-loading" />
      ) : (
        project && (
          <>
            {activeTab === 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Project Manager
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
                      {project.managerName}
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
                  {project.members ? (
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
                          {project.members.map((member: Employee) => (
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
              </div>
            ) : (
              <div className="space-y-4">
                <DataTable
                  data={attendanceData}
                  loading={loadingAttendance}
                  testId="attendance-table"
                  columns={[
                    {
                      header: "Date",
                      accessor: (item) =>
                        new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }),
                    },
                    {
                      header: "Employee",
                      accessor: "member",
                    },
                    {
                      header: "Time In",
                      accessor: (item) => item.clockInTime || "—",
                    },
                    {
                      header: "Time Out",
                      accessor: (item) => item.clockOutTime || "—",
                    },
                    {
                      header: "Status",
                      accessor: (item) => (
                        <div className="flex items-center gap-2">
                          <StatusBadge
                            status={item.status}
                            className="min-w-[90px] text-center"
                          />
                          {item.status === Status.PENDING && isManager && (
                            <div className="flex gap-1">
                              <Tooltip title="Approve">
                                <IconButton
                                  size="medium"
                                  color="success"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      item.attendanceId,
                                      Status.APPROVED
                                    )
                                  }
                                >
                                  <CheckCircleIcon
                                    sx={{ fontSize: "1.5rem" }}
                                  />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="medium"
                                  color="error"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      item.attendanceId,
                                      Status.REJECTED
                                    )
                                  }
                                >
                                  <CancelIcon sx={{ fontSize: "1.5rem" }} />
                                </IconButton>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      ),
                    },
                  ]}
                  emptyMessage="No attendance records found for this project this week"
                />
              </div>
            )}
          </>
        )
      )}

      {isDeleting && <LoadingSpinner testId="delete-loading" />}

      <BaseModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        maxWidth="md"
      >
        {project && (
          <ProjectForm
            initialData={project}
            onSubmit={handleUpdateProject}
            onCancel={() => setIsEditModalOpen(false)}
            isEditing={true}
          />
        )}
      </BaseModal>
    </PageLayout>
  );
};

export default ProjectDetails;
