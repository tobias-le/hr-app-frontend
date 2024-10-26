import React, {useEffect, useState} from "react";
import {Box, LinearProgress, Typography, Paper, SelectChangeEvent, InputLabel, Select} from "@mui/material";
import DepartmentSelect from "../components/DepartmentSelect";
import EmployeesTable from "../components/EmployeesTable";
import Department from "../types/Department";
import {mockedDepartmentsData} from "../mocks/departmentsData";

function DepartmentsView() {
    const [departments, setDepartments] = useState<Department[] | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const changeSelectedDepartment = (e: SelectChangeEvent): void => {
        const dep = departments?.find(department => department.departmentId === Number(e.target.value));
        if (dep) {
            setSelectedDepartment(dep);
        }
    }

    useEffect(() => {
        const makedepartmentscall = () => {
            setTimeout( () => {
                setDepartments(mockedDepartmentsData);
            }, 2000)
        }
        makedepartmentscall();
    }, []);

    const containerStyle = {
        padding: "24px",
    };

    const paperStyle = {
        padding: "16px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        overflowX: "auto" as const,
    };

    const employeesContainer = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }

    return (
        <Box style={containerStyle}>
            <Paper style={paperStyle}>
                <Typography variant="h4" gutterBottom component="h1">
                    Departments
                </Typography>

                <Box sx={{marginBottom: "20px", display: "flex", flexDirection: "row"}}>
                    <InputLabel>Choose a department: </InputLabel>
                    { departments?
                        <DepartmentSelect departments={departments} changeFunction={changeSelectedDepartment} sDepartment={selectedDepartment}/> :
                        <LinearProgress style={{width: "20%", alignSelf: "center"}} />}
                </Box>

                <Box>
                    {selectedDepartment ?
                        <Typography variant="h5">{selectedDepartment.departmentName}</Typography> :
                        "hello"}
                </Box>

                <Box sx={employeesContainer}>
                    {selectedDepartment ?
                        <EmployeesTable departmentId={selectedDepartment?.departmentId}/> :
                        <span> select department to view its details</span>
                    }
                </Box>

                <Box>
                    {selectedDepartment?
                        <>
                            <InputLabel>Add employee to department: </InputLabel>
                            <Select>

                            </Select>
                        </> :
                        null
                    }
                </Box>


            </Paper>
        </Box>
    );
}

export default DepartmentsView;