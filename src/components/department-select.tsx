import React from "react";
import Department from "../types/Department";

interface DSProps {
    departments: Department[];
}

function DepartmentSelect({ departments }: DSProps) {
    return (
        <select className="department-select">
            {departments.map(
                department => (<option key={department.id} value={department.id}> {department.name}</option>)
            )}
        </select>)
}


export default DepartmentSelect;