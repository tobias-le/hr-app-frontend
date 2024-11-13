import { createTheme } from "@mui/material/styles";

// Color palette definition
const colors = {
  slate: {
    50: "#f8fafc",
    600: "#475569",
    900: "#1e293b",
  },
  yellow: {
    400: "#f5c816",
    500: "#eab308",
  },
  gray: {
    400: "#94A3B8",
    500: "#4B5563",
    100: "#E5E7EB",
    50: "#f9fafb",
  },
  white: "#ffffff",
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.slate[900],
      light: colors.yellow[400],
    },
    secondary: {
      main: colors.yellow[500],
    },
    background: {
      default: "#f3f4f6",
      paper: colors.white,
    },
    text: {
      primary: colors.slate[900],
      secondary: colors.gray[500],
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
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    subtitle1: {
      color: "#4B5563",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
        },
        contained: {
          backgroundColor: colors.slate[900],
          color: colors.white,
          "&:hover": {
            backgroundColor: "#334155",
          },
          "&.Mui-disabled": {
            backgroundColor: colors.gray[400],
            color: colors.white,
          },
        },
        outlined: {
          borderColor: colors.slate[900],
          color: colors.slate[900],
          "&:hover": {
            backgroundColor: "rgba(30, 41, 59, 0.04)",
            borderColor: colors.slate[900],
          },
          "&.addAttendance": {
            color: colors.yellow[400],
            backgroundColor: colors.slate[900],
            fontWeight: "bold",
            border: `1px solid ${colors.yellow[400]}`,
            "&:hover": {
              backgroundColor: "transparent",
              color: colors.slate[900],
              border: `1px solid ${colors.slate[900]}`,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            fontWeight: 600,
            backgroundColor: colors.gray[50],
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
        },
        colorPrimary: {
          backgroundColor: colors.slate[900],
          color: colors.yellow[400],
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#4B5563",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#4B5563",
          backgroundColor: "white",
          padding: "0 8px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#E5E7EB",
            },
            "&:hover fieldset": {
              borderColor: "#1e293b",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1e293b",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#4B5563",
            "&.Mui-focused": {
              color: "#1e293b",
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.slate[900],
          borderRadius: 0,
          boxShadow: "none",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiTextField-root": {
            backgroundColor: "#ffffff",
            borderRadius: "4px",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&.header-icon": {
            color: "#f5c816", // text-yellow-400
            "&:hover": {
              backgroundColor: "rgba(245, 200, 22, 0.08)",
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          "&.header-divider": {
            backgroundColor: "#f5c816",
            margin: "0 16px",
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          borderRadius: "8px",
          overflow: "hidden",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          minWidth: 650,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        subtitle1: {
          color: "#475569", // slate-600
          fontWeight: 500,
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root": {
            "&:hover": {
              backgroundColor: "#f8fafc", // slate-50
            },
            "&:last-child .MuiTableCell-root": {
              borderBottom: "none",
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          "& > .MuiGrid-item": {
            paddingTop: "24px",
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          '&[direction="row"]': {
            gap: "16px",
          },
        },
      },
    },
  },
});
