import {BaseModal} from "./common/BaseModal";
import {GeneralRequest, Leave} from "../types/timeoff";
import {Box, Chip, Grid, Typography} from "@mui/material";
import React from "react";
import { format } from "date-fns";
import {getStatusColor} from "../utils/colorUtils";

interface Props {
    request: Leave | GeneralRequest | null;
    isGeneral?: boolean;
    onClose: () => void;
}

const RequestModal:React.FC<Props> = ({request,onClose, isGeneral=false}:Props) => {
    return (
            <BaseModal
                open={request !== null}
                onClose={onClose}
                title={isGeneral? "General Request": "Leave request"}>
                {request &&
                    <Grid columns={3} container>
                        <Grid item xs={2}>
                            <Typography>Date</Typography>

                            <Typography variant="h6">
                                {"datetime" in request ? format(request.datetime, "dd.MM.yyyy") : "Unknown"}
                            </Typography>
                        </Grid>

                        <Grid item xs={1}>
                            <Typography>Status</Typography>
                            <Chip
                                label={request.status}
                                color={getStatusColor(request.status)}
                                size="small"
                                data-testid="status-chip"
                            />
                        </Grid>

                        {!isGeneral &&
                            <>
                                <Grid item xs={1}>
                                    <Typography>Start Date</Typography>

                                    <Typography variant="h6">
                                        {"startDate" in request ? format(request.startDate, "dd.MM.yyyy") : "Unknown"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={1}>
                                <Typography>End Date</Typography>

                                <Typography variant="h6">
                                    {"endDate" in request ? format(request.endDate, "dd.MM.yyyy") : "Unknown"}
                                </Typography>
                                </Grid>

                                <Grid item xs={1}>
                                <Typography>Type</Typography>

                                <Typography variant="h6">
                                    {"leaveType" in request && request.leaveType}
                                </Typography>
                                </Grid>
                            </>
                        }

                        <Grid item xs={3}>
                            <Typography>Message</Typography>
                            <Box sx={{width:"100%",backgroundColor:"lightgray", color:"#1e293b" ,borderRadius:"5px", borderColor:"#1e293b", height:"auto", minHeight:"30vh", padding:"16px"}}>
                                {"message" in request && request.message}
                                {"reason" in request && request.reason}
                            </Box>
                        </Grid>

                    </Grid>
                }
            </BaseModal>
    )
}
export default RequestModal;