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

const mobileBreakpoint = "600px";

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    setEmployees(mockedEmployees);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerStyle = {
    padding: "24px",
  };

  const paperStyle = {
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    overflowX: "auto" as const,
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  };

  const buttonStyle = {
    fontSize: isMobile ? "0.8rem" : "0.875rem",
    padding: isMobile ? "6px 16px" : "8px 22px",
  };

  return (
    <Box style={containerStyle}>
      <Paper style={paperStyle}>
        <Box style={headerStyle}>
          <Typography variant={isMobile ? "h6" : "h5"}>
            Employee List
          </Typography>
          <Button
            component={Link}
            to="/employees/new"
            variant="contained"
            color="primary"
            style={buttonStyle}
          >
            Add New Employee
          </Button>
        </Box>
        <TableContainer>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                {!isMobile && (
                  <>
                    <TableCell>Contract Type</TableCell>
                    <TableCell>Work Percentage</TableCell>
                  </>
                )}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department.name}</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell>{employee.contractType}</TableCell>
                      <TableCell>{employee.workPercentage}</TableCell>
                    </>
                  )}
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
      </Paper>
    </Box>
  );
}
