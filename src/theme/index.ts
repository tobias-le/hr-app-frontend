import { createTheme } from "@mui/material/styles";
import { orange, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[400],
    },
    secondary: {
      main: grey[200],
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: "2.125rem",
      fontWeight: 400,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 400,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        },
      },
    },
  },
  zIndex: {
    drawer: 1200,
  },
  spacing: (factor: number) => `${8 * factor}px`,
});

export default theme;
