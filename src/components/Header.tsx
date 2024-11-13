import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Autocomplete,
  TextField,
  Avatar,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  EventNote,
  Timer,
  FolderSpecial,
  Notifications,
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
    <AppBar position="static" className="bg-gray-900" data-testid="header">
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
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />
          )}
        />
        <Typography variant="h6" className="flex-grow" data-testid="app-title">
          <Link
            to="/"
            className="no-underline text-white"
            data-testid="home-link"
          >
            <span className="font-bold text-yellow-400">time.ly</span> Time
            Management
          </Link>
        </Typography>
        <div className="flex items-center space-x-4" data-testid="nav-buttons">
          <Tooltip title="Dashboard">
            <IconButton
              color="inherit"
              className="text-yellow-400"
              component={Link}
              to="/"
              data-testid="dashboard-link"
            >
              <Dashboard />
            </IconButton>
          </Tooltip>
          <Tooltip title="Time Off">
            <IconButton
              color="inherit"
              className="text-yellow-400"
              component={Link}
              to="/time-off"
              data-testid="time-off-link"
            >
              <EventNote />
            </IconButton>
          </Tooltip>
          <Tooltip title="Work Time">
            <IconButton
              color="inherit"
              className="text-yellow-400"
              component={Link}
              to="/work-time"
              data-testid="work-time-link"
            >
              <Timer />
            </IconButton>
          </Tooltip>
          <Tooltip title="Projects">
            <IconButton
              color="inherit"
              className="text-yellow-400"
              component={Link}
              to="/project-management"
              data-testid="project-management-link"
            >
              <FolderSpecial />
            </IconButton>
          </Tooltip>
        </div>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 2,
            my: 2,
            borderRightWidth: 2,
            borderColor: "rgba(255, 255, 255, 0.12)",
            height: "60%",
            alignSelf: "center",
          }}
        />
        <IconButton
          color="inherit"
          onClick={handleClick}
          data-testid="profile-button"
        >
          <Avatar
            alt={useEmployeeStore.getState().selectedEmployee?.name || "User"}
            className="w-8 h-8"
            data-testid="profile-avatar"
            sx={{
              bgcolor: stringToColor(
                useEmployeeStore.getState().selectedEmployee?.name || ""
              ),
            }}
          >
            {useEmployeeStore.getState().selectedEmployee?.name
              ? useEmployeeStore
                  .getState()
                  .selectedEmployee?.name.split(" ")
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
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
              },
            },
          }}
        >
          <MenuItem data-testid="profile-menu-item">
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
