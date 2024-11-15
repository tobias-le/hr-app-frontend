import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  Avatar,
  Tooltip,
  Divider,
  Box,
} from "@mui/material";
import {
  Dashboard,
  EventNote,
  Timer,
  FolderSpecial,
  Groups,
    School
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { stringToColor } from "../utils/colorUtils";
import { useEmployeeStore } from "../store/employeeStore";

const Header: React.FC = () => {
  const { employees, selectedEmployee, fetchEmployees, setSelectedEmployee } =
    useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <AppBar position="static" data-testid="header">
      <Toolbar>
        <Autocomplete
          sx={{ width: 300, mr: 2 }}
          options={employees}
          getOptionLabel={(option) => option.name}
          value={selectedEmployee}
          onChange={(_, newValue) => setSelectedEmployee(newValue)}
          data-testid="employee-search"
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              placeholder="Search employee"
              data-testid="employee-search-input"
            />
          )}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }} data-testid="app-title">
          <Link
            to="/"
            style={{ textDecoration: "none", color: "white" }}
            data-testid="home-link"
          >
            <Box
              component="span"
              sx={{ fontWeight: "bold", color: "secondary.main" }}
            >
              time.ly
            </Box>
            {" Time Management"}
          </Link>
        </Typography>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
          data-testid="nav-buttons"
        >
          <Tooltip title="Dashboard">
            <IconButton
              className="header-icon"
              component={Link}
              to="/"
              data-testid="dashboard-link"
            >
              <Dashboard />
            </IconButton>
          </Tooltip>
          <Tooltip title="Time Off">
            <IconButton
              className="header-icon"
              component={Link}
              to="/time-off"
              data-testid="time-off-link"
            >
              <EventNote />
            </IconButton>
          </Tooltip>
          <Tooltip title="Work Time">
            <IconButton
              className="header-icon"
              component={Link}
              to="/work-time"
              data-testid="work-time-link"
            >
              <Timer />
            </IconButton>
          </Tooltip>
          <Tooltip title="Projects">
            <IconButton
              className="header-icon"
              component={Link}
              to="/project-management"
              data-testid="project-management-link"
            >
              <FolderSpecial />
            </IconButton>
          </Tooltip>
          <Tooltip title="Team Management">
            <IconButton
              className="header-icon"
              component={Link}
              to="/team-management"
              data-testid="team-management-link"
            >
              <Groups />
            </IconButton>
          </Tooltip>
          <Tooltip title="Learning">
            <IconButton
                className="header-icon"
                component={Link}
                to="/learning"
                data-testid="learning-link"
            >
              <School />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider orientation="vertical" flexItem className="header-divider" />
        <IconButton
          className="header-icon"
          component={Link}
          to="/employee-details"
          data-testid="profile-button"
          sx={{ padding: 1.5 }}
        >
          <Avatar
            alt={selectedEmployee?.name || "User"}
            sx={{
              width: 40,
              height: 40,
              bgcolor: stringToColor(selectedEmployee?.name || ""),
            }}
            data-testid="profile-avatar"
          >
            {selectedEmployee?.name
              ? selectedEmployee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : ""}
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
