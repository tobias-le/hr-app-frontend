import React from "react";
import { Box } from "@mui/material";

interface BaseComponentProps {
  children: React.ReactNode;
  className?: string;
}

export const BaseComponent: React.FC<BaseComponentProps> = ({
  children,
  className,
}) => {
  return <Box className={className}>{children}</Box>;
};
