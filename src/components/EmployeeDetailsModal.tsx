import React from "react";
import { Typography, Avatar, Chip } from "@mui/material";
import { Employee } from "../types/employee";
import { stringToColor } from "../utils/colorUtils";
import { createProjectChip } from "../utils/chipUtils";
import { BaseModal } from "./common/BaseModal";

interface EmployeeDetailsModalProps {
  currentEmployee: Employee | null;
  handleCloseModal: () => void;
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  currentEmployee,
  handleCloseModal,
}) => (
  <BaseModal
    open={!!currentEmployee}
    onClose={handleCloseModal}
    title="Employee Details"
    maxWidth="sm"
    testId="employee-details-modal"
  >
    {currentEmployee && (
      <div className="space-y-4 py-4" data-testid="employee-details-content">
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
            <Typography color="textSecondary" data-testid="employee-job-title">
              {currentEmployee.jobTitle}
            </Typography>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              data-testid="status-label"
            >
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
            <Typography
              variant="subtitle2"
              color="textSecondary"
              data-testid="contact-info-label"
            >
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
        <div>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            data-testid="projects-label"
          >
            Current Projects
          </Typography>
          <div
            className="flex gap-1 flex-wrap mt-1"
            data-testid="projects-container"
          >
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

export default EmployeeDetailsModal;
