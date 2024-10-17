import React, { useState } from "react";
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components
const FormContainer = styled(Box)`
  padding: 24px;
`;

const FormPaper = styled(Paper)`
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const FormGrid = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

const FullWidthGrid = styled(Grid)`
  grid-column: 1 / -1;
`;

export default function EmployeeForm() {
  const [employee, setEmployee] = useState({
    name: "",
    department: "",
    contractType: "",
    workPercentage: "",
    contractualHours: "",
    accountNumber: "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = event.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission (e.g., send data to API)
    console.log(employee);
  };

  return (
    <FormContainer>
      <Typography variant="h4" gutterBottom>
        Add New Employee
      </Typography>
      <FormPaper>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={employee.name}
              onChange={handleChange}
            />
            <TextField
              required
              fullWidth
              label="Department"
              name="department"
              value={employee.department}
              onChange={handleChange}
            />
            <FormControl fullWidth required>
              <InputLabel>Contract Type</InputLabel>
              <Select
                name="contractType"
                value={employee.contractType}
                onChange={handleChange}
                label="Contract Type"
              >
                <MenuItem value="FULL_TIME">Full Time</MenuItem>
                <MenuItem value="PART_TIME">Part Time</MenuItem>
                <MenuItem value="CONTRACTOR">Contractor</MenuItem>
              </Select>
            </FormControl>
            {/* ... other form fields ... */}
            <FullWidthGrid>
              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
            </FullWidthGrid>
            <FullWidthGrid>
              <TextField
                required
                fullWidth
                label="Street"
                name="street"
                value={employee.street}
                onChange={handleChange}
              />
            </FullWidthGrid>
            {/* ... other address fields ... */}
            <FullWidthGrid>
              <Button type="submit" variant="contained" color="primary">
                Add Employee
              </Button>
            </FullWidthGrid>
          </FormGrid>
        </form>
      </FormPaper>
    </FormContainer>
  );
}
