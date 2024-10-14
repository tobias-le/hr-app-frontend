import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Paper,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface Employee {
  employeeId: number;
  name: string;
  department: { name: string };
  contractType: string;
  workPercentage: string;
  contractualHours: number;
  accountNumber: string;
  availableTimeOff: number;
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Fetch employee details from API
    // For now, we'll use mock data
    setEmployee({
      employeeId: 1,
      name: "John Doe",
      department: { name: "IT" },
      contractType: "FULL_TIME",
      workPercentage: "FULL_TIME",
      contractualHours: 40,
      accountNumber: "1234567890",
      availableTimeOff: 20,
      address: {
        street: "123 Main St",
        city: "Prague",
        zipCode: "12000",
        country: "Czech Republic",
      },
    });
  }, [id]);

  if (!employee) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Details
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemText primary="Name" secondary={employee.name} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Department"
                  secondary={employee.department.name}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contract Type"
                  secondary={employee.contractType}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Work Percentage"
                  secondary={employee.workPercentage}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Contractual Hours"
                  secondary={employee.contractualHours}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Account Number"
                  secondary={employee.accountNumber}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Available Time Off"
                  secondary={`${employee.availableTimeOff} days`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={`${employee.address.street}, ${employee.address.city}, ${employee.address.zipCode}, ${employee.address.country}`}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
