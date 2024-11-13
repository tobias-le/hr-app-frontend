import React from "react";
import { Button, Chip } from "@mui/material";
import { TeamAttendanceDetail } from "../types/attendance";
import { createProjectChip } from "../utils/chipUtils";
import { DataTable } from "../components/common/DataTable";
import { BaseModal } from "./common/BaseModal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

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

  const columns = [
    {
      header: "Employee Name",
      accessor: (detail: TeamAttendanceDetail) => detail.member,
      testId: "header-employee",
    },
    {
      header: "Date",
      accessor: (detail: TeamAttendanceDetail) =>
        new Date(detail.date).toLocaleDateString(),
      testId: "header-date",
    },
    {
      header: "Clock In",
      accessor: (detail: TeamAttendanceDetail) =>
        formatDateTime(detail.clockInTime),
      testId: "header-clock-in",
    },
    {
      header: "Clock Out",
      accessor: (detail: TeamAttendanceDetail) =>
        formatDateTime(detail.clockOutTime),
      testId: "header-clock-out",
    },
    {
      header: "Project",
      accessor: (detail: TeamAttendanceDetail) => (
        <Chip {...createProjectChip(detail.project)} />
      ),
      testId: "header-project",
    },
  ];

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Team Attendance Details"
      maxWidth="md"
      testId="attendance-details-modal"
      actions={
        <Button onClick={onClose} color="primary" data-testid="close-button">
          Close
        </Button>
      }
    >
      <DataTable
        data={details}
        columns={columns}
        loading={loading}
        emptyMessage="No records for this week"
        testId="attendance-details-table"
      />
      {loading && <LoadingSpinner testId="details-loading" />}
    </BaseModal>
  );
};

export default AttendanceDetailsModal;
