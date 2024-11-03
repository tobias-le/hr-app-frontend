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
  >
    <DialogTitle>
      <div className="flex justify-between items-center">
        <Typography variant="h6">Employee Details</Typography>
        <IconButton onClick={handleCloseModal}>
          <CloseIcon />
        </IconButton>
      </div>
    </DialogTitle>
    <DialogContent>
      {selectedEmployee && (
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar
              className="w-16 h-16"
              sx={{ bgcolor: stringToColor(selectedEmployee.name ?? "") }} // Set background color
            >
              {(selectedEmployee.name ?? "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Avatar>
            <div>
              <Typography variant="h6">{selectedEmployee.name}</Typography>
              <Typography color="textSecondary">
                {selectedEmployee.jobTitle}
              </Typography>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="subtitle2" color="textSecondary">
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
              />
            </div>
            <div>
              <Typography variant="subtitle2" color="textSecondary">
                Contact Information
              </Typography>
              <Typography>{selectedEmployee.email}</Typography>
              <Typography>{selectedEmployee.phoneNumber}</Typography>
            </div>
          </div>
          <div>
            <Typography variant="subtitle2" color="textSecondary">
              Current Projects
            </Typography>
            <div className="flex gap-1 flex-wrap mt-1">
              {selectedEmployee.currentProjects?.map((project, idx) => (
                <Chip key={idx} {...createProjectChip(project)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default EmployeeDetailsModal;
