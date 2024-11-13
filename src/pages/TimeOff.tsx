import React, { useState, useEffect } from "react";
import { Paper, Typography, Button, Grid, Chip } from "@mui/material";
// import ApiService from "../services/api.service";
import { TimeOffRequest, TimeOffSummary } from "../types/timeoff";
// import { TimeOffRequest } from "../types/timeoff";
import { DataTable } from "../components/common/DataTable";
import { FormField } from "../components/common/FormField";
import { SelectChangeEvent } from "@mui/material";
import { PageLayout } from "../components/common/PageLayout";

const TimeOff: React.FC = () => {
  // const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [summary, setSummary] = useState<TimeOffSummary | null>(null);
  //   const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    type: "",
    reason: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<any> | SelectChangeEvent<any>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "warning";
    }
  };

  const columns = [
    { header: "Type", accessor: "type" as keyof TimeOffRequest },
    { header: "Start Date", accessor: "startDate" as keyof TimeOffRequest },
    { header: "End Date", accessor: "endDate" as keyof TimeOffRequest },
    { header: "Reason", accessor: "reason" as keyof TimeOffRequest },
    {
      header: "Status",
      accessor: (request: TimeOffRequest) => (
        <Chip
          label={request.status}
          color={getStatusColor(request.status)}
          size="small"
          data-testid="status-chip"
        />
      ),
    },
  ];

  return (
    <PageLayout title="Time Off Management">
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
              <Typography color="textSecondary">Vacation Days Left</Typography>
              <Typography variant="h4">{summary.vacationDaysLeft}</Typography>
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
              <Typography color="textSecondary">Personal Days Left</Typography>
              <Typography variant="h4">{summary.personalDaysLeft}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper className="p-4" data-testid="pending-requests-card">
              <Typography color="textSecondary">Pending Requests</Typography>
              <Typography variant="h4">{summary.pendingRequests}</Typography>
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
          {/* Date Fields Row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              validateNotEmpty
              testId="start-date-input"
            />

            <FormField
              name="endDate"
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              validateNotEmpty
              testId="end-date-input"
            />
          </div>

          {/* Type Field Row */}
          <div className="w-full">
            <FormField
              name="type"
              label="Type"
              value={formData.type}
              onChange={handleInputChange}
              options={[
                { value: "VACATION", label: "Vacation" },
                { value: "SICK", label: "Sick Leave" },
                { value: "PERSONAL", label: "Personal Leave" },
              ]}
              required
              validateNotEmpty
              testId="leave-type-select"
            />
          </div>

          {/* Reason Field Row */}
          <div className="w-full">
            <FormField
              name="reason"
              label="Reason"
              value={formData.reason}
              onChange={handleInputChange}
              multiline
              rows={4}
              testId="reason-input"
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
      <DataTable
        data={[]}
        columns={columns}
        emptyMessage="No time off requests found"
        testId="requests-table"
      />
    </PageLayout>
  );
};

export default TimeOff;
