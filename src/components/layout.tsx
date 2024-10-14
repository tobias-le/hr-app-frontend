import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  AppBar as MuiAppBar,
  Toolbar,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { menuItems } from "../config/menuItems";

const drawerWidth = 240;

const AppWrapper = styled(Box)`
  display: flex;
  min-height: 100vh;
`;

const AppBar = styled(MuiAppBar)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`;

const Logo = styled(BusinessCenterIcon)`
  color: white;
  background-color: black;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 4px;
  margin-right: 8px;
`;

const StyledDrawer = styled(Drawer)`
  width: ${drawerWidth}px;
  flex-shrink: 0;

  & .MuiDrawer-paper {
    width: ${drawerWidth}px;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: white;
  }
`;

const MainContent = styled(Box)<{ isDrawerOpen: boolean }>`
  flex-grow: 1;
  padding: 24px;
  margin-left: ${({ isDrawerOpen }) => (isDrawerOpen ? `${drawerWidth}px` : 0)};
  transition: margin 0.2s;
`;

const Footer = styled(Box)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: white;
  padding: 16px;
  text-align: center;
`;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <AppWrapper>
      <AppBar position="fixed">
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
              <Logo />
              HR Tool
            </Typography>
          </Box>
          <Box>
            <Button color="inherit">Profile</Button>
            <Button color="inherit">Log out</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <StyledDrawer variant="persistent" open={isDrawerOpen}>
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 2 }}>
            Menu
          </Typography>
          <List>
            {menuItems.map((item: { text: string; path: string }) => (
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
      </StyledDrawer>
      <MainContent isDrawerOpen={isDrawerOpen}>
        <Toolbar />
        {children}
      </MainContent>
      <Footer component="footer">© 2024 HR Tool - All Rights Reserved</Footer>
    </AppWrapper>
  );
}
