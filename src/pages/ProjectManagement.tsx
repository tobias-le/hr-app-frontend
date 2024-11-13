import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Paper,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/Header";
import ApiService from "../services/api.service";
import { Project } from "../types/attendance";
import { Employee, EmployeeNameWithId } from "../types/employee";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { debounce } from "lodash";

interface ProjectFormData {
  name: string;
  managerId: number;
  members: Employee[];
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
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
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeNameWithId[]>(
    []
  );
  const [managerOptions, setManagerOptions] = useState<EmployeeNameWithId[]>(
    []
  );
  const [memberOptions, setMemberOptions] = useState<EmployeeNameWithId[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
    const fetchEmployeeOptions = async () => {
      try {
        const response = await ApiService.getEmployeeNamesWithIds();
        setEmployeeOptions(response);
      } catch (error) {
        showMessage("Failed to fetch employees");
      }
    };
    fetchEmployeeOptions();
  }, [showMessage]);

  const fetchProjects = async () => {
    try {
      const response = await ApiService.getAllProjects();
      setProjects(response);
    } catch (error) {
      showMessage("Failed to fetch projects");
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await ApiService.getAllEmployees();
      setEmployees(response);
    } catch (error) {
      showMessage("Failed to fetch employees");
    }
  };

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

  const fetchManagerOptions = async (query: string) => {
    setManagerLoading(true);
    try {
      // Don't exclude any IDs for manager options
      const response = await ApiService.autocompleteEmployees(query, []);
      setManagerOptions(response);
    } catch (error) {
      showMessage("Failed to fetch manager options");
    } finally {
      setManagerLoading(false);
    }
  };

  const fetchMemberOptions = async (query: string) => {
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
  };

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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <Box className="flex-grow p-6">
        <Paper className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h5" className="font-bold">
              Project Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog()}
              data-testid="add-project-button"
            >
              Add Project
            </Button>
          </div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.projectId}
                    onClick={() => handleRowClick(project.projectId)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.managerName}</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProject ? "Edit Project" : "Create New Project"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} className="mt-2">
            <Grid item xs={12}>
              <TextField
                label="Project Name"
                fullWidth
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </Dialog>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
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
                    <Typography>
                      {selectedProjectDetails.managerName}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectManagement;
