import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { ProjectNameWithId } from "../../types/project";
import { useProjects } from "../../hooks/useProjects";

interface ProjectsAutocompleteProps {
  value: ProjectNameWithId[] | undefined;
  onChange: (event: any) => void;
  error?: string;
}

export const ProjectsAutocomplete: React.FC<ProjectsAutocompleteProps> = ({
  value = [],
  onChange,
  error,
}) => {
  const { projects, loading } = useProjects();

  const handleChange = (_: any, newValue: ProjectNameWithId[]) => {
    onChange({
      target: {
        name: "currentProjects",
        value: newValue,
      },
    });
  };

  return (
    <Autocomplete
      multiple
      options={projects}
      value={value}
      onChange={handleChange}
      loading={loading}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) =>
        option.projectId === value.projectId
      }
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.name}
            {...getTagProps({ index })}
            key={option.projectId}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Current Projects"
          error={!!error}
          helperText={error}
          data-testid="projects-autocomplete"
        />
      )}
    />
  );
};
