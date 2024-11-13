import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
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
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { stringToColor } from "../utils/colorUtils";
import { useEmployeeStore } from "../store/employeeStore";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { employees, selectedEmployee, fetchEmployees, setSelectedEmployee } =
    useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        </Box>
        <Divider orientation="vertical" flexItem className="header-divider" />
        <IconButton
          className="header-icon"
          onClick={handleClick}
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
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          data-testid="profile-menu"
          MenuListProps={{
            "aria-labelledby": "profile-button",
          }}
          PaperProps={{
            sx: {
              minWidth: "200px",
            },
          }}
        >
          <MenuItem data-testid="profile-menu-item" sx={{ py: 1 }}>
            <Link
              to="/employee-details"
              style={{ textDecoration: "none", color: "inherit" }}
              data-testid="profile-link"
            >
              Profile
            </Link>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
