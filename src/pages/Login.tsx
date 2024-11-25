import React, { useState } from "react";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  CircularProgress,
  SpeedDial,
  SpeedDialAction,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import CodeIcon from "@mui/icons-material/Code";
import BusinessIcon from "@mui/icons-material/Business";
import QuickLoginIcon from "@mui/icons-material/Speed";

interface QuickLoginUser {
  email: string;
  password: string;
  role: string;
  icon: React.ReactElement;
}

const quickLoginUsers: QuickLoginUser[] = [
  {
    email: "catherine.adams@company.com",
    password: "pass123",
    role: "HR Director",
    icon: <AdminIcon />,
  },
  {
    email: "steven.wright@company.com",
    password: "pass123",
    role: "Backend Developer",
    icon: <CodeIcon />,
  },
  {
    email: "john.smith@company.com",
    password: "pass123",
    role: "Chief Executive Officer",
    icon: <BusinessIcon />,
  },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const { showMessage } = useSnackbarStore();

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      showMessage("Login successful");
    } catch (error) {
      showMessage("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (user: QuickLoginUser) => {
    setEmail(user.email);
    setPassword(user.password);

    setIsLoading(true);
    try {
      await login(user.email, user.password);
      showMessage(`Logged in as ${user.role}`);
    } catch (error) {
      showMessage("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login to Time.ly
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoading}
            data-testid="email-input"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isLoading}
            data-testid="password-input"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isLoading}
            data-testid="login-button"
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Paper>
      <SpeedDial
        ariaLabel="Quick Login SpeedDial"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<QuickLoginIcon />}
        data-testid="quick-login-dial"
      >
        {quickLoginUsers.map((user) => (
          <SpeedDialAction
            key={user.email}
            icon={user.icon}
            tooltipTitle={`Login as ${user.role}`}
            onClick={() => handleQuickLogin(user)}
            data-testid={`quick-login-${user.role
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          />
        ))}
      </SpeedDial>
      {isLoading && <LoadingSpinner fullPage testId="login-loading-spinner" />}
    </Box>
  );
};

export default Login;
