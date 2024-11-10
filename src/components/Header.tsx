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

  return (
    <AppBar position="static" className="bg-gray-900">
      <Toolbar>
        <Autocomplete
          sx={{ width: 300, mr: 2 }}
          options={employees}
          getOptionLabel={(option) => option.name}
          value={selectedEmployee}
          onChange={(_, newValue) => setSelectedEmployee(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              placeholder="Search employee"
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
        <Typography variant="h6" className="flex-grow">
          <Link to="/" className="no-underline text-white">
            <span className="font-bold text-yellow-400">time.ly</span> Time
            Management
          </Link>
        </Typography>
        <div className="flex items-center space-x-4">
          <Button
            color="inherit"
            className="text-yellow-400"
            component={Link}
            to="/"
          >
            Attendance
          </Button>
          <Button
            color="inherit"
            className="text-yellow-400"
            component={Link}
            to="/time-off"
          >
            Time Off{" "}
            <span className="ml-1 px-1 bg-red-500 rounded-full text-xs">
              50
            </span>
          </Button>
          <Button
            color="inherit"
            className="text-yellow-400"
            component={Link}
            to="/work-time"
          >
            Work Time
          </Button>
        </div>
        <IconButton color="inherit" className="ml-4">
          <Add />
        </IconButton>
        <IconButton color="inherit">
          <Search />
        </IconButton>
        <IconButton color="inherit">
          <Notifications />
        </IconButton>
        <IconButton color="inherit" onClick={handleClick}>
          <Avatar
            alt={useEmployeeStore.getState().selectedEmployee?.name || "User"}
            className="w-8 h-8"
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
          keepMounted
          open={Boolean(anchorEl)}
        >
          <MenuItem>
            <Link
              to="/employee-details"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Profile
            </Link>
          </MenuItem>
          <MenuItem>My account</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
