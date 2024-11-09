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
  const [startDateInValid, setStartDateInvalid] = useState<string |  null>(null);

  const [endDate, setEndDate] = useState<string>("");
  const [endDateInvalid, setEndDateInvalid] = useState<string | null>(null);

  const [requestType, setRequestType] = useState<LeaveType>(LeaveType.Sick);
  const [description, setDescription] = useState<string>("");

  const updateStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDate= new Date(event.target.value);

    //if user logs sickday
    if (requestType ===LeaveType.Sick) {
      //if selected date is more than 7 days back
      if (calculateDaysBetween(new Date(), updatedDate) >7) {
          setStartDateInvalid("Log sick days max 7 days back");
      } else {
        setStartDateInvalid(null);
      }
    } else if (requestType!==null) {
      //if users asks for vacation or days of
      //it must be
      if (calculateDaysBetween(new Date(), updatedDate) > 0) {
        setStartDateInvalid("You must ask for time-off atleast day before")
      } else {
        setStartDateInvalid(null);
      }
    }
    if (updatedDate < new Date(endDate)) {
      setDaysBetween(calculateDaysBetween(new Date(endDate), updatedDate));
    }
    setStartDate(event.target.value);
  }

  const updateEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDate = new Date(event.target.value);
    const startDateAsDate = new Date(startDate);

    if (startDateAsDate > updatedDate) {
      setEndDateInvalid("End Date must be atleast the same day as start day");
    } else {
      setEndDateInvalid(null);
      setDaysBetween(calculateDaysBetween(updatedDate, startDateAsDate));
    }
    setEndDate(event.target.value);
  }

  const updateRequestType = (event: SelectChangeEvent) => {
    setRequestType(event.target.value as LeaveType);
  }

  const updateDesciption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }

  //users recent requests, fetched
  const [requests, setRequests] = useState<Leave[]>([]);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  //submiting form, checks for required fields
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

  //reaction to change of request type, so startdate might not be invalid
  useEffect(() => {
    const reactToTypeChange = () => {
      const updatedDate= new Date(startDate);

      //if user logs sickday
      if (requestType === LeaveType.Sick) {
        //if selected date is more than 7 days back
        if (calculateDaysBetween(new Date(), updatedDate) >7) {
          setStartDateInvalid("Log sick days max 7 days back");
        } else {
          setStartDateInvalid(null);
        }
      } else {
        //if users asks for vacation or days of
        //it must be atleast day before
        if (calculateDaysBetween(new Date(), updatedDate) > 0) {
          setStartDateInvalid("You must ask for time-off atleast day before")
        } else {
          setStartDateInvalid(null);
        }
      }
    }
    reactToTypeChange();
  }, [requestType]);

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
                      <Grid container columns={2}>
                        <Typography variant="h4">
                          {summary.vacationDaysLeft}
                        </Typography>
                        {(requestType===LeaveType.Vacation && daysBetween>0)?
                            <Typography variant="h4" color={summary.vacationDaysLeft >=0? "primary" : "warning"} >
                              {" " && summary.vacationDaysLeft - daysBetween}
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
                      <Grid container columns={2}>
                        <Typography variant="h4">
                          {summary.sickDaysLeft}
                        </Typography>
                        {(requestType===LeaveType.Sick && daysBetween>0)?
                            <Typography variant="h4" color={summary.sickDaysLeft >=0? "primary" : "warning"} >
                              {" " && summary.sickDaysLeft - daysBetween}
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
                      <Grid container columns={2}>
                        <Typography variant="h4">
                          {summary.personalDaysLeft}
                        </Typography>
                        {(requestType===LeaveType.Personal && daysBetween>0)?
                            <Typography variant="h4" color={summary.personalDaysLeft >=0? "primary" : "warning"} >
                              {" " && summary.personalDaysLeft - daysBetween}
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
                  onChange={updateDesciption}
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
