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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Present</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((detail) => (
            <TableRow key={detail.id}>
              <TableCell>{detail.employeeName}</TableCell>
              <TableCell>{detail.date}</TableCell>
              <TableCell>{detail.present ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceDetails;
