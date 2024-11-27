import React from "react";
import { Typography, Avatar, Chip, IconButton } from "@mui/material";
import { Employee } from "../types/employee";
import { stringToColor } from "../utils/colorUtils";
import { createProjectChip } from "../utils/chipUtils";
import { BaseModal } from "./common/BaseModal";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useEmployeeStore } from "../store/employeeStore";

interface EmployeeDetailsModalProps {
  currentEmployee: Employee | null;
  handleCloseModal: () => void;
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  currentEmployee,
  handleCloseModal,
}) => {
  const navigate = useNavigate();
  const { currentEmployee: loggedInEmployee } = useEmployeeStore();

  const handleEditClick = () => {
    if (currentEmployee) {
      handleCloseModal();
      navigate(`/employee-management/${currentEmployee.id}`);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return "N/A";
    return amount.toLocaleString("cs-CZ");
  };

  return (
    <BaseModal
      open={!!currentEmployee}
      onClose={handleCloseModal}
      title="Employee Details"
      maxWidth="sm"
      testId="employee-details-modal"
    >
      {currentEmployee && (
        <div className="space-y-4 py-4" data-testid="employee-details-content">
          <div className="flex justify-between items-center mb-4">
            {loggedInEmployee?.hr && (
              <IconButton
                onClick={handleEditClick}
                size="small"
                data-testid="edit-employee-button"
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Avatar
              className="w-16 h-16"
              sx={{ bgcolor: stringToColor(currentEmployee.name ?? "") }}
              data-testid="employee-avatar"
            >
              {(currentEmployee.name ?? "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Avatar>
            <div>
              <Typography variant="h6" data-testid="employee-name">
                {currentEmployee.name}
              </Typography>
              <Typography
                color="textSecondary"
                data-testid="employee-job-title"
              >
                {currentEmployee.jobTitle}
              </Typography>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Chip
                label={currentEmployee.employmentStatus}
                color={
                  currentEmployee.employmentStatus === "ACTIVE"
                    ? "success"
                    : "default"
                }
                size="small"
                data-testid="status-chip"
              />
            </div>
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Contact Information
              </Typography>
              <Typography data-testid="employee-email">
                {currentEmployee.email}
              </Typography>
              <Typography data-testid="employee-phone">
                {currentEmployee.phoneNumber}
              </Typography>
            </div>
          </div>

          {loggedInEmployee?.hr && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="subtitle2" color="textSecondary">
                  Annual Salary
                </Typography>
                <Typography data-testid="employee-salary">
                  {formatCurrency(currentEmployee.annualSalary)} CZK
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle2" color="textSecondary">
                  Learning Budget
                </Typography>
                <Typography data-testid="employee-learning-budget">
                  {formatCurrency(currentEmployee.annualLearningBudget)} CZK
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle2" color="textSecondary">
                  Business Performance Bonus
                </Typography>
                <Typography data-testid="employee-business-bonus">
                  {formatCurrency(
                    currentEmployee.annualBusinessPerformanceBonusMax
                  )}{" "}
                  CZK
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle2" color="textSecondary">
                  Personal Performance Bonus
                </Typography>
                <Typography data-testid="employee-personal-bonus">
                  {formatCurrency(
                    currentEmployee.annualPersonalPerformanceBonusMax
                  )}{" "}
                  CZK
                </Typography>
              </div>
            </div>
          )}

          <div>
            <Typography variant="subtitle2" color="textSecondary">
              Current Projects
            </Typography>
            <div className="flex gap-1 flex-wrap mt-1">
              {currentEmployee.currentProjects?.map((project, idx) => (
                <Chip
                  key={idx}
                  {...createProjectChip(project)}
                  data-testid={`project-chip-${idx}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default EmployeeDetailsModal;
