import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { mockedEmployees } from "../mocks/employeeData";

interface Employee {
  employeeId: number;
  name: string;
  department: { name: string };
  contractType: string;
  workPercentage: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Fetch employees from API
    // For now, we'll use mock data
    setEmployees(mockedEmployees);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee List
      </Typography>
      <Button
        component={Link}
        to="/employees/new"
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Add New Employee
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Contract Type</TableCell>
              <TableCell>Work Percentage</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.employeeId}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.department.name}</TableCell>
                <TableCell>{employee.contractType}</TableCell>
                <TableCell>{employee.workPercentage}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/employees/${employee.employeeId}`}
                    variant="outlined"
                    size="small"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
