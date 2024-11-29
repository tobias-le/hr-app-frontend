import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Dashboard,
  EventNote,
  Timer,
  FolderSpecial,
  Groups,
  School,
  BadgeOutlined,
  Logout,
  Search, Inbox, ContactMail,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { stringToColor } from "../utils/colorUtils";
import { useEmployeeStore } from "../store/employeeStore";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const Header: React.FC = () => {
  const currentEmployee = useEmployeeStore((state) => state.currentEmployee);
  const { logout } = useAuth();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const iconButtonStyle = (path: string) => ({
    color: location.pathname === path ? "white" : "inherit",
    transition: "color 0.6s ease",
    "&:hover": {
      color: "white",
    },
  });

  const profileButtonStyle = {
    padding: 1.5,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  };

  return (
    <AppBar position="static" data-testid="header">
      <Toolbar>
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
          {currentEmployee?.hr && (
            <>
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
              <Tooltip title="Employee Management">
                <IconButton
                  className="header-icon"
                  component={Link}
                  to="/employee-management"
                  data-testid="employees-link"
                  sx={iconButtonStyle("/employee-management")}
                >
                  <BadgeOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Pending Requests">
                <IconButton
                    className="header-icon"
                    component={Link}
                    to="/requests/pending"
                    data-testid="pending-requests-link"
                >
                  <Inbox />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Time Off">
            <IconButton
              className="header-icon"
              component={Link}
              to="/time-off"
              data-testid="time-off-link"
              sx={iconButtonStyle("/time-off")}
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
              sx={iconButtonStyle("/work-time")}
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
              sx={iconButtonStyle("/project-management")}
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
              sx={iconButtonStyle("/team-management")}
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
              sx={iconButtonStyle("/learning")}
            >
              <School />
            </IconButton>
          </Tooltip>
          <Tooltip title="Contact HR">
            <IconButton
            className="header-icon"
            component={Link}
            to="/requests"
            data-testid="request-link"
            >
              <ContactMail/>
            </IconButton>
          </Tooltip>
        </Box>
        <Divider orientation="vertical" flexItem className="header-divider" />
        <IconButton
          className="header-icon"
          onClick={handleClick}
          data-testid="profile-button"
          sx={{
            ...profileButtonStyle,
            color:
              location.pathname === "/employee-details" ? "white" : "inherit",
            "&:hover": {
              ...profileButtonStyle["&:hover"],
              color: "white",
            },
          }}
        >
          <Avatar
            alt={currentEmployee?.name || "User"}
            sx={{
              width: 40,
              height: 40,
              bgcolor: stringToColor(currentEmployee?.name || ""),
            }}
            data-testid="profile-avatar"
          >
            {currentEmployee?.name
              ? currentEmployee.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
              : ""}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem
            component={Link}
            to="/employee-details"
            data-testid="profile-menu-item"
          >
            Profile
          </MenuItem>
          <MenuItem onClick={logout} data-testid="logout-menu-item">
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
