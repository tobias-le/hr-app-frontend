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
} from "@mui/material";
import ApiService from "../services/api.service";
import { AttendanceSummaryType } from "../types/attendance";
import { useProjectStore } from "../store/projectStore";

interface ProjectAttendanceSummaryProps {
  onProjectChange: (projectId: number) => void;
}

const ProjectAttendanceSummary: React.FC<ProjectAttendanceSummaryProps> = ({
  onProjectChange,
}) => {
  const { projects, selectedProject, fetchProjects, setSelectedProject } =
    useProjectStore();
  const [summaryData, setSummaryData] = useState<AttendanceSummaryType>({
    teamName: "",
    totalHours: 0,
    expectedHours: 0,
    averageHoursPerDay: 0,
    attendanceRate: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProject) {
      ApiService.getAttendanceSummaryType(selectedProject.projectId)
        .then((data) => setSummaryData(data))
        .catch((error) =>
          console.error("Error fetching project summary:", error)
        );
      onProjectChange(selectedProject.projectId);
    }
  }, [selectedProject, onProjectChange]);

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

      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper className="p-4" data-testid="total-hours-card">
            <Typography color="textSecondary">Total Hours</Typography>
            <Typography variant="h4">{summaryData.totalHours}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className="p-4" data-testid="expected-hours-card">
            <Typography color="textSecondary">Expected Hours</Typography>
            <Typography variant="h4">{summaryData.expectedHours}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className="p-4" data-testid="average-hours-card">
            <Typography color="textSecondary">Avg Hours/Day</Typography>
            <Typography variant="h4">
              {summaryData.averageHoursPerDay}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className="p-4" data-testid="attendance-rate-card">
            <Typography color="textSecondary">Attendance Rate</Typography>
            <Typography variant="h4">
              {summaryData.attendanceRate.toFixed(1)}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectAttendanceSummary;
