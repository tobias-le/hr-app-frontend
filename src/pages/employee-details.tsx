import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Paper, Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { mockedEmployeeDetails } from "../mocks/employeeData";
import EmployeeInfoSection from "../components/EmployeeInfoSection";
import { Employee } from "../types/Employee";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledTypography = styled(Typography)({
  marginBottom: "16px",
});

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Fetch employee details from API
    // For now, we'll use mock data
    setEmployee(mockedEmployeeDetails);
  }, [id]);

  if (!employee) {
    return <Typography>Loading...</Typography>;
  }

  const personalFields = [
    { key: "name" as keyof Employee, label: "Name" },
    { key: "department" as keyof Employee, label: "Department" },
    { key: "contractType" as keyof Employee, label: "Contract Type" },
    { key: "workPercentage" as keyof Employee, label: "Work Percentage" },
  ];

  const workFields = [
    { key: "contractualHours" as keyof Employee, label: "Contractual Hours" },
    { key: "accountNumber" as keyof Employee, label: "Account Number" },
    { key: "availableTimeOff" as keyof Employee, label: "Available Time Off" },
  ];

  return (
    <StyledBox>
      <StyledTypography variant="h4">Employee Details</StyledTypography>
      <StyledPaper>
        <Grid container spacing={2}>
          <EmployeeInfoSection employee={employee} fields={personalFields} />
          <EmployeeInfoSection employee={employee} fields={workFields} />
        </Grid>
      </StyledPaper>
    </StyledBox>
  );
}
