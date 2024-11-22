import React, {useEffect, useState} from "react";
import {PageLayout} from "../components/common/PageLayout";
import {Box, Button, Chip, FormControl, Typography} from "@mui/material";
import {FormField} from "../components/common/FormField";
import {useEmployeeStore} from "../store/employeeStore";
import {GeneralRequest, LeaveStatus} from "../types/timeoff";
import {DataTable} from "../components/common/DataTable";
import {getStatusColor} from "../utils/colorUtils";
import RequestModal from "../components/RequestModal";
import {format} from "date-fns";

const GeneralRequests: React.FC = ()=> {
    const employee = useEmployeeStore(state => state.selectedEmployee);
    const [requests, setRequests] = useState<GeneralRequest[]>([]);
    const [currentRequest, setCurrentRequest] = useState<GeneralRequest | null>(null);
    const [requestMessage, setRequestMessage] = useState<string>("");

    useEffect(() => {
        //update Current request by emloyeeid
    }, [employee]);

    useEffect(() => {
        setRequests([{
            messageId:1,
            employeeId : 1,
            datetime : new Date(),
            status: LeaveStatus.Pending,
            message: "Ligma",
        }])
    }, []);

    return (
        <PageLayout testId="general-requests-page">
            <Box className="m-6 space-y-2">
                <Typography variant="h6">Contact HR Department</Typography>
                <form>
                    <FormControl fullWidth>
                        <FormField
                            name="general-request-message"
                            label="Your message to HR"
                            value={requestMessage}
                            multiline
                            rows={4}
                            onChange={
                                (e) => setRequestMessage(e.target.value)}
                        />
                    </FormControl>

                    <div className="w-full flex justify-end space-x-2">
                        <Button variant="outlined">Cancel</Button>
                        <Button variant="contained">Submit request</Button>
                    </div>
                </form>
            </Box>
            <Box className="m-6 space-y-2">
                <Typography variant="h6">My requests</Typography>

                <DataTable
                    data={requests}
                    columns={[
                        { header: "Date", accessor: (request => format(request.datetime, "dd.MM.yyyy")) },
                        { header: "Message", accessor: "message" as keyof GeneralRequest },
                        {header: "Status",
                            accessor: (request: GeneralRequest) => (
                                <Chip
                                    label={request.status}
                                    color={getStatusColor(request.status)}
                                    size="small"
                                    data-testid="status-chip"
                                />
                            ),
                        },]}
                    emptyMessage="No requests"
                    onRowClick={(item) => setCurrentRequest(item)}
                />
            </Box>
            <RequestModal request={currentRequest} isGeneral onClose={() => setCurrentRequest(null)}/>
        </PageLayout>
    );
}

export default GeneralRequests;