import React, { useState, useMemo } from "react";
import { Button, Grid } from "@mui/material";
import { Project } from "../types/attendance";
import { EmployeeNameWithId } from "../types/employee";
import ApiService from "../services/api.service";
import { FormField } from "./common/FormField";
import { useForm } from "../hooks/useForm";
import { debounce } from "lodash";
import { AutocompleteField } from "./common/AutocompleteField";

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: Partial<Project>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [managerOptions, setManagerOptions] = useState<EmployeeNameWithId[]>(
    []
  );
  const [memberOptions, setMemberOptions] = useState<EmployeeNameWithId[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formData, setFormData } = useForm<Partial<Project>>(
    initialData || {
      name: "",
      managerId: 0,
      members: [],
    }
  );

  const fetchManagerOptions = async (query: string) => {
    setManagerLoading(true);
    try {
      const response = await ApiService.autocompleteEmployees(query, []);
      setManagerOptions(response);
    } catch (error) {
      console.error("Failed to fetch manager options:", error);
    } finally {
      setManagerLoading(false);
    }
  };

  const debouncedFetchManagerOptions = useMemo(
    () => debounce(fetchManagerOptions, 300),
    []
  );

  const debouncedFetchMemberOptions = useMemo(() => {
    const fetchMemberOptions = async (query: string) => {
      setMemberLoading(true);
      try {
        const excludeIds = [
          ...(formData.members?.map((m) => m.id) || []),
          formData.managerId || 0,
        ].filter(Boolean);
        const response = await ApiService.autocompleteEmployees(
          query,
          excludeIds
        );
        setMemberOptions(response);
      } catch (error) {
        console.error("Failed to fetch member options:", error);
      } finally {
        setMemberLoading(false);
      }
    };

    return debounce(fetchMemberOptions, 300);
  }, [formData.members, formData.managerId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid
      container
      spacing={3}
      className="mt-2"
      sx={{
        minHeight: "60vh",
        marginTop: "12px",
        "& .MuiGrid-item": {
          paddingTop: "24px",
        },
      }}
    >
      <Grid item xs={12}>
        <FormField
          name="name"
          label="Project Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          error={!formData.name}
          helperText={!formData.name ? "Project name is required" : ""}
          testId="project-name-input"
        />
      </Grid>

      {/* Manager Selection */}
      <Grid item xs={12}>
        <AutocompleteField
          name="manager"
          label="Project Manager"
          value={
            managerOptions.find((emp) => emp.id === formData.managerId) || null
          }
          options={managerOptions}
          getOptionLabel={(option) => option.name || ""}
          onChange={(_, newValue) =>
            setFormData({
              ...formData,
              managerId: newValue?.id || 0,
              managerName: newValue?.name,
            })
          }
          onInputChange={(_, newInputValue) => {
            debouncedFetchManagerOptions(newInputValue);
          }}
          required
          loading={managerLoading}
        />
      </Grid>

      {/* Team Members Selection */}
      <Grid item xs={12}>
        <AutocompleteField
          name="members"
          label="Team Members"
          value={formData.members || []}
          options={memberOptions}
          getOptionLabel={(option) => option.name || ""}
          onChange={(_, newValue) =>
            setFormData({
              ...formData,
              members: newValue,
            })
          }
          onInputChange={(_, newInputValue) => {
            debouncedFetchMemberOptions(newInputValue);
          }}
          multiple
          loading={memberLoading}
        />
      </Grid>

      {/* Action Buttons */}
      <Grid item xs={12} sx={{ marginTop: "auto" }}>
        {" "}
        {/* Push buttons to bottom */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            onClick={onCancel}
            disabled={isSubmitting}
            variant="outlined"
            sx={{ minWidth: "100px" }} // Make buttons wider
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ minWidth: "100px" }} // Make buttons wider
          >
            {isSubmitting ? "Processing..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};
