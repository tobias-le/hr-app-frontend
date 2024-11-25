import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Typography,
  Chip,
} from "@mui/material";
import { Employee } from "../types/employee";
import ApiService from "../services/api.service";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import EmployeeRow from "./EmployeeRow";
import { useProjectStore } from "../store/projectStore";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { EmptyState } from "./common/EmptyState";

interface EmployeeTableProps {
  projectId: number;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ projectId }) => {
  const { selectedProject } = useProjectStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEmployee, setcurrentEmployee] = useState<Employee | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      if (!projectId) {
        setError("Project ID is required");
        return;
      }
      const data = await ApiService.getEmployees(projectId);
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEmployeeClick = (employee: Employee) => {
    setcurrentEmployee(employee);
  };

  const handleCloseModal = () => {
    setcurrentEmployee(null);
  };

  if (loading) {
    return <LoadingSpinner testId="loading-spinner" />;
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
      <EmptyState
        message="No employees are on this team yet"
        testId="empty-state"
      />
    );
  }

  return (
    <TableContainer
      component={Paper}
      className="mt-5"
      data-testid="employee-table-container"
    >
      <Table aria-label="employee table" data-testid="employee-table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex items-center gap-2">
                <Typography variant="subtitle1">Project Manager:</Typography>
                <Chip
                  label={selectedProject?.managerName || "Not assigned"}
                  color="primary"
                  size="small"
                  data-testid="project-manager-chip"
                />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
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
        currentEmployee={currentEmployee}
        handleCloseModal={handleCloseModal}
      />
    </TableContainer>
  );
};

export default EmployeeTable;
