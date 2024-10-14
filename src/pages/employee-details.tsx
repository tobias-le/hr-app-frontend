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
import { mockedEmployeeDetails } from "../mocks/employeeData";
import { styled } from "@mui/material/styles";

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

const EmployeeInfoItem = ({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string | number;
}) => (
  <ListItem>
    <ListItemText primary={primary} secondary={secondary} />
  </ListItem>
);

const StyledBox = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledTypography = styled(Typography)({
  marginBottom: "16px",
});

const EmployeeInfoList = styled(List)({
  width: "100%",
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

  return (
    <StyledBox>
      <StyledTypography variant="h4">Employee Details</StyledTypography>
      <StyledPaper>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <EmployeeInfoList>
              <EmployeeInfoItem primary="Name" secondary={employee.name} />
              <EmployeeInfoItem
                primary="Department"
                secondary={employee.department.name}
              />
              <EmployeeInfoItem
                primary="Contract Type"
                secondary={employee.contractType}
              />
              <EmployeeInfoItem
                primary="Work Percentage"
                secondary={employee.workPercentage}
              />
            </EmployeeInfoList>
          </Grid>
          <Grid item xs={12} md={6}>
            <EmployeeInfoList>
              <EmployeeInfoItem
                primary="Contractual Hours"
                secondary={employee.contractualHours}
              />
              <EmployeeInfoItem
                primary="Account Number"
                secondary={employee.accountNumber}
              />
              <EmployeeInfoItem
                primary="Available Time Off"
                secondary={`${employee.availableTimeOff} days`}
              />
              <EmployeeInfoItem
                primary="Address"
                secondary={`${employee.address.street}, ${employee.address.city}, ${employee.address.zipCode}, ${employee.address.country}`}
              />
            </EmployeeInfoList>
          </Grid>
        </Grid>
      </StyledPaper>
    </StyledBox>
  );
}
