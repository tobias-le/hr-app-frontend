import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Employee } from "../types/employee";
import { stringToColor } from "../utils/colorUtils";
import { createProjectChip } from "../utils/chipUtils";

interface EmployeeDetailsModalProps {
  selectedEmployee: Employee | null;
  handleCloseModal: () => void;
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  selectedEmployee,
  handleCloseModal,
}) => (
  <Dialog
    open={!!selectedEmployee}
    onClose={handleCloseModal}
    maxWidth="sm"
    fullWidth
    sx={{ borderRadius: 2 }}
    data-testid="employee-details-modal"
  >
    <DialogTitle>
      <div className="flex justify-between items-center">
        <Typography variant="h6" data-testid="modal-title">
          Employee Details
        </Typography>
        <IconButton onClick={handleCloseModal} data-testid="close-button">
          <CloseIcon />
        </IconButton>
      </div>
    </DialogTitle>
    <DialogContent>
      {selectedEmployee && (
        <div className="space-y-4 py-4" data-testid="employee-details-content">
          <div className="flex items-center gap-4">
            <Avatar
              className="w-16 h-16"
              sx={{ bgcolor: stringToColor(selectedEmployee.name ?? "") }}
              data-testid="employee-avatar"
            >
              {(selectedEmployee.name ?? "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Avatar>
            <div>
              <Typography variant="h6" data-testid="employee-name">
                {selectedEmployee.name}
              </Typography>
              <Typography
                color="textSecondary"
                data-testid="employee-job-title"
              >
                {selectedEmployee.jobTitle}
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
                label={selectedEmployee.employmentStatus}
                color={
                  selectedEmployee.employmentStatus === "ACTIVE"
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
                {selectedEmployee.email}
              </Typography>
              <Typography data-testid="employee-phone">
                {selectedEmployee.phoneNumber}
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
              {selectedEmployee.currentProjects?.map((project, idx) => (
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
    </DialogContent>
  </Dialog>
);

export default EmployeeDetailsModal;
