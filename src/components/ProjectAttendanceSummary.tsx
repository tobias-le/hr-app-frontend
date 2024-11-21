import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import ApiService from "../services/api.service";
import { AttendanceSummaryType } from "../types/attendance";
import { useProjectStore } from "../store/projectStore";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { startOfWeek, endOfWeek, format } from "date-fns";

interface ProjectAttendanceSummaryProps {
  onProjectChange: (projectId: number) => void;
}

const ProjectAttendanceSummary: React.FC<ProjectAttendanceSummaryProps> = ({
  onProjectChange,
}) => {
  const { projects, selectedProject, fetchProjects, setSelectedProject } =
    useProjectStore();
  const [summaryData, setSummaryData] = useState<AttendanceSummaryType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
    format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd")
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    setLoading(true);
    if (selectedProject) {
      ApiService.getAttendanceSummaryType(
        selectedProject.projectId,
        startDate,
        endDate
      )
        .then((data) => setSummaryData(data))
        .catch((error) => {
          console.error("Error fetching project summary:", error);
          setSummaryData(null);
        })
        .finally(() => setLoading(false));
      onProjectChange(selectedProject.projectId);
    } else {
      setLoading(false);
    }
  }, [selectedProject, startDate, endDate, onProjectChange]);

  const handleProjectChange = (event: SelectChangeEvent) => {
    const project = projects.find(
      (p) => p.projectId.toString() === event.target.value
    );
    setSelectedProject(project || null);
  };

  return (
    <Box data-testid="project-summary-container">
      <FormControl fullWidth className="mb-4">
        <InputLabel>Project</InputLabel>
        <Select
          value={selectedProject ? selectedProject.projectId.toString() : ""}
          label="Project"
          onChange={handleProjectChange}
          data-testid="project-select"
        >
          {projects.map((project) => (
            <MenuItem
              key={project.projectId}
              value={project.projectId.toString()}
              data-testid={`project-option-${project.projectId}`}
            >
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2} className="mb-4">
        <Grid item xs={6}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {loading ? (
        <LoadingSpinner testId="summary-loading" />
      ) : (
        summaryData && (
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Paper
                elevation={1}
                className="p-4"
                data-testid="total-hours-card"
              >
                <Typography variant="subtitle1">Total Hours</Typography>
                <Typography variant="h4">{summaryData.totalHours}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper
                elevation={1}
                className="p-4"
                data-testid="expected-hours-card"
              >
                <Typography variant="subtitle1">Expected Hours</Typography>
                <Typography variant="h4">
                  {summaryData.expectedHours}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper
                elevation={1}
                className="p-4"
                data-testid="average-hours-card"
              >
                <Typography variant="subtitle1">Avg Hours/Day</Typography>
                <Typography variant="h4">
                  {summaryData.averageHoursPerDay}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper
                elevation={1}
                className="p-4"
                data-testid="attendance-rate-card"
              >
                <Typography variant="subtitle1">Attendance Rate</Typography>
                <Typography variant="h4">
                  {summaryData.attendanceRate.toFixed(1)}%
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )
      )}
    </Box>
  );
};

export default ProjectAttendanceSummary;
