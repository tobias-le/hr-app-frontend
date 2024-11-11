import React, {useEffect, useState} from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Header from "./Header";
import {EmployeeLeaveBalance, Leave, LeaveStatus, LeaveType} from "../types/timeoff";
import CircularProgress from "@mui/material/CircularProgress";
import ApiService from "../services/api.service";

function calculateDaysBetween (date1: Date, date2: Date): number {
  return Math.round((date1.getTime() - date2.getTime())/(3600*1000*24))+1;
}

const TimeOff: React.FC = () => {

  // summary of users remaining time off, fetched
  const [summary, setSummary] = useState<EmployeeLeaveBalance | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [daysBetween, setDaysBetween] = useState<number>(0);

  //leave request form variables
  const[formLocked,setFormLocked] = useState(false);

  const [startDate, setStartDate] = useState<string>("");
  const updateStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  }
  const [startDateInValid, setStartDateInvalid] = useState<string |  null>(null);

  const [endDate, setEndDate] = useState<string>("");
  const updateEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  }
  const [endDateInvalid, setEndDateInvalid] = useState<string | null>(null);

  const [requestType, setRequestType] = useState<LeaveType>(LeaveType.Sick);
  const updateRequestType = (event: SelectChangeEvent) => {
    setRequestType(event.target.value as LeaveType);
  }

  const [description, setDescription] = useState<string>("");
  const updateDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }

  //users recent requests, fetched
  const [requests, setRequests] = useState<Leave[]>([]);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  //submitting form, checks for required fields
  const submitRequestForm = (event : React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (requestType && !startDateInValid && !endDateInvalid) {
      if (startDate==="" || endDate==="") {
        if (startDate==="") {
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
        employeeId:1,  //later replace with currently signed in employee id
        leaveAmount: calculateDaysBetween(new Date(endDate), new Date(startDate))*8,
        reason: description
      }
      console.log(request);
      setFormLocked(true);
      ApiService.createNewTimeOffRequest(request).then(
        createdRequest => {
          setRequests(prevState => {
            prevState.push(createdRequest);
            return prevState;
          })
          resetInput();
          setFormLocked(false);
        }).catch(error =>
          alert("We had problem with creating new request")
      );
    }
  }

  //resets forms input
  const resetInput = () => {
    setDaysBetween(0);
    setStartDate("");
    setEndDate("");
    setStartDateInvalid(null);
    setEndDateInvalid(null);
    setDescription("");
  }

  //loads data on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        ApiService.getRecentTimeOffRequests()
            .then( reqs => setRequests(reqs))
            .catch(error => {
              setRequestsError("Failed to load your requests");
              setRequests([]);
            });
        ApiService.getTimeOffSummary()
            .then( sum => setSummary(sum))
            .catch(error => {
              setSummaryError("Failed to load you vacations");
              setSummary({
                personalDaysLeft:0,
                vacationDaysLeft:0,
                sickDaysLeft:0,
                id:0,
                employeeId:null
              })
            });
      } catch (error) {
        console.error("Error fetching time off data:", error);
      }
    };
    fetchData();
  }, []);

  //reacts to change of type or start date and validates that date is correct/valid
  useEffect(() => {
    const updatedDate= new Date(startDate);
    const today = new Date();
    today.setHours(0,0,0);
    if (requestType === LeaveType.Sick) {
        if (calculateDaysBetween(today, updatedDate) >7) {
          setStartDateInvalid("Log sick days max 7 days back");
        } else {
          setStartDateInvalid(null);
        }
    } else {
        if (calculateDaysBetween(today, updatedDate) > 0) {
          setStartDateInvalid("You must ask for time-off atleast day before")
        } else {
          setStartDateInvalid(null);
        }
    }
  }, [requestType, startDate]);


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
  }, [startDate,endDate]);

  //returns color in which chip is displayed
  const getStatusColor = (status: LeaveStatus) => {
       switch (status) {
         case LeaveStatus.Approved:
           return "success";
         case LeaveStatus.Rejected:
           return "error";
         default:
           return "warning";
       }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <Box className="flex-grow p-6">
        <Paper className="p-6">
          <Typography variant="h5" className="font-bold mb-6">
            Time Off Management
          </Typography>

          {summaryError?
              <Alert severity="error">{summaryError}</Alert>
              :
              null
          }

          {/* Summary Cards */}
          <Grid container spacing={3} className="mb-6">
              <Grid item xs={12} md={3}>
                <Paper className="p-4">
                  <Typography color="textSecondary">
                    Vacation Days Left
                  </Typography>
                  {summary?
                      <Grid container columns={2} sx={{gap:"10px"}}>
                        <Typography variant="h4">
                          {summary.vacationDaysLeft}
                        </Typography>
                        {(requestType===LeaveType.Vacation && daysBetween>0)?
                            <Typography variant="h4" sx={{color: summary.vacationDaysLeft-daysBetween>=0? "#1976d2" : "red"}}>
                              ↓{summary.vacationDaysLeft - daysBetween}
                            </Typography> :
                            null
                        }
                      </Grid>:
                      <CircularProgress/>
                  }
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper className="p-4">
                  <Typography color="textSecondary">
                    Sick Days Left
                  </Typography>
                  {summary?
                      <Grid container columns={2} sx={{gap:"10px"}}>
                        <Typography variant="h4">
                          {summary.sickDaysLeft}
                        </Typography>
                        {(requestType===LeaveType.Sick && daysBetween>0)?
                            <Typography variant="h4" sx={{color: summary.vacationDaysLeft-daysBetween>=0? "#1976d2" : "red"}} >
                              ↓{summary.sickDaysLeft - daysBetween}
                            </Typography> :
                            null
                        }
                      </Grid>:
                      <CircularProgress/>
                  }
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper className="p-4">
                  <Typography color="textSecondary">
                    Personal Days Left
                  </Typography>
                  {summary?
                      <Grid container columns={2} sx={{gap:"10px"}}>
                        <Typography variant="h4">
                          {summary.personalDaysLeft}
                        </Typography>
                        {(requestType===LeaveType.Personal && daysBetween>0)?
                            <Typography variant="h4" sx={{color: summary.vacationDaysLeft-daysBetween>=0? "#1976d2" : "red"}} >
                              ↓{summary.personalDaysLeft - daysBetween}
                            </Typography> :
                            null
                        }
                      </Grid>:
                      <CircularProgress/>
                  }
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper className="p-4">
                  <Typography color="textSecondary">
                    Pending Requests
                  </Typography>
                  {requests?
                      <Typography variant="h4">
                        {requests.filter(req => {return req.status===LeaveStatus.Pending}).length}
                      </Typography> :
                      <CircularProgress/>}
                </Paper>
              </Grid>
          </Grid>

          {/* Request Form */}
          <Paper className="p-6 mb-6">
            <Typography variant="h6" className="mb-4">
              New Time Off Request
            </Typography>
            <form className="space-y-4 mt-5" onSubmit={submitRequestForm}>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                    error={!!startDateInValid}
                    helperText={startDateInValid}
                  label="Start Date"
                  type="date"
                  onChange={updateStartDate}
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  fullWidth
                />
                <TextField
                  label="End Date (included)"
                  type="date"
                  onChange={updateEndDate}
                  error={!!endDateInvalid}
                  helperText={endDateInvalid}
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select label="Type" onChange={updateRequestType} value={requestType}>
                    <MenuItem value={LeaveType.Vacation} selected={requestType===LeaveType.Vacation}>Vacation</MenuItem>
                    <MenuItem value={LeaveType.Sick} selected={requestType===LeaveType.Sick}>Sick Leave</MenuItem>
                    <MenuItem value={LeaveType.Personal} selected={requestType===LeaveType.Personal}>Personal Leave</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Reason"
                  multiline
                  rows={4}
                  fullWidth
                  className="col-span-2"
                  value={description}
                  onChange={updateDescription}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outlined" onClick={resetInput}>Cancel</Button>
                <Button variant="contained" color="primary" type="submit" disabled={formLocked}>
                  Submit Request
                  {formLocked? <CircularProgress/>:null}
                </Button>
              </div>
            </form>
          </Paper>

          {/* Requests Table */}
          <Typography variant="h6" className="mb-4">
            Recent Requests
          </Typography>
          <TableContainer component={Paper}>
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

              {requests.length>0?
                <TableBody>
                  {requests.map(request => (
                  <TableRow>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>{request.startDate}</TableCell>
                    <TableCell>{request.endDate}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <Chip label={request.status} color={getStatusColor(request.status)} size="small" />
                    </TableCell>
                  </TableRow>))}
                </TableBody> :
                  <>
                    <TableBody/>
                    <Alert severity={requestsError? "error": "info"}>{requestsError? requestsError : "Nothing to show"}</Alert>
                  </>
              }
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
};

export default TimeOff;
