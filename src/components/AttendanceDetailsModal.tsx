import React from "react";
import { Button, Chip } from "@mui/material";
import { AttendanceRecord } from "../types/attendance";
import { createProjectChip } from "../utils/chipUtils";
import { DataTable } from "../components/common/DataTable";
import { BaseModal } from "./common/BaseModal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import dateUtils from "../utils/dateUtils";

interface AttendanceDetailsModalProps {
  open: boolean;
  onClose: () => void;
  details: AttendanceRecord[];
  loading: boolean;
}

const AttendanceDetailsModal: React.FC<AttendanceDetailsModalProps> = ({
  open,
  onClose,
  details,
  loading,
}) => {
  const columns = [
    {
      header: "Employee Name",
      accessor: (detail: AttendanceRecord) => detail.member,
      testId: "header-employee",
    },
    {
      header: "Date",
      accessor: (detail: AttendanceRecord) => dateUtils.formatDate(detail.date),
      testId: "header-date",
    },
    {
      header: "Clock In",
      accessor: (detail: AttendanceRecord) =>
        dateUtils.formatTime(detail.clockInTime),
      testId: "header-clock-in",
    },
    {
      header: "Clock Out",
      accessor: (detail: AttendanceRecord) =>
        dateUtils.formatTime(detail.clockOutTime),
      testId: "header-clock-out",
    },
    {
      header: "Project",
      accessor: (detail: AttendanceRecord) => (
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
