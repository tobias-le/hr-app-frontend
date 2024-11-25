import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WorkTime from "./pages/AttendanceRecord";
import TimeOff from "./pages/TimeOff";
import EmployeeDetailsForm from "./pages/EmployeeDetailsForm";
import GlobalSnackbar from "./components/GlobalSnackbar";
import ProjectManagement from "./pages/ProjectManagement";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";
import ProjectDetails from "./pages/ProjectDetails";
import TeamManagement from "./pages/TeamManagement";
import TeamDetails from "./pages/TeamDetails";
import Learn from "./pages/Learning";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/work-time"
          element={
            <ProtectedRoute>
              <WorkTime />
            </ProtectedRoute>
          }
        />
        <Route
          path="/time-off"
          element={
            <ProtectedRoute>
              <TimeOff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-details"
          element={
            <ProtectedRoute>
              <EmployeeDetailsForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-management"
          element={
            <ProtectedRoute>
              <ProjectManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team-management"
          element={
            <ProtectedRoute>
              <TeamManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId"
          element={
            <ProtectedRoute>
              <TeamDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning"
          element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          }
        />
      </Routes>
      <GlobalSnackbar />
    </ThemeProvider>
  );
};

export default App;
