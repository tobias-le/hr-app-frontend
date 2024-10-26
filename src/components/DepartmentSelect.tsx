import React from "react";
import Department from "../types/Department";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";

interface DSProps {
    departments: Department[];
    changeFunction: (e :SelectChangeEvent) => void;
    sDepartment: Department | null;
}

function DepartmentSelect({ departments, changeFunction, sDepartment }: DSProps) {
    return (
        <Select onChange={changeFunction}>
            {departments.map(
                department => (<MenuItem
                    key={department.departmentId}
                    value={department.departmentId}
                    selected={
                           sDepartment? sDepartment.departmentId === department.departmentId : false
                }
                >
                    {department.departmentName}
                </MenuItem>)
            )}
        </Select>)
}


export default DepartmentSelect;