import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import TimeTracking from "./pages/time-tracking";
import EmployeeList from "./pages/employee-list";
import EmployeeDetail from "./pages/employee-details";
import EmployeeForm from "./pages/employee-form";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/time-tracking" element={<TimeTracking />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}
