import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import WorkTime from "./components/WorkTime";
import TimeOff from "./components/TimeOff";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/work-time" element={<WorkTime />} />
        <Route path="/time-off" element={<TimeOff />} />
      </Routes>
    </Router>
  );
};

export default App;
