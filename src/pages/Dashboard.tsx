import React, { useState } from "react";
import { Box, Paper, Typography, Button, TextField } from "@mui/material";
import AttendanceSummary from "../components/AttendanceSummary";
import EmployeeTable from "../components/EmployeeTable";
import { format, startOfWeek, addDays } from "date-fns";
import ApiService from "../services/api.service";
import { TeamAttendanceDetail } from "../types/attendance";
import AttendanceDetailsModal from "../components/AttendanceDetailsModal";
import Header from "../components/Header"; // Import the new Header component

const Dashboard: React.FC = () => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const mondayDate = format(monday, "EEEE, d MMMM");
  const sundayDate = format(addDays(monday, 6), "EEEE, d MMMM");
  const weekDates = `${mondayDate} - ${sundayDate}`;

  const [details, setDetails] = useState<TeamAttendanceDetail[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number>(1);

  const handleAttendanceReportClick = () => {
    setModalOpen(true);
    setDetailsLoading(true);
    ApiService.getTeamAttendanceDetails(selectedTeamId)
      .then((data) => {
        setDetails(data);
      })
      .catch((error) =>
        console.error("Error fetching attendance details:", error)
      )
      .finally(() => setDetailsLoading(false));
  };

  const handleTeamChange = (teamId: number) => {
    setSelectedTeamId(teamId);
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-100"
      data-testid="dashboard-container"
    >
      <Header />
      <Box className="flex-grow p-6">
        <Paper className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Typography
                variant="h5"
                className="font-bold"
                data-testid="attendance-title"
              >
                Attendance
              </Typography>
              <Typography data-testid="week-dates">{weekDates}</Typography>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outlined"
                onClick={handleAttendanceReportClick}
                data-testid="attendance-report-btn"
              >
                Attendance Report
              </Button>
              <Button
                variant="outlined"
                className="addAttendance"
                data-testid="add-attendance-btn"
              >
                Add Attendance
              </Button>
            </div>
          </div>

          <AttendanceSummary onTeamChange={handleTeamChange} />

          <div className="mt-6 flex space-x-4">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search employee"
              className="flex-grow"
              data-testid="employee-search"
            />
            <Button variant="outlined" data-testid="date-range-btn">
              Date Range
            </Button>
            <Button variant="outlined" data-testid="advance-filter-btn">
              Advance Filter
            </Button>
          </div>

          <EmployeeTable teamId={selectedTeamId} />

          <AttendanceDetailsModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            details={details}
            loading={detailsLoading}
            data-testid="attendance-details-modal"
          />
        </Paper>
      </Box>
    </div>
  );
};

export default Dashboard;
