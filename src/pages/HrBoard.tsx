import React, {useEffect, useState} from "react";
import {PageLayout} from "../components/common/PageLayout";
import {LeaveType, PendingRequest} from "../types/timeoff";
import {
    Avatar,
    Box,
    Button, CircularProgress, FormControl, FormControlLabel, Grid,
    Paper, Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {BaseModal} from "../components/common/BaseModal";
import {stringToColor} from "../utils/colorUtils";
import {Employee} from "../types/employee";
import ApiService from "../services/api.service";
import {EmptyState} from "../components/common/EmptyState";


const HrBoard:React.FC =()=> {
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [currentRequest, setCurrentRequest] = useState<PendingRequest | null>(null);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [currentRequests, setCurrentRequests] = useState<PendingRequest[]>([]);
    const [timeOffs, setTimeOffs] = useState<boolean>(true);
    const [lockedButton, setLockedButton] = useState<number>(0);

    const reqs: PendingRequest[] = [
        {
            id:1,
            employee: {
                name:"John Doe",
                id: 1
            },
            startDate: "29.11.2024",
            endDate: "1.12.2024",
            datetime : "16.11.2024",
            leaveType: LeaveType.Personal,
            leaveAmount: 168,
            currentDaysLeft: 10,
            message: "im going to Ibiza"
        }
        ,{
            id:1,
            employee: {
                name:"John Smith",
                id: 3
            },
            datetime: "29.11.2024",
            message: "we need new coffee machinewe need new coffee machinewe need new coffee machinewe need new coffee machinewe need new coffee machinewe need new coffee machine"
        }

    ];

    useEffect(() => {
        const newRequests = requests.filter(request => {
            if (timeOffs) {
                return request.startDate ;
            }
            return !request.startDate;
        });
        setCurrentRequests(newRequests);
    }, [timeOffs, requests]);

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
        setRequests(reqs);
        setTimeOffs(true);
    }, []);

    const resolveRequest = (action:string) => {
        if (currentRequest) {
            action==="approve"? setLockedButton(2): setLockedButton(1);
            ApiService.resolveRequest(currentRequest, action)
                .then(response => {
                    setRequests( prevState => {
                        return prevState.filter( request => {
                            if (timeOffs) {
                                return request.startDate? request.id!==currentRequest.id : true;
                            }
                            return !request.startDate? request.id!==currentRequest.id : true;
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
                <Button onClick={()=> {setTimeOffs(prevState => !prevState)}} variant="outlined">
                    {!timeOffs? "Time-Off requests": "General requests"}
                </Button>
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
                                <TableRow key={request.id}>
                                    <TableCell>{request.datetime}</TableCell>

                                    <TableCell>{request.employee.name}</TableCell>

                                    {timeOffs &&
                                        <TableCell>{request.startDate}</TableCell>}

                                    {timeOffs &&
                                        <TableCell>{request.endDate}</TableCell>}

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

                                    <Typography variant="h6">{currentRequest.startDate}</Typography>
                                </Grid>

                                <Grid item xs={1}>
                                    <Typography >To</Typography>

                                    <Typography variant="h6">{currentRequest.endDate}</Typography>
                                </Grid>

                                <Grid item xs={1}>
                                    <Typography>Days left</Typography>
                                    <Typography>
                                        {(currentRequest.currentDaysLeft && currentRequest.leaveAmount) &&
                                            <Grid container columns={2}>
                                                <Typography color="primary" variant="h5">{currentRequest.currentDaysLeft} →</Typography>
                                                <Typography color={currentRequest.currentDaysLeft- currentRequest.leaveAmount/8 >= 0 ? "secondary": "error"} variant="h5">{currentRequest.currentDaysLeft - currentRequest.leaveAmount/8}</Typography>
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