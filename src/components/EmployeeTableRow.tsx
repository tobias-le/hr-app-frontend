import {Employee} from "../types/Employee";
import {Button, CircularProgress, Icon, TableCell, TableRow} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React, {useState} from "react";

interface ETRProps {
    employee: Employee;
}

function EmployeeTableRow({employee} : ETRProps) {
    const [changed, setChanged] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [visible, setVisible] = useState<boolean>(true);



    //function reacting to button click
    const removeFunction = () :void => {
        setChanged(true);
        setTimeout( ()=> {
            const doChange = Math.random() >=0.5;
            setSuccess( doChange);
            if (doChange) {
                setTimeout( () => {
                    setVisible(false);
                }, 3000)
            } else {
                setTimeout( ()=> {
                    setSuccess(null);
                    setChanged(false);
                },3000)
            }
        }, 2000)
    }


    return (
        visible?
        <TableRow key={employee.employeeId}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.contractType}</TableCell>
                <TableCell>{employee.accountNumber}</TableCell>
                <TableCell>
                    {employee.address.street},
                    {employee.address.city},
                    {employee.address.zipCode} {employee.address.country}
                </TableCell>
                <TableCell>

                    <Button onClick={removeFunction} disabled={changed && success===null} variant="outlined">
                        Kick from department {changed ?
                        (
                            success === null ? <CircularProgress/> :
                                (success? <CheckIcon color={"success"}/>: <CloseIcon color={"error"}/> )
                        ) :
                        null
                    }
                    </Button>
                </TableCell>
        </TableRow> :
        null
    )
}

export default EmployeeTableRow;