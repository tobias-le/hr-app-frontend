import React, {useEffect, useState} from "react";
import {
    Box,
    LinearProgress,
    Typography,
    Paper,
    SelectChangeEvent,
    InputLabel,
    Select,
    MenuItem,
    Button, CircularProgress
} from "@mui/material";
import DepartmentSelect from "../components/DepartmentSelect";
import EmployeesTable from "../components/EmployeesTable";
import Department from "../types/Department";
import {mockedDepartmentsData} from "../mocks/departmentsData";
import {Employee} from "../types/Employee";
import {emps} from "../mocks/employeedepartments";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function DepartmentsView() {
    //all of system available departments to display
    const [departments, setDepartments] = useState<Department[] | null>(null);

    //selected department, to display its details and employees
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    //function to handle change of selected department
    const changeSelectedDepartment = (e: SelectChangeEvent): void => {
        const dep = departments?.find(department => department.departmentId === Number(e.target.value));
        if (dep) {
            setSelectedDepartment(dep);
        }
    }

    //employee to be added into selected department
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    //handle selection of employee to add to currently selected departmnet
    const changeSelectedEmployee = (e: SelectChangeEvent):void => {
        const emp = emps.find(employee => employee.employeeId === Number(e.target.value));
        if (emp) {
            setSelectedEmployee(emp);
        }
    }

    //addEmployee button variables
    const [clicked, setClicked] = useState<boolean>(false);
    const [addSuccessfull, setAddSuccessfull] = useState<boolean>(false);
    const [addUnsuccessfull, setAddUnsuccessfull]= useState<boolean>(false);

    //function for adding emloyees, now mocked
    const addEmployee = () => {
        setClicked(true);
        //alert("Adding " + selectedEmployee?.name + " to department " + selectedDepartment?.departmentName);
        setTimeout( ()=> {
            setClicked(false);
            const added = Math.random() >=0.5;
            if (added) {
                setAddSuccessfull(true);
                setTimeout(()=> setAddSuccessfull(false),2000);
            } else {
                setAddUnsuccessfull(true);
                setTimeout(()=> setAddUnsuccessfull(false),2000);
            }
            setClicked(false);
            }, 2000);

    }


    //to fetch departments, now simulated
    useEffect(() => {
        const makedepartmentscall = () => {
            setTimeout( () => {
                setDepartments(mockedDepartmentsData);
            }, 2000)
        }
        makedepartmentscall();
    }, []);


    //idk, just copied this to possibly have same design

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
                        <Box>
                            <InputLabel>Add employee to department </InputLabel>
                            <Select onChange={changeSelectedEmployee}>
                                {emps.map(
                                    employee =>
                                        <MenuItem
                                            value={employee.employeeId}
                                            selected={employee.employeeId===selectedEmployee?.employeeId}>
                                            {employee.name}
                                        </MenuItem>
                                )}
                            </Select>

                            <Button variant="outlined" onClick={addEmployee} disabled={clicked}>
                                Add Employee
                                {clicked?
                                    <CircularProgress/>:
                                    null
                                }
                                {addSuccessfull?
                                    <CheckIcon color={"success"}/>:null
                                }
                                {addUnsuccessfull?
                                    <CloseIcon color={"error"}/>:null
                                }
                            </Button>

                        </Box>:
                        null
                    }
                </Box>

            </Paper>
        </Box>
    );
}

export default DepartmentsView;