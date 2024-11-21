import React from "react";
import { Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../common/PageLayout";

export const NoEmployeeSelected: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Paper
        elevation={0}
        className="flex flex-col items-center justify-center p-8 text-center"
        data-testid="no-employee-selected"
      >
        <Typography variant="h5" className="mb-4">
          No Employee Selected
        </Typography>
        <Typography variant="body1" color="textSecondary" className="mb-6">
          Please select an employee from the employee list to view or edit their
          details.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/employees")}
          data-testid="go-to-employees-button"
        >
          Go to Employee List
        </Button>
      </Paper>
    </PageLayout>
  );
};
