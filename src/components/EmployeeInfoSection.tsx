import React from "react";
import { Grid } from "@mui/material";
import { EmployeeInfoList, EmployeeInfoItem } from "./EmployeeInfoItem";
import { Employee } from "../types/Employee";

interface EmployeeInfoSectionProps {
  employee: Employee;
  fields: Array<{ key: keyof Employee; label: string }>;
}

const EmployeeInfoSection: React.FC<EmployeeInfoSectionProps> = ({
  employee,
  fields,
}) => (
  <Grid item xs={12} md={6}>
    <EmployeeInfoList>
      {fields.map(({ key, label }) => (
        <EmployeeInfoItem
          key={key}
          primary={label}
          secondary={
            typeof employee[key] === "object"
              ? JSON.stringify(employee[key])
              : String(employee[key])
          }
        />
      ))}
    </EmployeeInfoList>
  </Grid>
);

export default EmployeeInfoSection;
