import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/dashboard";
import TimeTracking from "./pages/time-tracking";
import EmployeeList from "./pages/employee-list";
import EmployeeDetail from "./pages/employee-details";
import EmployeeForm from "./pages/employee-form";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/time-tracking" element={<TimeTracking />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
          </Routes>
        </AppLayout>
      </Router>
    </ThemeProvider>
  );
}
