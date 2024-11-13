import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { TeamAttendanceDetail } from "../types/attendance";
import CircularProgress from "@mui/material/CircularProgress";
import { createProjectChip } from "../utils/chipUtils";

interface AttendanceDetailsModalProps {
  open: boolean;
  onClose: () => void;
  details: TeamAttendanceDetail[];
  loading: boolean;
}

const AttendanceDetailsModal: React.FC<AttendanceDetailsModalProps> = ({
  open,
  onClose,
  details,
  loading,
}) => {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      data-testid="attendance-details-modal"
    >
      <DialogTitle data-testid="modal-title">
        Team Attendance Details
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <div
            className="flex justify-center p-4"
            data-testid="loading-spinner"
          >
            <CircularProgress />
          </div>
        ) : details.length === 0 ? (
          <div
            className="flex justify-center p-4 text-gray-500"
            data-testid="no-records-message"
          >
            No records for this week
          </div>
        ) : (
          <TableContainer
            component={Paper}
            data-testid="attendance-details-table"
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell data-testid="header-employee">
                    Employee Name
                  </TableCell>
                  <TableCell data-testid="header-date">Date</TableCell>
                  <TableCell data-testid="header-clock-in">Clock In</TableCell>
                  <TableCell data-testid="header-clock-out">
                    Clock Out
                  </TableCell>
                  <TableCell data-testid="header-project">Project</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.map((detail) => (
                  <TableRow
                    key={detail.attendanceId}
                    data-testid={`attendance-row-${detail.attendanceId}`}
                  >
                    <TableCell data-testid={`employee-${detail.attendanceId}`}>
                      {detail.member}
                    </TableCell>
                    <TableCell data-testid={`date-${detail.attendanceId}`}>
                      {new Date(detail.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell data-testid={`clock-in-${detail.attendanceId}`}>
                      {formatDateTime(detail.clockInTime)}
                    </TableCell>
                    <TableCell data-testid={`clock-out-${detail.attendanceId}`}>
                      {formatDateTime(detail.clockOutTime)}
                    </TableCell>
                    <TableCell data-testid={`project-${detail.attendanceId}`}>
                      <Chip {...createProjectChip(detail.project)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" data-testid="close-button">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceDetailsModal;
