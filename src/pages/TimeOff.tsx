import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Grid,
  Paper,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  EmployeeLeaveBalance,
  Leave,
  LeaveStatus,
  LeaveType,
} from "../types/timeoff";
import CircularProgress from "@mui/material/CircularProgress";
import ApiService from "../services/api.service";
import { useEmployeeStore } from "../store/employeeStore";
import { DataTable } from "../components/common/DataTable";
import { PageLayout } from "../components/common/PageLayout";
import { FormField } from "../components/common/FormField";
import {getStatusColor} from "../utils/colorUtils";
import RequestModal from "../components/RequestModal";
import {useSnackbarStore} from "../components/GlobalSnackbar";

function calculateDaysBetween(date1: Date, date2: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const timeDiff = date1.getTime() - date2.getTime();
  return Math.round(timeDiff / MS_PER_DAY) + 1;
}

const useTimeOffForm = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [requestType, setRequestType] = useState<LeaveType>(LeaveType.Vacation);
  const [description, setDescription] = useState<string>("");
  const [formLocked, setFormLocked] = useState(false);
  const [startDateInValid, setStartDateInvalid] = useState<string | null>(null);
  const [endDateInvalid, setEndDateInvalid] = useState<string | null>(null);

  const updateStartDate = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<any>
  ) => setStartDate(event.target.value);
  const updateEndDate = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<any>
  ) => setEndDate(event.target.value);
  const updateRequestType = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<any>
  ) => setRequestType(event.target.value as LeaveType);
  const updateDescription = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<any>
  ) => setDescription(event.target.value);

  return {
    startDate,
    endDate,
    requestType,
    description,
    formLocked,
    startDateInValid,
    endDateInvalid,
    setStartDateInvalid,
    setEndDateInvalid,
    setFormLocked,
    updateStartDate,
    updateEndDate,
    updateRequestType,
    updateDescription,
    setStartDate,
    setEndDate,
    setDescription,
  };
};

const TimeOff: React.FC = () => {
  // summary of users remaining time off, fetched
  const [summary, setSummary] = useState<EmployeeLeaveBalance | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [daysBetween, setDaysBetween] = useState<number>(0);

  //leave request form variables
  const {
    startDate,
    endDate,
    requestType,
    description,
    formLocked,
    startDateInValid,
    endDateInvalid,
    setStartDateInvalid,
    setEndDateInvalid,
    setFormLocked,
    updateStartDate,
    updateEndDate,
    updateRequestType,
    updateDescription,
    setStartDate,
    setEndDate,
    setDescription,
  } = useTimeOffForm();

  //users recent requests, fetched
  const [requests, setRequests] = useState<Leave[]>([]);
  const employee = useEmployeeStore((state) => state.currentEmployee);
  const [currentRequest, setCurrentRequest] = useState<Leave | null>(null);

  const {showMessage} = useSnackbarStore();


  //submitting form, checks for required fields
  const submitRequestForm = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!startDateInValid && !endDateInvalid && employee) {
      if (startDate === "" || endDate === "") {
        if (startDate === "") {
          setStartDateInvalid("you must insert a date");
        } else {
          setEndDateInvalid("you must insert a date");
        }
        return;
      }
      const request = {
        startDate: startDate,
        endDate: endDate,
        leaveType: requestType,
        leaveStatus: LeaveStatus.Pending,
        leaveAmount:
          calculateDaysBetween(new Date(endDate), new Date(startDate)), //budeme brát leaveAmount po dnech
        employeeId: employee.id,
        reason: description,
      };
      setFormLocked(true);
      ApiService.createNewTimeOffRequest(request)
        .then((createdRequest) => {
          setRequests((prevState) => {
            prevState.push(createdRequest);
            return prevState;
          });
          resetInput();
          setFormLocked(false);
          showMessage("Request successfully sent");
        })
        .catch((error) => alert("We had problem with creating new request"));
    }
  };

  //resets forms input
  const resetInput = () => {
    setDaysBetween(0);
    setStartDate("");
    setEndDate("");
    setStartDateInvalid(null);
    setEndDateInvalid(null);
    setDescription("");
  };

  //loads data on page load and employee change
  useEffect(() => {
    setSummary(null);
    setSummaryError(null);
    setRequests([]);
    try {
      ApiService.getRecentTimeOffRequests(employee ? employee.id : 0)
        .then((reqs) => setRequests(reqs))
        .catch((error) => {
          setRequests([]);
        });
      ApiService.getTimeOffSummary(employee ? employee.id : 0)
        .then((sum) => setSummary(sum))
        .catch((error) => {
          setSummaryError("Failed to load you vacations");
          setSummary({
            personalDaysLeft: 0,
            vacationDaysLeft: 0,
            sickDaysLeft: 0,
            id: 0,
            employeeId: null,
          });
        });
    } catch (error) {
      console.error("Error fetching time off data:", error);
    }
  }, [employee]);

  //reacts to change of type or start date and validates that date is correct/valid
  useEffect(() => {
    const updatedDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0);
    if (requestType === LeaveType.Sick) {
      if (calculateDaysBetween(today, updatedDate) > 7) {
        setStartDateInvalid("Log sick days max 7 days back");
      } else {
        setStartDateInvalid(null);
      }
    } else {
      if (calculateDaysBetween(today, updatedDate) > 0) {
        setStartDateInvalid("You must ask for time-off atleast day before");
      } else {
        setStartDateInvalid(null);
      }
    }
  }, [requestType, startDate, setStartDateInvalid]);

  //if end date changes, checks if it's later than start date and alerts user if necessary
  useEffect(() => {
    const endDateAsDate = new Date(endDate);
    const startDateAsDate = new Date(startDate);

    if (startDateAsDate > endDateAsDate) {
      setEndDateInvalid("End Date must be atleast the same day as start day");
    } else {
      setEndDateInvalid(null);
      setDaysBetween(calculateDaysBetween(endDateAsDate, startDateAsDate));
    }
  }, [startDate, endDate, setEndDateInvalid]);

  const columns = [
    { header: "Type", accessor: "leaveType" as keyof Leave },
    { header: "Start Date", accessor: "startDate" as keyof Leave },
    { header: "End Date", accessor: "endDate" as keyof Leave },
    { header: "Reason", accessor: "reason" as keyof Leave },
    {
      header: "Status",
      accessor: (request: Leave) => (
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
    <PageLayout data-testid="timeoff-container" title="Time Off Management">
      {summaryError ? <Alert severity="error">{summaryError}</Alert> : null}
      {/* Summary Cards */}
      <Grid container spacing={3} className="mb-6" data-testid="summary-cards">
        <Grid item xs={12} md={3}>
          <Paper className="p-4" data-testid="vacation-days-card">
            <Typography color="textSecondary">Vacation Days Left</Typography>
            {summary ? (
              <Grid container columns={2} sx={{ gap: "10px" }}>
                <Typography variant="h4">{summary.vacationDaysLeft}</Typography>
                {requestType === LeaveType.Vacation && daysBetween > 0 ? (
                  <Typography
                    variant="h4"
                    color={
                      summary.vacationDaysLeft - daysBetween >= 0
                        ? "success"
                        : "error"
                    }
                  >
                    ↓{summary.vacationDaysLeft - daysBetween}
                  </Typography>
                ) : null}
              </Grid>
            ) : (
              <CircularProgress />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper className="p-4" data-testid="sick-days-card">
            <Typography color="textSecondary">Sick Days Left</Typography>
            {summary ? (
              <Grid container columns={2} sx={{ gap: "10px" }}>
                <Typography variant="h4">{summary.sickDaysLeft}</Typography>
                {requestType === LeaveType.Sick && daysBetween > 0 ? (
                  <Typography
                    variant="h4"
                    color={
                      summary.sickDaysLeft - daysBetween >= 0
                        ? "success"
                        : "error"
                    }
                  >
                    ↓{summary.sickDaysLeft - daysBetween}
                  </Typography>
                ) : null}
              </Grid>
            ) : (
              <CircularProgress />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper className="p-4" data-testid="personal-days-card">
            <Typography color="textSecondary">Personal Days Left</Typography>
            {summary ? (
              <Grid container columns={2} sx={{ gap: "10px" }}>
                <Typography variant="h4">{summary.personalDaysLeft}</Typography>
                {requestType === LeaveType.Personal && daysBetween > 0 ? (
                  <Typography
                    variant="h4"
                    color={
                      summary.personalDaysLeft - daysBetween >= 0
                        ? "success"
                        : "error"
                    }
                  >
                    ↓{summary.personalDaysLeft - daysBetween}
                  </Typography>
                ) : null}
              </Grid>
            ) : (
              <CircularProgress />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper className="p-4" data-testid="pending-requests-card">
            <Typography color="textSecondary">Pending Requests</Typography>
            {requests ? (
              <Typography variant="h4">
                {
                  requests.filter((req) => {
                    return req.status === LeaveStatus.Pending;
                  }).length
                }
              </Typography>
            ) : (
              <CircularProgress />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Request Form */}
      <Paper className="p-6 mb-6">
        <Typography variant="h6" className="mb-4">
          New Time Off Request
        </Typography>
        <form
          className="space-y-4 mt-5"
          onSubmit={submitRequestForm}
          data-testid="timeoff-request-form"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="startDate"
              error={!!startDateInValid}
              helperText={startDateInValid}
              data-testid="start-date-input"
              label="Start Date"
              type="date"
              onChange={updateStartDate}
              value={startDate}
            />
            <FormField
              name="endDate"
              label="End Date (included)"
              type="date"
              data-testid="end-date-input"
              onChange={updateEndDate}
              error={!!endDateInvalid}
              helperText={endDateInvalid}
              value={endDate}
            />
          </div>
          <div className="w-full">
            <FormField
              name="type"
              label="Type"
              onChange={updateRequestType}
              value={requestType}
              data-testid="leave-type-select"
              options={[
                {
                  value: LeaveType.Vacation,
                  label: "Vacation",
                },
                {
                  value: LeaveType.Sick,
                  label: "Sick Leave",
                },
                {
                  value: LeaveType.Personal,
                  label: "Personal Leave",
                },
              ]}
            />
          </div>
          <div className="w-full">
            <FormField
                data-testid="reason-input"
              name="reason"
              label="Reason"
              multiline
              rows={4}
              className="col-span-2"
              value={description}
              onChange={updateDescription}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outlined"
              onClick={resetInput}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={formLocked}
              data-testid="submit-button"
            >
              Submit Request
              {formLocked ? <CircularProgress /> : null}
            </Button>
          </div>
        </form>
      </Paper>

      {/* Requests Table */}
      <Typography variant="h6" className="mb-4">
        Recent Requests
      </Typography>
      <DataTable
        data={requests}
        columns={columns}
        emptyMessage="Nothing to show"
        testId="requests-table"
        onRowClick={(item)=> setCurrentRequest(item)}
      />
        <RequestModal onClose={() => setCurrentRequest(null)} request={currentRequest}/>
    </PageLayout>
  );
};

export default TimeOff;
