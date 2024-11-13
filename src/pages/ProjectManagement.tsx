import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../services/api.service";
import { Project } from "../types/attendance";
import { Employee, EmployeeNameWithId } from "../types/employee";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { debounce } from "lodash";
import { PageLayout } from "../components/common/PageLayout";
import { DataTable } from "../components/common/DataTable";
import { BaseModal } from "../components/common/BaseModal";
import { FormField } from "../components/common/FormField";

interface ProjectFormData {
  name: string;
  managerId: number;
  members: Employee[];
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    managerId: 0,
    members: [],
  });
  const { showMessage } = useSnackbarStore();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProjectDetails, setSelectedProjectDetails] =
    useState<Project | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [managerOptions, setManagerOptions] = useState<EmployeeNameWithId[]>(
    []
  );
  const [memberOptions, setMemberOptions] = useState<EmployeeNameWithId[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await ApiService.getAllProjects();
      setProjects(response);
    } catch (error) {
      showMessage("Failed to fetch projects");
    }
  }, [showMessage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenDialog = async (project?: Project) => {
    if (project) {
      setEditingProject(project);
      try {
        const projectDetails = await ApiService.getProjectDetails(
          project.projectId
        );

        // First set the form data with project details
        setFormData({
          name: projectDetails.name,
          managerId: projectDetails.managerId,
          members: projectDetails.members || [],
        });

        // Then fetch manager options including the current manager
        const managerData = await ApiService.autocompleteEmployees(
          projectDetails.managerName || "",
          [] // No exclusions for managers
        );
        setManagerOptions(managerData);

        // Also fetch member options excluding the current manager
        const memberData = await ApiService.autocompleteEmployees(
          "",
          [projectDetails.managerId] // Exclude the manager from member options
        );
        setMemberOptions(memberData);
      } catch (error) {
        showMessage("Failed to fetch project details");
      }
    } else {
      setEditingProject(null);
      setFormData({ name: "", managerId: 0, members: [] });
      // Reset options
      setManagerOptions([]);
      setMemberOptions([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
    setFormData({ name: "", managerId: 0, members: [] });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedManager = managerOptions.find(
        (m) => m.id === formData.managerId
      );
      if (!selectedManager) {
        showMessage("Please select a manager");
        return;
      }

      if (editingProject) {
        await ApiService.updateProject(editingProject.projectId, {
          ...editingProject,
          name: formData.name,
          managerId: formData.managerId,
          managerName: selectedManager.name,
          members: formData.members.map((member) => ({
            id: member.id,
            name: member.name,
          })),
        });
        showMessage("Project updated successfully");
      } else {
        await ApiService.createProject({
          ...formData,
          managerName: selectedManager.name,
        });
        showMessage("Project created successfully");
      }
      fetchProjects();
      handleCloseDialog();
    } catch (error) {
      showMessage(
        editingProject ? "Failed to update project" : "Failed to create project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await ApiService.deleteProject(projectId);
        showMessage("Project deleted successfully");
        fetchProjects();
      } catch (error) {
        showMessage("Failed to delete project");
      }
    }
  };

  const handleRowClick = async (projectId: number) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    try {
      const details = await ApiService.getProjectDetails(projectId);
      setSelectedProjectDetails(details);
    } catch (error) {
      showMessage("Failed to fetch project details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const fetchManagerOptions = useCallback(
    async (query: string) => {
      setManagerLoading(true);
      try {
        const response = await ApiService.autocompleteEmployees(query, []);
        setManagerOptions(response);
      } catch (error) {
        showMessage("Failed to fetch manager options");
      } finally {
        setManagerLoading(false);
      }
    },
    [showMessage]
  );

  const fetchMemberOptions = useCallback(
    async (query: string) => {
      setMemberLoading(true);
      try {
        const excludeIds = [...formData.members.map((m) => m.id)];
        if (formData.managerId) excludeIds.push(formData.managerId);
        const response = await ApiService.autocompleteEmployees(
          query,
          excludeIds
        );
        setMemberOptions(response);
      } catch (error) {
        showMessage("Failed to fetch member options");
      } finally {
        setMemberLoading(false);
      }
    },
    [formData.members, formData.managerId, showMessage]
  );

  const debouncedFetchManagerOptions = useMemo(
    () => debounce(fetchManagerOptions, 300),
    [fetchManagerOptions]
  );

  const debouncedFetchMemberOptions = useMemo(
    () => debounce(fetchMemberOptions, 300),
    [fetchMemberOptions]
  );

  useEffect(() => {
    return () => {
      debouncedFetchManagerOptions.cancel();
      debouncedFetchMemberOptions.cancel();
    };
  }, [debouncedFetchManagerOptions, debouncedFetchMemberOptions]);

  const columns = [
    { header: "Project Name", accessor: "name" as keyof Project },
    { header: "Manager", accessor: "managerName" as keyof Project },
    {
      header: "Actions",
      accessor: (project: Project) => (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDialog(project);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(project.projectId);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <PageLayout title="Project Management">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
          data-testid="add-project-button"
        >
          Add Project
        </Button>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        onRowClick={(project: Project) => handleRowClick(project.projectId)}
        testId="projects-table"
      />

      <BaseModal
        open={openDialog}
        onClose={handleCloseDialog}
        title={editingProject ? "Edit Project" : "Create Project"}
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
              {isSubmitting
                ? "Processing..."
                : editingProject
                ? "Update"
                : "Create"}
            </Button>
          </>
        }
      >
        <Grid container spacing={3} className="mt-2">
          <Grid item xs={12}>
            <FormField
              name="name"
              label="Project Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              validateNotEmpty
              testId="project-name-input"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={managerOptions}
              getOptionLabel={(option) => option.name}
              value={
                managerOptions.find((emp) => emp.id === formData.managerId) ||
                null
              }
              onChange={(_, newValue) =>
                setFormData({
                  ...formData,
                  managerId: newValue?.id || 0,
                })
              }
              onInputChange={(_, newInputValue) => {
                debouncedFetchManagerOptions(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Project Manager"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {managerLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              loading={managerLoading}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={memberOptions}
              getOptionLabel={(option) => option.name}
              value={formData.members}
              onChange={(_, newValue) =>
                setFormData({
                  ...formData,
                  members: newValue.map((v) => ({
                    id: v.id,
                    name: v.name,
                  })),
                })
              }
              onInputChange={(_, newInputValue) => {
                debouncedFetchMemberOptions(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Project Members"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {memberLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              loading={memberLoading}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>
        </Grid>
      </BaseModal>

      <BaseModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Project Details"
        maxWidth="md"
        actions={<Button onClick={() => setDetailsOpen(false)}>Close</Button>}
      >
        {detailsLoading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : (
          selectedProjectDetails && (
            <div className="space-y-4 py-4">
              <Typography variant="h6">
                {selectedProjectDetails.name}
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">
                    Project Manager
                  </Typography>
                  <Typography>{selectedProjectDetails.managerName}</Typography>
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
                {selectedProjectDetails.members ? (
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
                        {selectedProjectDetails.members.map((member) => (
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
          )
        )}
      </BaseModal>
    </PageLayout>
  );
};

export default ProjectManagement;
