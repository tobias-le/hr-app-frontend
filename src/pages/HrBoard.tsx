import React, {useEffect, useState} from "react";
import {PageLayout} from "../components/common/PageLayout";
import {PendingRequest} from "../types/timeoff";
import {
    Avatar,
    Box,
    Button, CircularProgress, Grid,
    Paper, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, ToggleButton, ToggleButtonGroup, Typography
} from "@mui/material";
import {BaseModal} from "../components/common/BaseModal";
import {stringToColor} from "../utils/colorUtils";
import {Employee} from "../types/employee";
import ApiService from "../services/api.service";
import {EmptyState} from "../components/common/EmptyState";
import {format} from "date-fns";


const HrBoard:React.FC =()=> {
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<PendingRequest[]>([]);
    const [currentRequest, setCurrentRequest] = useState<PendingRequest | null>(null);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [currentRequests, setCurrentRequests] = useState<PendingRequest[]>([]);
    const [timeOffs, setTimeOffs] = useState<boolean>(true);
    const [lockedButton, setLockedButton] = useState<number>(0);

    useEffect(() => {
        setCurrentRequests(timeOffs? leaveRequests : requests);
    }, [timeOffs, requests, leaveRequests]);

    useEffect(() => {
        if (currentRequest) {
            ApiService.getEmployeeById(currentRequest.employee.id)
            .then(
                employee => {
                    setCurrentEmployee(employee)})
            .catch(
                error => console.log(error))}
    }, [currentRequest]);

    useEffect(() => {
        ApiService.getPendingGeneralRequests()
            .then(pendingGenerals => {
                setRequests(pendingGenerals)})
            .catch()
            .finally();

        ApiService.getPendingLeaveRequests()
            .then(pendingLeaves => {
                setLeaveRequests(pendingLeaves);})
            .catch()
            .finally();
    }, []);

    const resolveRequest = (action:string) => {
        if (currentRequest) {
            action==="approve"? setLockedButton(2): setLockedButton(1);
            ApiService.resolveRequest(currentRequest, action)
                .then(response => {
                    setRequests( prevState => {
                        return prevState.filter( request => {
                            if (timeOffs) {
                                return request.startDate? request.messageId!==currentRequest.messageId : true;
                            }
                            return !request.startDate? request.messageId!==currentRequest.messageId : true;
                        })
                    });
                    setCurrentRequest(null);
                })
                .catch(error => console.log(error))
                .finally(()=>setLockedButton(0));
        }
    }

    return (
        <PageLayout data-testid="hrBoard" title="Resolve requests">
            <div className="w-full flex justify-end">
                <ToggleButtonGroup
                    size="small"
                    value={timeOffs? "timeoffs":"general"}
                    onChange={(event, newValue)=> newValue && setTimeOffs(prevState => !prevState)}
                    exclusive
                >
                    <ToggleButton value="general">General</ToggleButton>
                    <ToggleButton value="timeoffs">Time-Off</ToggleButton>
                </ToggleButtonGroup>
            </div>

            {currentRequests.length>0?
            <TableContainer component={Paper} data-testid="pending-requests">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>

                            <TableCell>Employee</TableCell>

                            {timeOffs &&
                                <TableCell>From</TableCell>}

                            {timeOffs &&
                                <TableCell>To</TableCell>}

                            {timeOffs &&
                                <TableCell>Type</TableCell>}

                            {!timeOffs &&
                                <TableCell sx={{width:"50%"}}>Message</TableCell>}

                            <TableCell>{/*empty table cell*/}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentRequests.map( request => {
                            return (
                                <TableRow key={request.messageId}>
                                    <TableCell>{format(request.datetime, "dd.MM.yy hh:mm")}</TableCell>

                                    <TableCell>{request.employee.name}</TableCell>

                                    {request.startDate &&
                                        <TableCell>{format(request.startDate, "dd.MM.yyyy")}</TableCell>}

                                    {request.endDate &&
                                        <TableCell>{format(request.endDate, "dd.MM.yyyy")}</TableCell>}

                                    {timeOffs &&
                                        <TableCell>{request.leaveType}</TableCell>}

                                    {!timeOffs &&
                                        <TableCell sx={{width:"50%", maxWidth:"50%"}}>
                                            <Box sx={{display:"inline-block", overflow:"hidden", textOverflow:"ellipsis", maxHeight:"1rem"}}>{request.message}</Box>
                                        </TableCell>}

                                    <TableCell align="right">
                                        <Button variant="contained" onClick={()=> {
                                            setCurrentRequest(request);
                                        }}>Resolve</Button>
                                    </TableCell>
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
                :
                <EmptyState message="No requests found." />
            }
            {currentRequest &&
                <BaseModal open={!!currentRequest} onClose={()=> {setCurrentRequest(null)}} title={timeOffs? "Time Off Request": "General request"}>
                    <Grid container spacing={2} columns={3}>
                        <Grid item xs={2}>
                            <div className="w-full flex row items-center gap-x-4">
                                    <Avatar className="w-16 h-16" sx={{bgcolor: stringToColor(currentRequest.employee.name)}}>{currentRequest.employee.name.split(" ").map(str => str[0]).join("").toUpperCase()}</Avatar>
                                    <Box>
                                        <Typography variant="h6">{currentRequest.employee.name}</Typography>
                                        <Typography>{currentEmployee && currentEmployee.jobTitle}</Typography>
                                        <Typography>{currentEmployee && currentEmployee.email}</Typography>
                                    </Box>
                            </div>
                        </Grid>
                        {timeOffs &&
                            <>
                                <Grid item xs={1}>
                                    <Typography>Type</Typography>

                                    <Typography variant="h6">{currentRequest.leaveType}</Typography>
                                </Grid>

                                <Grid item xs={1}>
                                    <Typography >From</Typography>

                                    <Typography variant="h6">{currentRequest.startDate && format(currentRequest.startDate, "dd.MM.yyyy")}</Typography>
                                </Grid>

                                <Grid item xs={1}>
                                    <Typography >To</Typography>

                                    <Typography variant="h6">{currentRequest.endDate && format(currentRequest.endDate, "dd.MM.yyyy")}</Typography>
                                </Grid>

                                <Grid item xs={1}>
                                    <Typography>Days left</Typography>
                                    <Typography>
                                        {(currentRequest.currentDaysLeft && currentRequest.leaveAmount) &&
                                            <Grid container columns={2}>
                                                <Typography color="primary" variant="h5">{currentRequest.currentDaysLeft} →</Typography>
                                                <Typography color={currentRequest.currentDaysLeft- currentRequest.leaveAmount/8 >= 0 ? "secondary": "error"} variant="h5">{currentRequest.currentDaysLeft - currentRequest.leaveAmount}</Typography>
                                            </Grid>}
                                    </Typography>
                                </Grid>
                            </>
                        }
                        <Grid item xs={3}>
                            <Typography>Message</Typography>
                            <Box sx={{width:"100%",backgroundColor:"lightgray", color:"#1e293b" ,borderRadius:"5px", borderColor:"#1e293b", height:"auto", minHeight:"30vh", padding:"16px"}}>{currentRequest.message}</Box>
                        </Grid>
                        <Grid item xs={3} sx={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                            <Button
                                sx={{backgroundColor:"red", color:"white"}}
                                onClick={() => resolveRequest("reject")}
                                disabled={lockedButton!==0}>
                                Reject
                                {lockedButton===1 && <CircularProgress/>}
                            </Button>
                            <Button
                                sx={{backgroundColor:"green", color:"white"}}
                                onClick={() => resolveRequest("approve")}
                                disabled={lockedButton!==0}>
                                Approve
                                {lockedButton===2 && <CircularProgress/>}
                            </Button>
                        </Grid>
                    </Grid>
                </BaseModal>}
        </PageLayout>
    );
}

export default HrBoard;