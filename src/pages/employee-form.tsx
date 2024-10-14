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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Employee
      </Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                name="name"
                value={employee.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Department"
                name="department"
                value={employee.department}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Work Percentage</InputLabel>
                <Select
                  name="workPercentage"
                  value={employee.workPercentage}
                  onChange={handleChange}
                  label="Work Percentage"
                >
                  <MenuItem value="FULL_TIME">Full Time</MenuItem>
                  <MenuItem value="HALF_TIME">Half Time</MenuItem>
                  <MenuItem value="QUARTER_TIME">Quarter Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contractual Hours"
                name="contractualHours"
                type="number"
                value={employee.contractualHours}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Account Number"
                name="accountNumber"
                value={employee.accountNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Street"
                name="street"
                value={employee.street}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={employee.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Zip Code"
                name="zipCode"
                value={employee.zipCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Country"
                name="country"
                value={employee.country}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Employee
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
