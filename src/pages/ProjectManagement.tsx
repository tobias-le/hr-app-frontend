import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  TextField,
  Grid,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import ApiService from "../services/api.service";
import { Project } from "../types/project";
import { Employee, EmployeeNameWithId } from "../types/employee";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { debounce } from "lodash";
import { PageLayout } from "../components/common/PageLayout";
import { DataTable } from "../components/common/DataTable";
import { BaseModal } from "../components/common/BaseModal";
import { FormField } from "../components/common/FormField";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { handleApiError } from "../utils/errorUtils";
import { useForm } from "../hooks/useForm";
import { useProjectSelection } from "../hooks/useProjectSelection";
import { useNavigate } from "react-router-dom";

interface ProjectFormData {
  name: string;
  managerId: number;
  members: Employee[];
}

const ProjectManagement: React.FC = () => {
  const { formData, setFormData, isSubmitting, setIsSubmitting } =
    useForm<ProjectFormData>({
      name: "",
      managerId: 0,
      members: [],
    });

  const [projects, setProjects] = useState<Project[]>([]);
  const { showMessage } = useSnackbarStore();
  const [managerOptions, setManagerOptions] = useState<EmployeeNameWithId[]>(
    []
  );
  const [memberOptions, setMemberOptions] = useState<EmployeeNameWithId[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const { handleProjectSelect } = useProjectSelection();
  const [projectsLoading, setProjectsLoading] = useState(true);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const response = await ApiService.getAllProjects();
      setProjects(response);
    } catch (error) {
      handleApiError(error, "Failed to fetch projects");
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenDialog = async (project?: Project) => {
    setOpenDialog(true);
    if (project) {
      const projectDetails = await handleProjectSelect(project);

      if (projectDetails) {
        setFormData({
          name: projectDetails.name,
          managerId: projectDetails.managerId,
          members: projectDetails.members || [],
        });

        // Fetch manager options including the current manager
        const managerData = await ApiService.autocompleteEmployees(
          projectDetails.managerName || "",
          []
        );
        setManagerOptions(managerData);

        // Fetch member options excluding the current manager
        const memberData = await ApiService.autocompleteEmployees("", [
          projectDetails.managerId,
        ]);
        setMemberOptions(memberData);
      }
    } else {
      setFormData({ name: "", managerId: 0, members: [] });
      setManagerOptions([]);
      setMemberOptions([]);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

      await ApiService.createProject({
        ...formData,
        managerName: selectedManager.name,
      });
      showMessage("Project created successfully");
      fetchProjects();
      handleCloseDialog();
    } catch (error) {
      showMessage("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
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

      {projectsLoading ? (
        <LoadingSpinner testId="projects-loading" />
      ) : (
        <DataTable
          data={projects}
          columns={columns}
          onRowClick={(project: Project) => handleRowClick(project.projectId)}
          testId="projects-table"
        />
      )}

      <BaseModal
        open={openDialog}
        onClose={handleCloseDialog}
        title="Create Project"
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
              {isSubmitting ? "Processing..." : "Create"}
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
    </PageLayout>
  );
};

export default ProjectManagement;
