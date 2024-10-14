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
import styled from "styled-components";

interface Employee {
  employeeId: number;
  name: string;
  department: { name: string };
  contractType: string;
  workPercentage: string;
}

const FormContainer = styled.div`
  padding: 24px;
`;

const FormPaper = styled(Paper)`
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

const FullWidthGrid = styled.div`
  grid-column: 1 / -1;
`;

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Fetch employees from API
    // For now, we'll use mock data
    setEmployees(mockedEmployees);
  }, []);

  return (
    <FormContainer>
      <FormPaper>
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
        <TableContainer>
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
      </FormPaper>
    </FormContainer>
  );
}
