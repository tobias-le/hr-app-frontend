import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WorkTime from "./pages/AttendanceRecord";
import TimeOff from "./pages/TimeOff";
import EmployeeDetailsForm from "./pages/EmployeeDetailsForm";
import GlobalSnackbar from "./components/GlobalSnackbar";
import ProjectManagement from "./pages/ProjectManagement";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/work-time" element={<WorkTime />} />
        <Route path="/time-off" element={<TimeOff />} />
        <Route path="/employee-details" element={<EmployeeDetailsForm />} />
        <Route path="/project-management" element={<ProjectManagement />} />
      </Routes>
      <GlobalSnackbar />
    </Router>
  );
};

export default App;
