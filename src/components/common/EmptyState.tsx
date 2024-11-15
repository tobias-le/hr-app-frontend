import { Typography } from "@mui/material";

export interface EmptyStateProps {
  message: string;
  testId?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, testId }) => (
  <div className="flex justify-center items-center h-64" data-testid={testId}>
    <Typography variant="h6" color="textSecondary">
      {message}
    </Typography>
  </div>
);
