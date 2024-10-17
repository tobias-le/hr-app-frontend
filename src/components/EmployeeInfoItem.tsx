import React from "react";
import { List, ListItem, ListItemText, styled } from "@mui/material";

export const EmployeeInfoItem = ({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string | number;
}) => (
  <ListItem>
    <ListItemText primary={primary} secondary={secondary} />
  </ListItem>
);

export const EmployeeInfoList = styled(List)({
  width: "100%",
});
