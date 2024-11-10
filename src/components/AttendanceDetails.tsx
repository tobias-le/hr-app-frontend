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

const AttendanceDetails: React.FC = () => {
  const [details, setDetails] = useState<AttendanceDetail[]>([]);

  useEffect(() => {
    ApiService.getAttendanceDetails()
      .then((data) => setDetails(data))
      .catch((error) =>
        console.error("Error fetching attendance details:", error)
      );
  }, []);

  return (
    <TableContainer component={Paper} data-testid="attendance-table-container">
      <Table data-testid="attendance-table">
        <TableHead>
          <TableRow>
            <TableCell data-testid="header-employee-name">
              Employee Name
            </TableCell>
            <TableCell data-testid="header-date">Date</TableCell>
            <TableCell data-testid="header-present">Present</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((detail) => (
            <TableRow
              key={detail.id}
              data-testid={`attendance-row-${detail.id}`}
            >
              <TableCell data-testid={`employee-name-${detail.id}`}>
                {detail.employeeName}
              </TableCell>
              <TableCell data-testid={`date-${detail.id}`}>
                {detail.date}
              </TableCell>
              <TableCell data-testid={`present-${detail.id}`}>
                {detail.present ? "Yes" : "No"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceDetails;
