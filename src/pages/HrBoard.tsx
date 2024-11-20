import React, {useEffect, useState} from "react";
import {PageLayout} from "../components/common/PageLayout";
import {LeaveType, PendingRequest} from "../types/timeoff";
import {
    Box,
    Button, FormControlLabel, Grid,
    Paper, Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {BaseModal} from "../components/common/BaseModal";


const HrBoard:React.FC =()=> {
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [currentRequest, setCurrentRequest] = useState<PendingRequest | null>(null);
    const [currentRequests, setCurrentRequests] = useState<PendingRequest[]>([]);
    const [timeOffs, setTimeOffs] = useState<boolean>(true);

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
            leaveAmount: 24,
            currentDaysLeft: 10,
            message: "im going to Ibiza"
        },{
            id:1,
            employee: {
                name:"Eric Cartman",
                id: 3
            },
            datetime: "29.11.2024",
            message: "we need new coffee machine"
        }

    ];

    useEffect(() => {
        setRequests(reqs);
        setCurrentRequest(currentRequest);
    }, []);

    useEffect(() => {
        const newRequests = requests.filter(request => {
            if (timeOffs) {
                return request.startDate ;
            }
            return !request.startDate;
        });
        setCurrentRequests(newRequests)
    }, [timeOffs]);

    return (
        <PageLayout data-testid="hrBoard" title="Resolve requests">
            <Box>
                <FormControlLabel control={<Switch checked={timeOffs} onChange={()=> {setTimeOffs(prevState => !prevState)}}/>} label={timeOffs? "Time-Off requests": "General requests"} />
            </Box>

            <TableContainer component={Paper} data-testid="pending-requests">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date:</TableCell>

                            <TableCell>Employee:</TableCell>

                            {timeOffs &&
                                <TableCell>From:</TableCell>}

                            {timeOffs &&
                                <TableCell>To:</TableCell>}

                            {timeOffs &&
                                <TableCell>Type:</TableCell>}

                            {!timeOffs &&
                                <TableCell sx={{widht:"50%"}}>Message</TableCell>}

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
                                        <TableCell>{request.message}</TableCell>}

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
            {currentRequest &&
                <BaseModal open={!!currentRequest} onClose={()=> {setCurrentRequest(null)}} title="Resolve request">
                    <Grid container spacing={2} columns={3}>
                        <Grid item xs={3}>
                            <Typography variant="h6">Employee:</Typography>

                            <Typography>{currentRequest.employee.name}</Typography>
                        </Grid>
                        {timeOffs &&
                            <>
                                <Grid item xs={1}>
                                    <Typography variant="h6">From:</Typography>

                                    <Typography>{currentRequest.startDate}</Typography>
                                </Grid>


                                <Grid item xs={1}>
                                    <Typography variant="h6">To:</Typography>

                                    <Typography>{currentRequest.endDate}</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography variant="h6">Type:</Typography>

                                    <Typography>{currentRequest.leaveType}</Typography>
                                </Grid>
                            </
                        }
                    </Grid>
                </BaseModal>}
        </PageLayout>
    );
}

export default HrBoard;