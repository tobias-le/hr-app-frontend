import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { Add, Search, Notifications } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <AppBar position="static" className="bg-gray-900">
      <Toolbar>
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
        <IconButton color="inherit">
          <img
            src="/placeholder.svg"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
