import React, {useState} from "react";
import {Box, LinearProgress, SelectChangeEvent, Typography} from "@mui/material";
import DepartmentSelect from "../components/department-select";
import Department from "../types/Department";

function DepartmentsView() {

    const [departments, setDepartments] = useState<Department[] | null>(null);

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom component="h1">
                Departments
            </Typography>

            <Box>
                <span>Choose a department: </span>
                {departments? <DepartmentSelect/> : <LinearProgress/>}
            </Box>
        </Box>
    );
}

export default DepartmentsView;