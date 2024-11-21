import React, { useState } from "react";
import { Typography, Button, TextField } from "@mui/material";
import EmployeeTable from "../components/EmployeeTable";
import { format, startOfWeek, addDays, endOfWeek } from "date-fns";
import ApiService from "../services/api.service";
import { AttendanceRecord } from "../types/attendance";
import AttendanceDetailsModal from "../components/AttendanceDetailsModal";
import ProjectAttendanceSummary from "../components/ProjectAttendanceSummary";
import { PageLayout } from "../components/common/PageLayout";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [details, setDetails] = useState<AttendanceRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const [startDate, setStartDate] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
    format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [dateRangeText, setDateRangeText] = useState(() => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const mondayDate = format(monday, "EEEE, d MMMM");
    const sundayDate = format(addDays(monday, 6), "EEEE, d MMMM");
    return `${mondayDate} - ${sundayDate}`;
  });

  const handleAttendanceReportClick = () => {
    setModalOpen(true);
    setDetailsLoading(true);
    ApiService.getProjectAttendanceDetails(
      selectedProjectId,
      startDate,
      endDate
    )
      .then((data) => {
        setDetails(data);
      })
      .catch((error) =>
        console.error("Error fetching attendance details:", error)
      )
      .finally(() => setDetailsLoading(false));
  };

  const handleProjectChange = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    updateDateRangeText(newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    updateDateRangeText(startDate, newEndDate);
  };

  const updateDateRangeText = (start: string, end: string) => {
    const startDateText = format(new Date(start), "EEEE, d MMMM");
    const endDateText = format(new Date(end), "EEEE, d MMMM");
    setDateRangeText(`${startDateText} - ${endDateText}`);
  };

  return (
    <PageLayout title="Attendance">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Typography data-testid="week-dates">{dateRangeText}</Typography>
        </div>
        <div className="flex space-x-4">
          <TextField
            type="date"
            size="small"
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            data-testid="start-date-input"
          />
          <TextField
            type="date"
            size="small"
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            data-testid="end-date-input"
          />
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
            onClick={() => navigate("/work-time")}
          >
            Add Attendance
          </Button>
        </div>
      </div>

      <ProjectAttendanceSummary
        onProjectChange={handleProjectChange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        data-testid="project-attendance-summary"
      />

      <div className="mt-6 flex space-x-4">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search employee"
          className="flex-grow"
          data-testid="employee-search"
        />
        <Button variant="outlined" data-testid="advance-filter-btn">
          Advance Filter
        </Button>
      </div>

      <EmployeeTable projectId={selectedProjectId} />

      <AttendanceDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        details={details}
        loading={detailsLoading}
        data-testid="attendance-details-modal"
      />
    </PageLayout>
  );
};

export default Dashboard;
