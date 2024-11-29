import React, {useEffect, useState} from "react";
import {PageLayout} from "../components/common/PageLayout";
import {Box, Button, Chip, CircularProgress, FormControl, Typography} from "@mui/material";
import {FormField} from "../components/common/FormField";
import {useEmployeeStore} from "../store/employeeStore";
import {GeneralRequest} from "../types/timeoff";
import {DataTable} from "../components/common/DataTable";
import {getStatusColor} from "../utils/colorUtils";
import RequestModal from "../components/RequestModal";
import {format} from "date-fns";
import ApiService from "../services/api.service";

const GeneralRequests: React.FC = ()=> {
    const employee = useEmployeeStore(state => state.currentEmployee);
    const [requests, setRequests] = useState<GeneralRequest[]>([]);
    const [currentRequest, setCurrentRequest] = useState<GeneralRequest | null>(null);
    const [requestMessage, setRequestMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const sendNewRequest = (event: React.FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (employee) {
            setLoading(true);
            ApiService.createNewGeneralRequest(employee.id, requestMessage)
                .then(newRequest => setRequests(prevState => {
                    const newState = Array.from(prevState);
                    newState.push(newRequest);
                    return newState;
                }))
                .catch(error => console.log(error))
                .finally(() => setLoading(false));
        }
    }

    useEffect(() => {
        if (employee) {
            ApiService.getGeneralRequestsByUserId(employee.id)
                .then(response => {
                    setRequests(response);
                    console.log(response);
                })
                .catch(error => console.log("Failed to load users requests"))
        }
    }, [employee]);

    return (
        <PageLayout testId="general-requests-page">
            <Box className="m-6 space-y-2">
                <Typography variant="h6">Contact HR Department</Typography>
                <form onSubmit={sendNewRequest}>
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
                        <Button variant="outlined" onClick={()=> setRequestMessage("")}>Cancel</Button>
                        <Button variant="contained" type="submit" disabled={loading}>Submit request {loading && <CircularProgress/>}</Button>
                    </div>
                </form>
            </Box>
            <Box className="m-6 space-y-2">
                <Typography variant="h6">My requests</Typography>

                <DataTable
                    data={requests}
                    columns={[
                        { header: "Date", accessor: (request => format(request.datetime, "dd.MM.yyyy")) },
                        { header: "Message", accessor: (request =>
                                <Box sx={{display:"inline-block", overflow:"hidden", textOverflow:"ellipsis", maxHeight:"1.5rem"}}>{request.message}</Box>)},
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