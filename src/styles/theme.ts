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
  gradient: {
    primary: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    accent: "linear-gradient(135deg, #f5c816 0%, #eab308 100%)",
  },
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
          fontWeight: 600,
          padding: "12px 24px",
          borderRadius: "12px",
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          background: colors.gradient.primary,
          color: colors.white,
          boxShadow: "0 4px 14px rgba(30, 41, 59, 0.15)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(30, 41, 59, 0.25)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          "&.Mui-disabled": {
            background: colors.gray[400],
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
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          "&.login-paper": {
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
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
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: "12px",
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
              borderWidth: "1px",
              borderColor: "rgba(74, 85, 104, 0.2)",
            },
            "&:hover": {
              transform: "translateY(-2px)",
              "& fieldset": {
                borderColor: colors.yellow[400],
              },
            },
            "&.Mui-focused": {
              boxShadow: "0 4px 20px rgba(245, 200, 22, 0.15)",
              "& fieldset": {
                borderWidth: "2px",
                borderColor: `${colors.yellow[400]} !important`,
              },
            },
            "&.Mui-error": {
              "& fieldset": {
                borderColor: "#ef4444",
              },
            },
            "& input": {
              padding: "16px",
            },
          },
          "& .MuiInputLabel-root": {
            color: colors.slate[600],
            "&.Mui-focused": {
              color: colors.yellow[500],
            },
            "&.Mui-error": {
              color: "#ef4444",
            },
          },
          "& .MuiFormHelperText-root": {
            marginLeft: "14px",
            marginRight: "14px",
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
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          "& .MuiFab-primary": {
            background: colors.gradient.primary,
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 8px 20px rgba(30, 41, 59, 0.25)",
            },
          },
        },
      },
    },
  },
});
