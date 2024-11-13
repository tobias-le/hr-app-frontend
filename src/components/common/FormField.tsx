import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  value: any;
  onChange: (e: React.ChangeEvent<any> | SelectChangeEvent<any>) => void;
  options?: { value: string | number; label: string }[];
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  testId?: string;
  error?: boolean;
  helperText?: string;
  validateNotEmpty?: boolean;
  emptyErrorMessage?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  options,
  multiline,
  rows,
  required,
  testId,
  error = false,
  helperText = "",
  validateNotEmpty = false,
  emptyErrorMessage = "This field is required",
  className,
}) => {
  const isError = error || (validateNotEmpty && required && !value);
  const displayHelperText = isError
    ? validateNotEmpty && !value
      ? emptyErrorMessage
      : helperText
    : helperText;

  if (options) {
    return (
      <FormControl fullWidth error={isError}>
        <InputLabel>{label}</InputLabel>
        <Select
          name={name}
          value={value}
          onChange={onChange}
          label={label}
          required={required}
          data-testid={testId}
          error={isError}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {displayHelperText && (
          <FormHelperText>{displayHelperText}</FormHelperText>
        )}
      </FormControl>
    );
  }

  return (
    <TextField
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={rows}
      required={required}
      fullWidth
      data-testid={testId}
      error={isError}
      helperText={displayHelperText}
      InputLabelProps={
        type === "date" || type === "time" ? { shrink: true } : undefined
      }
    />
  );
};
