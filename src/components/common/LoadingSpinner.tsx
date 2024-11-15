import React from "react";
import { CircularProgress } from "@mui/material";

interface LoadingSpinnerProps {
  fullPage?: boolean;
  testId?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullPage = false,
  testId = "loading-spinner",
}) => {
  if (fullPage) {
    return (
      <div
        className="fixed inset-0 flex justify-center items-center bg-white/70 backdrop-blur-[3px] z-50"
        data-testid={testId}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-64" data-testid={testId}>
      <CircularProgress />
    </div>
  );
};
