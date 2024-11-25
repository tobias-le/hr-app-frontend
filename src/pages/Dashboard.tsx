import React, { useState } from "react";
import { Typography, Button, TextField } from "@mui/material";
import EmployeeTable from "../components/EmployeeTable";
import { format, startOfWeek, addDays } from "date-fns";
import ApiService from "../services/api.service";
import { AttendanceRecord } from "../types/attendance";
import AttendanceDetailsModal from "../components/AttendanceDetailsModal";
import ProjectAttendanceSummary from "../components/ProjectAttendanceSummary";
import { PageLayout } from "../components/common/PageLayout";
import { useNavigate, Navigate } from "react-router-dom";
import { useEmployeeStore } from "../store/employeeStore";

const Dashboard: React.FC = () => {
  const currentEmployee = useEmployeeStore((state) => state.currentEmployee);
  const navigate = useNavigate();
  const [details, setDetails] = useState<AttendanceRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);

  if (!currentEmployee?.hr) {
    return <Navigate to="/work-time" replace />;
  }

  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const mondayDate = format(monday, "EEEE, d MMMM");
  const sundayDate = format(addDays(monday, 6), "EEEE, d MMMM");
  const weekDates = `${mondayDate} - ${sundayDate}`;

  const handleAttendanceReportClick = () => {
    setModalOpen(true);
    setDetailsLoading(true);
    ApiService.getProjectAttendanceDetails(selectedProjectId)
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

  return (
    <PageLayout title="Attendance">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
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
            onClick={() => navigate("/work-time")}
          >
            Add Attendance
          </Button>
        </div>
      </div>

      <ProjectAttendanceSummary
        onProjectChange={handleProjectChange}
        data-testid="project-attendance-summary"
      />

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
