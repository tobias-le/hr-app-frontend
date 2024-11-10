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
    data-testid={`employee-row-${employee.id}`}
  >
    <TableCell>
      <div
        className="flex items-center gap-3"
        data-testid={`employee-info-${employee.id}`}
      >
        <Avatar
          alt={employee.name}
          className="w-10 h-10"
          sx={{ bgcolor: stringToColor(employee.name ?? "") }}
          data-testid={`employee-avatar-${employee.id}`}
        >
          {employee.name
            ? employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : ""}
        </Avatar>
        <span data-testid={`employee-name-${employee.id}`}>
          {employee.name}
        </span>
      </div>
    </TableCell>
    <TableCell data-testid={`employee-job-${employee.id}`}>
      {employee.jobTitle}
    </TableCell>
    <TableCell>
      <Chip
        label={employee.employmentStatus}
        color={employee.employmentStatus === "ACTIVE" ? "success" : "default"}
        size="small"
        data-testid={`employee-status-${employee.id}`}
      />
    </TableCell>
    <TableCell>
      <div
        className="flex flex-col"
        data-testid={`employee-contact-${employee.id}`}
      >
        <span data-testid={`employee-email-${employee.id}`}>
          {employee.email}
        </span>
        <span
          className="text-gray-500 text-sm"
          data-testid={`employee-phone-${employee.id}`}
        >
          {employee.phoneNumber}
        </span>
      </div>
    </TableCell>
    <TableCell>
      <div
        className="flex gap-1 flex-wrap"
        data-testid={`employee-projects-${employee.id}`}
      >
        {employee.currentProjects?.map((project, idx) => (
          <Chip
            key={idx}
            {...createProjectChip(project)}
            data-testid={`employee-project-${employee.id}-${idx}`}
          />
        ))}
      </div>
    </TableCell>
  </TableRow>
);

export default EmployeeRow;
