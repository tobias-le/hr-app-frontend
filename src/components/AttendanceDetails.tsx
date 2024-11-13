import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ApiService from "../services/api.service";
import { AttendanceDetail } from "../types/attendance";
import { DataTable } from "./common/DataTable";

const AttendanceDetails: React.FC = () => {
  const [details, setDetails] = useState<AttendanceDetail[]>([]);

  useEffect(() => {
    ApiService.getAttendanceDetails()
      .then((data) => setDetails(data))
      .catch((error) =>
        console.error("Error fetching attendance details:", error)
      );
  }, []);

  const columns = [
    {
      header: "Employee Name",
      accessor: "employeeName" as keyof AttendanceDetail,
      testId: "header-employee-name",
    },
    {
      header: "Date",
      accessor: "date" as keyof AttendanceDetail,
      testId: "header-date",
    },
    {
      header: "Present",
      accessor: (detail: AttendanceDetail) => (detail.present ? "Yes" : "No"),
      testId: "header-present",
    },
  ];

  return (
    <DataTable
      data={details}
      columns={columns}
      emptyMessage="No records found this week"
      testId="attendance-table"
    />
  );
};

export default AttendanceDetails;
