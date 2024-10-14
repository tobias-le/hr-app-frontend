import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  Button,
  createTheme,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { orange, grey } from "@mui/material/colors";

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: orange[400],
    },
    secondary: {
      main: grey[200],
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const menuItems = [
    { text: "Dashboard", path: "/" },
    { text: "Time Tracking", path: "/time-tracking" },
    { text: "Employees", path: "/employees" },
    { text: "Reports", path: "/reports" },
    { text: "Settings", path: "/settings" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                aria-label="toggle drawer"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <BusinessCenterIcon
                  sx={{
                    color: "white",
                    bgcolor: "black",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    p: 0.5,
                    mr: 1,
                  }}
                />
                HR Tool
              </Typography>
            </Box>
            <Box>
              <Button color="inherit">Profile</Button>
              <Button color="inherit">Log out</Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          open={isDrawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "primary.main",
              color: "white",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto", mt: 2 }}>
            <Typography variant="h6" sx={{ px: 2, mb: 2 }}>
              Menu
            </Typography>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      "&.Mui-selected": {
                        bgcolor: "secondary.main",
                        color: "text.primary",
                      },
                    }}
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: isDrawerOpen ? `${drawerWidth}px` : 0,
            transition: "margin 0.2s",
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
      <Box
        component="footer"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 2,
          textAlign: "center",
        }}
      >
        © 2024 HR Tool - All Rights Reserved
      </Box>
    </ThemeProvider>
  );
}
