import React, {useEffect, useState} from "react";
import {
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {Employee} from "../types/Employee";
import {emps, otherEmps} from "../mocks/employeedepartments";
import EmployeeTableRow from "./EmployeeTableRow";

interface ETProps {
    departmentId: number;
}

function EmployeesTable({departmentId} : ETProps) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [employees, setEmployees] = useState<Employee[] | null>();


    useEffect(() => {
        const callFunction = () => {
            setTimeout( ()=> {
                setEmployees(emps);
            }, 2000)
        }
        callFunction();

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <TableContainer>
            <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Contract</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                { employees ?
                    ( employees.length !== 0 ?
                        <TableBody>
                            {employees.map((employee) => (
                                <EmployeeTableRow employee={employee} />
                            ))}
                        </TableBody>  :
                        <span>No employees</span> ):
                    <CircularProgress/>
                }
            </Table>
        </TableContainer>
    )
}

export default EmployeesTable;