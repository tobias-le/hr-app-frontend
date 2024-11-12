import Header from "../components/Header";
import {Box, Paper, Typography} from "@mui/material";
import React from "react";

const OrganisationStructure : React.FC = () => {
    return (
        <div
            className="flex flex-col h-screen bg-gray-100"
            data-testid="learning-container"
        >
            <Header/>
            <Box className="flex-grow p-6">
                <Paper className="p-6">
                    <Typography
                        variant="h5"
                        className="font-bold mb-6"
                        data-testid="organisationalstructure-title"
                    >
                        Organisational Structure
                    </Typography>
                </Paper>
            </Box>
        </div>
    );
}

export default OrganisationStructure;