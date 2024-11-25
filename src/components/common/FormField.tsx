import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  value?: any;
  checked?: boolean;
  onChange?: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<any>
  ) => void;
  options?: { value: string | number; label: string }[];
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  testId?: string;
  error?: boolean;
  helperText?: string | null;
  validateNotEmpty?: boolean;
  emptyErrorMessage?: string;
  className?: string;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  value,
  checked,
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
  disabled = false,
}) => {
  const isError = error || (validateNotEmpty && required && !value);
  const displayHelperText = isError
    ? validateNotEmpty && !value
      ? emptyErrorMessage
      : helperText
    : helperText;

  if (options) {
    return (
      <FormControl fullWidth error={isError} sx={{ my: 0.5 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          name={name}
          value={value}
          onChange={onChange}
          label={label}
          required={required}
          data-testid={testId}
          error={isError}
          disabled={disabled}
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

  if (type === "checkbox") {
    return (
      <FormControl fullWidth error={isError} sx={{ my: 0.5 }}>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              data-testid={testId}
            />
          }
          label={label}
        />
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
      disabled={disabled}
      InputLabelProps={
        type === "date" || type === "time" ? { shrink: true } : undefined
      }
      sx={{ my: 0.5 }}
    />
  );
};
