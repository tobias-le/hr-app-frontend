import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { Employee } from "../types/employee";
import ApiService from "../services/api.service";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import EmployeeRow from "./EmployeeRow";

interface EmployeeTableProps {
  teamId: number;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ teamId }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await ApiService.getEmployees(teamId);
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64"
        data-testid="loading-spinner"
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="m-4" data-testid="error-alert">
        {error}
      </Alert>
    );
  }

  if (!employees.length) {
    return (
      <div
        className="flex justify-center items-center h-64"
        data-testid="empty-state"
      >
        <Typography variant="h6" color="textSecondary">
          No employees are on this team yet
        </Typography>
      </div>
    );
  }

  return (
    <TableContainer
      component={Paper}
      className="mt-5 shadow-lg"
      data-testid="employee-table-container"
    >
      <Table
        sx={{ minWidth: 650 }}
        aria-label="employee table"
        data-testid="employee-table"
      >
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell data-testid="header-employee">Employee</TableCell>
            <TableCell data-testid="header-job-title">Job Title</TableCell>
            <TableCell data-testid="header-status">Status</TableCell>
            <TableCell data-testid="header-contact">Contact</TableCell>
            <TableCell data-testid="header-projects">
              Current Projects
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody data-testid="employee-table-body">
          {employees.map((employee, index) => (
            <EmployeeRow
              key={employee.id || index}
              employee={employee}
              onClick={handleEmployeeClick}
            />
          ))}
        </TableBody>
      </Table>
      <EmployeeDetailsModal
        selectedEmployee={selectedEmployee}
        handleCloseModal={handleCloseModal}
      />
    </TableContainer>
  );
};

export default EmployeeTable;
