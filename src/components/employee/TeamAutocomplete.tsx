import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { TeamNameWithId } from "../../types/team";
import { useTeams } from "../../hooks/useTeams";

interface TeamAutocompleteProps {
  value: TeamNameWithId | undefined;
  onChange: (event: any) => void;
  error?: string;
}

export const TeamAutocomplete: React.FC<TeamAutocompleteProps> = ({
  value,
  onChange,
  error,
}) => {
  const { teams, loading } = useTeams();

  const handleChange = (_: any, newValue: TeamNameWithId | null) => {
    onChange({
      target: {
        name: "team",
        value: newValue,
      },
    });
  };

  return (
    <Autocomplete
      options={teams}
      value={value || null}
      onChange={handleChange}
      loading={loading}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.teamId === value.teamId}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Team"
          error={!!error}
          helperText={error}
          data-testid="team-autocomplete"
        />
      )}
    />
  );
};
