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
} from "@mui/material";
import { Add, Search, Notifications } from "@mui/icons-material";
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
          <Button
            color="inherit"
            className="text-yellow-400"
            component={Link}
            to="/"
            data-testid="attendance-link"
          >
            Attendance
          </Button>
          <Button
            color="inherit"
            className="text-yellow-400"
            component={Link}
            to="/time-off"
            data-testid="time-off-link"
          >
            Time Off{" "}
            <span
              className="ml-1 px-1 bg-red-500 rounded-full text-xs"
              data-testid="time-off-badge"
            >
              50
            </span>
          </Button>
          <Button
            color="inherit"
            className="text-yellow-400"
            component={Link}
            to="/work-time"
            data-testid="work-time-link"
          >
            Work Time
          </Button>
        </div>
        <IconButton color="inherit" className="ml-4" data-testid="add-button">
          <Add />
        </IconButton>
        <IconButton color="inherit" data-testid="search-button">
          <Search />
        </IconButton>
        <IconButton color="inherit" data-testid="notifications-button">
          <Notifications />
        </IconButton>
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
          <MenuItem data-testid="account-menu-item">My account</MenuItem>
          <MenuItem data-testid="logout-menu-item">Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
