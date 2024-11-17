import React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

interface Option {
  id?: number;
  value?: number | string;
  label?: string;
  name?: string;
  [key: string]: any;
}

interface AutocompleteFieldProps<T extends Option> {
  name: string;
  label: string;
  value: T | T[] | null;
  options: T[];
  onChange: (event: any, value: any) => void;
  onInputChange?: (event: any, value: string) => void;
  getOptionLabel?: (option: T) => string;
  required?: boolean;
  loading?: boolean;
  multiple?: boolean;
  error?: boolean;
  helperText?: string;
}

export const AutocompleteField = <T extends Option>({
  name,
  label,
  value,
  options,
  onChange,
  onInputChange,
  getOptionLabel = (option: T) => option.label || option.name || "",
  required = false,
  loading = false,
  multiple = false,
  error = false,
  helperText,
}: AutocompleteFieldProps<T>) => {
  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      value={value}
      onChange={onChange}
      onInputChange={onInputChange}
      getOptionLabel={getOptionLabel}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
