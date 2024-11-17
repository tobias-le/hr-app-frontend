import React, { useState, useMemo, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { FormField } from "./common/FormField";
import { AutocompleteField } from "./common/AutocompleteField";
import { Employee, EmployeeNameWithId } from "../types/employee";
import { debounce } from "lodash";
import ApiService from "../services/api.service";

export interface TeamFormData {
  name: string;
  managerId: number | null;
  managerName: string;
  members: EmployeeNameWithId[];
  employees: Employee[];
}

interface TeamFormProps {
  formData: TeamFormData;
  setFormData: React.Dispatch<React.SetStateAction<TeamFormData>>;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
}) => {
  const [managerOptions, setManagerOptions] = useState<EmployeeNameWithId[]>(
    []
  );
  const [memberOptions, setMemberOptions] = useState<EmployeeNameWithId[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);

  useEffect(() => {
    if (formData.managerId && formData.managerName) {
      setManagerOptions([
        {
          id: formData.managerId,
          name: formData.managerName,
        },
      ]);
    }
  }, [formData.managerId, formData.managerName]);

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

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: "grid",
        gap: 3,
        minHeight: "60vh",
        marginTop: "12px",
        "& .MuiFormControl-root": {
          marginTop: "24px",
        },
      }}
    >
      <FormField
        name="name"
        label="Team Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prevData) => ({ ...prevData, name: e.target.value }))
        }
        required
        validateNotEmpty
      />

      <AutocompleteField
        name="manager"
        label="Team Manager"
        value={
          managerOptions.find((emp) => emp.id === formData.managerId) || null
        }
        options={managerOptions}
        onChange={(_, newValue) =>
          setFormData((prevData) => ({
            ...prevData,
            managerId: newValue?.id || null,
            managerName: newValue?.name || "",
          }))
        }
        onInputChange={(_, newInputValue) => {
          debouncedFetchManagerOptions(newInputValue);
        }}
        getOptionLabel={(option) => option.name}
        required
        loading={managerLoading}
        error={!formData.managerId}
        helperText={!formData.managerId ? "Manager is required" : ""}
      />

      <AutocompleteField
        name="members"
        label="Team Members"
        value={formData.members || []}
        options={memberOptions}
        onChange={(_, newValue) =>
          setFormData((prevData) => ({
            ...prevData,
            members: newValue,
          }))
        }
        onInputChange={(_, newInputValue) => {
          debouncedFetchMemberOptions(newInputValue);
        }}
        getOptionLabel={(option) => option.name}
        multiple
        loading={memberLoading}
      />

      <div className="flex justify-end space-x-2 mt-auto">
        <Button
          onClick={onCancel}
          disabled={isSubmitting}
          variant="outlined"
          sx={{ minWidth: "100px" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ minWidth: "100px" }}
        >
          {isSubmitting ? "Processing..." : isEditing ? "Update" : "Create"}
        </Button>
      </div>
    </Box>
  );
};
