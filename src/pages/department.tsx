import React, {useEffect, useState} from "react";
import {Box, LinearProgress,Typography} from "@mui/material";
import DepartmentSelect from "../components/department-select";
import Department from "../types/Department";
import {mockedDepartmentsData} from "../mocks/departmentsData";

function DepartmentsView() {

    const [departments, setDepartments] = useState<Department[] | null>(null);

    useEffect(() => {
        setDepartments(mockedDepartmentsData);
    }, []);

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom component="h1">
                Departments
            </Typography>

            <Box>
                <span>Choose a department: </span>
                {departments? <DepartmentSelect departments={departments}/> : <LinearProgress/>}
            </Box>
        </Box>
    );
}

export default DepartmentsView;