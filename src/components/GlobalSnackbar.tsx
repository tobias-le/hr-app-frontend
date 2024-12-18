import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { create } from "zustand";

interface SnackbarStore {
  open: boolean;
  message: string;
  setOpen: (open: boolean) => void;
  showMessage: (message: string) => void;
}

export const useSnackbarStore = create<SnackbarStore>((set) => ({
  open: false,
  message: "",
  setOpen: (open) => set({ open }),
  showMessage: (message) => set({ message, open: true }),
}));

const GlobalSnackbar: React.FC = () => {
  const { open, message, setOpen } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity="info"
        elevation={6}
        variant="filled"
        data-testid="global-snackbar"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
