import React, {useEffect, useState} from "react";
import {
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
import {RequestStatus, RequestType, TimeOffRequest, TimeOffSummary} from "../types/timeoff";
import CircularProgress from "@mui/material/CircularProgress";

function calculateDaysBetween (date1: Date, date2: Date): number {
  return Math.round((date1.getTime() - date2.getTime())/(3600*1000*24))+1;
}


const TimeOff: React.FC = () => {

  // summary of users remaining time off, fetched
  const [summary, setSummary] = useState<TimeOffSummary | null>(null);
  const [daysBetween, setDaysBetween] = useState<number>(0);

  //leave request form variables
  const [startDate, setStartDate] = useState<string>("");
  const [startDateInValid, setStartDateInvalid] = useState<string |  null>(null);

  const [endDate, setEndDate] = useState<string>("");
  const [endDateInvalid, setEndDateInvalid] = useState<string | null>(null);

  const [requestType, setRequestType] = useState<RequestType>(RequestType.Sick);
  const [requestTypeInvalid, setRequestTypeInvalid] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  const updateStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDate= new Date(event.target.value);

    //if user logs sickday
    if (requestType ===RequestType.Sick) {
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
    setRequestType(event.target.value as RequestType);
    setRequestTypeInvalid(null);
  }

  const updateDesciption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }

  //users recent requests, fetched
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);

  //submiting form via api
  const submitRequestForm = (event : React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (requestType && !startDateInValid && !endDateInvalid) {
      //send form data to system
    } else {
      setRequestTypeInvalid("You must select type of request");
    }
  }

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
        //const requests = await ApiService.getRecentTimeOffRequests();
        //const summary = await ApiService.getTimeOffSummary();
        //setRequests(requests);
        //setSummary(summary);

        // Mock data

        setSummary({
          vacationDaysLeft: 15,
          sickDaysLeft: 5,
          personalDaysLeft: 3,
          pendingRequests: 2,
        });

        setRequests([{
          id:1,
          employeeName: "Someone",
          startDate: "2024-11-03",
          endDate: "2024-11-06",
          reason:"im bored",
          type: RequestType.Vacation,
          status: RequestStatus.Pending
        }, {
          id:2,
          employeeName: "Someone Else",
          startDate: "2024-11-03",
          endDate: "2024-11-06",
          reason:"i hate my job",
          type: RequestType.Sick,
          status: RequestStatus.Rejected
        },{
          id:3,
          employeeName: "Someone",
          startDate: "2024-11-03",
          endDate: "2024-11-06",
          reason:"i love you boss",
          type: RequestType.Personal,
          status: RequestStatus.Approved
        } ]);

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
      if (requestType === RequestType.Sick) {
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
  const getStatusColor = (status: RequestStatus) => {
       switch (status) {
         case RequestStatus.Approved:
           return "success";
         case RequestStatus.Rejected:
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
                        {(requestType===RequestType.Vacation && daysBetween>0)?
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
                        {(requestType===RequestType.Sick && daysBetween>0)?
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
                        {(requestType===RequestType.Personal && daysBetween>0)?
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
                  {summary?
                      <Typography variant="h4">
                        {summary.pendingRequests}
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
                    <MenuItem value={RequestType.Vacation} selected={requestType===RequestType.Vacation}>Vacation</MenuItem>
                    <MenuItem value={RequestType.Sick} selected={requestType===RequestType.Sick}>Sick Leave</MenuItem>
                    <MenuItem value={RequestType.Personal} selected={requestType===RequestType.Personal}>Personal Leave</MenuItem>
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
                <Button variant="contained" color="primary">
                  Submit Request
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
              <TableBody>
                {/* Replace with actual data mapping */}

                {requests.map(request => (
                  <TableRow>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.startDate}</TableCell>
                    <TableCell>{request.endDate}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <Chip label={request.status} color={getStatusColor(request.status)} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
};

export default TimeOff;
