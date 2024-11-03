import React from "react";
import { TableRow, TableCell, Avatar, Chip } from "@mui/material";
import { Employee } from "../types/employee";
import { stringToColor } from "../utils/colorUtils";
import { createProjectChip } from "../utils/chipUtils";

interface EmployeeRowProps {
  employee: Employee;
  onClick: (employee: Employee) => void;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({ employee, onClick }) => (
  <TableRow
    sx={{
      "&:last-child td, &:last-child th": { border: 0 },
      cursor: "pointer",
    }}
    hover
    onClick={() => onClick(employee)}
  >
    <TableCell>
      <div className="flex items-center gap-3">
        <Avatar
          alt={employee.name}
          className="w-10 h-10"
          sx={{ bgcolor: stringToColor(employee.name ?? "") }}
        >
          {employee.name
            ? employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : ""}
        </Avatar>
        <span>{employee.name}</span>
      </div>
    </TableCell>
    <TableCell>{employee.jobTitle}</TableCell>
    <TableCell>
      <Chip
        label={employee.employmentStatus}
        color={employee.employmentStatus === "ACTIVE" ? "success" : "default"}
        size="small"
      />
    </TableCell>
    <TableCell>
      <div className="flex flex-col">
        <span>{employee.email}</span>
        <span className="text-gray-500 text-sm">{employee.phoneNumber}</span>
      </div>
    </TableCell>
    <TableCell>
      <div className="flex gap-1 flex-wrap">
        {employee.currentProjects?.map((project, idx) => (
          <Chip key={idx} {...createProjectChip(project)} />
        ))}
      </div>
    </TableCell>
  </TableRow>
);

export default EmployeeRow;
