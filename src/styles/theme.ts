import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1e293b",
    },
    secondary: {
      main: "#eab308",
    },
    background: {
      default: "#f3f4f6",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Default button styles
        },
        outlined: {
          // Custom styles for outlined buttons
          "&.addAttendance": {
            color: "#f5c816",
            backgroundColor: "#1e293b",
            fontWeight: "bold",
            border: "1px solid #f5c816",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#1e293b",
              border: "1px solid #1e293b",
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        subtitle1: {
          color: "#4B5563", // gray-600
        },
        h4: {
          fontWeight: "bold",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#4B5563", // gray-600
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "gray",
          backgroundColor: "white",
          padding: "0 8px",
        },
      },
    },
  },
});
