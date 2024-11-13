import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  testId?: string;
  showCloseButton?: boolean;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  testId,
  showCloseButton = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      data-testid={testId}
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography variant="h6">{title}</Typography>
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              data-testid={`${testId}-close-button`}
            >
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
