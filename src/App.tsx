import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import HrBoard from "./pages/HrBoard";
import GeneralRequests from "./pages/GeneralRequest";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/work-time" element={<WorkTime />} />
          <Route path="/time-off" element={<TimeOff />} />
          <Route path="/employee-details" element={<EmployeeDetailsForm />} />
          <Route path="/project-management" element={<ProjectManagement />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/team-management" element={<TeamManagement />} />
          <Route path="/teams/:teamId" element={<TeamDetails />} />
          <Route path="/learning" element={<Learn />} />
          <Route path="/requests/pending" element={<HrBoard/>} />
          <Route path="/requests" element={<GeneralRequests/>}/>
        </Routes>
        <GlobalSnackbar />
      </Router>
    </ThemeProvider>
  );
};

export default App;
