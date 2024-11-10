import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import Header from "../components/Header";
// import ApiService from "../services/api.service";
import { TimeOffSummary } from "../types/timeoff";
// import { TimeOffRequest } from "../types/timeoff";

const TimeOff: React.FC = () => {
  //   const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [summary, setSummary] = useState<TimeOffSummary | null>(null);
  //   const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API calls - replace with actual API calls
    const fetchData = async () => {
      try {
        // const requests = await ApiService.getTimeOffRequests();
        // const summary = await ApiService.getTimeOffSummary();
        // setRequests(requests);
        // setSummary(summary);

        // Mock data
        setSummary({
          vacationDaysLeft: 15,
          sickDaysLeft: 5,
          personalDaysLeft: 3,
          pendingRequests: 2,
        });
      } catch (error) {
        console.error("Error fetching time off data:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  //   const getStatusColor = (status: string) => {
  //     switch (status) {
  //       case "APPROVED":
  //         return "success";
  //       case "REJECTED":
  //         return "error";
  //       default:
  //         return "warning";
  //     }
  //   };

  return (
    <div
      className="flex flex-col h-screen bg-gray-100"
      data-testid="timeoff-container"
    >
      <Header />
      <Box className="flex-grow p-6">
        <Paper className="p-6">
          <Typography
            variant="h5"
            className="font-bold mb-6"
            data-testid="timeoff-title"
          >
            Time Off Management
          </Typography>

          {/* Summary Cards */}
          {summary && (
            <Grid
              container
              spacing={3}
              className="mb-6"
              data-testid="summary-cards"
            >
              <Grid item xs={12} md={3}>
                <Paper className="p-4" data-testid="vacation-days-card">
                  <Typography color="textSecondary">
                    Vacation Days Left
                  </Typography>
                  <Typography variant="h4">
                    {summary.vacationDaysLeft}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper className="p-4" data-testid="sick-days-card">
                  <Typography color="textSecondary">Sick Days Left</Typography>
                  <Typography variant="h4">{summary.sickDaysLeft}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper className="p-4" data-testid="personal-days-card">
                  <Typography color="textSecondary">
                    Personal Days Left
                  </Typography>
                  <Typography variant="h4">
                    {summary.personalDaysLeft}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper className="p-4" data-testid="pending-requests-card">
                  <Typography color="textSecondary">
                    Pending Requests
                  </Typography>
                  <Typography variant="h4">
                    {summary.pendingRequests}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Request Form */}
          <Paper className="p-6 mb-6">
            <Typography variant="h6" className="mb-4">
              New Time Off Request
            </Typography>
            <form className="space-y-4 mt-5" data-testid="timeoff-request-form">
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  data-testid="start-date-input"
                />
                <TextField
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  data-testid="end-date-input"
                />
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select label="Type" data-testid="leave-type-select">
                    <MenuItem value="VACATION" data-testid="vacation-option">
                      Vacation
                    </MenuItem>
                    <MenuItem value="SICK" data-testid="sick-option">
                      Sick Leave
                    </MenuItem>
                    <MenuItem value="PERSONAL" data-testid="personal-option">
                      Personal Leave
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Reason"
                  multiline
                  rows={4}
                  fullWidth
                  className="col-span-2"
                  data-testid="reason-input"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outlined" data-testid="cancel-button">
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  data-testid="submit-button"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </Paper>

          {/* Requests Table */}
          <Typography variant="h6" className="mb-4">
            Recent Requests
          </Typography>
          <TableContainer component={Paper} data-testid="requests-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow data-testid="request-row">
                  <TableCell>Vacation</TableCell>
                  <TableCell>2024-01-15</TableCell>
                  <TableCell>2024-01-20</TableCell>
                  <TableCell>Annual leave</TableCell>
                  <TableCell>
                    <Chip
                      label="PENDING"
                      color="warning"
                      size="small"
                      data-testid="status-chip"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
};

export default TimeOff;
