import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import Header from "../Header";

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  testId?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  actions,
  testId,
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100" data-testid={testId}>
      <Header />
      <Box className="flex-grow p-6">
        <Paper className="p-6">
          {(title || actions) && (
            <div className="flex justify-between items-center mb-6">
              {title && (
                <Typography variant="h5" className="font-bold">
                  {title}
                </Typography>
              )}
              {actions && <div className="flex space-x-2">{actions}</div>}
            </div>
          )}
          {children}
        </Paper>
      </Box>
    </div>
  );
};
