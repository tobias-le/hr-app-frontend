import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ApiService from "../services/api.service"; // Import ApiService
import { TeamSummary, Team } from "../types/attendance"; // Import from the new location
import CircularProgress from "@mui/material/CircularProgress";

interface AttendanceSummaryProps {
  onTeamChange: (teamId: number) => void;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  onTeamChange,
}) => {
  const [teamId, setTeamId] = useState<number>(1);
  const [teams, setTeams] = useState<Team[]>([]);
  const [summaryData, setSummaryData] = useState<TeamSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    ApiService.getTeams()
      .then((data) => {
        setTeams(data);
        if (data.length > 0) {
          setTeamId(data[0].teamId);
        }
      })
      .catch((error) => console.error("Error fetching teams:", error));
  }, []);

  useEffect(() => {
    if (teamId) {
      setIsDisabled(true);
      onTeamChange(teamId);
      setSummaryLoading(true);
      setSummaryData(null);

      const timeoutId = setTimeout(() => {
        setIsDisabled(false);
      }, 5000);

      const fetchData = async () => {
        try {
          const data = await ApiService.getTeamAttendanceSummary(teamId);
          setSummaryData(data);
        } catch (error) {
          console.error("Error fetching summary data:", error);
        } finally {
          setSummaryLoading(false);
          setIsDisabled(false);
          clearTimeout(timeoutId);
        }
      };

      fetchData();

      return () => clearTimeout(timeoutId);
    }
  }, [teamId, onTeamChange]);

  //   const handleTeamChange = (event: any) => {
  //     setTeamId(event.target.value);
  //   };

  return (
    <>
      <FormControl fullWidth data-testid="team-select-container">
        <InputLabel data-testid="team-select-label">Select Team</InputLabel>
        <Select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value as number)}
          disabled={isDisabled}
          data-testid="team-select"
        >
          {teams.map((team) => (
            <MenuItem
              key={team.teamId}
              value={team.teamId}
              data-testid={`team-option-${team.teamId}`}
            >
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {summaryLoading ? (
        <div
          className="flex justify-center items-center h-64"
          data-testid="loading-spinner"
        >
          <CircularProgress />
        </div>
      ) : (
        summaryData && (
          <Grid container spacing={3} data-testid="summary-grid">
            <Grid item xs={12} md={4}>
              <Paper className="rounded-lg mt-5" data-testid="total-hours-card">
                <div className="p-4">
                  <Typography variant="subtitle1" className="text-gray-500">
                    Total Hours / Expected Hours
                  </Typography>
                  <Typography
                    variant="h4"
                    className="font-bold"
                    data-testid="total-hours-value"
                  >
                    {summaryData.totalHours} / {summaryData.expectedHours}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                className="rounded-lg mt-5"
                data-testid="average-hours-card"
              >
                <div className="p-4">
                  <Typography variant="subtitle1" className="text-gray-500">
                    Average Hours/Day
                  </Typography>
                  <Typography
                    variant="h4"
                    className="font-bold"
                    data-testid="average-hours-value"
                  >
                    {summaryData.averageHoursPerDay.toFixed(1)}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                className="rounded-lg mt-5"
                data-testid="attendance-rate-card"
              >
                <div className="p-4">
                  <Typography variant="subtitle1" className="text-gray-500">
                    Attendance Rate
                  </Typography>
                  <Typography
                    variant="h4"
                    className="font-bold"
                    data-testid="attendance-rate-value"
                  >
                    {summaryData.attendanceRate.toFixed(1)}%
                  </Typography>
                </div>
              </Paper>
            </Grid>
          </Grid>
        )
      )}
    </>
  );
};

export default AttendanceSummary;
