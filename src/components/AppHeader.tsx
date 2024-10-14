import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import styled from "styled-components";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex?.drawer ? theme.zIndex.drawer + 1 : 1200,
}));

const Logo = styled(BusinessCenterIcon)(({ theme }) => ({
  color: "white",
  backgroundColor: "black",
  width: 24,
  height: 24,
  borderRadius: "50%",
  padding: 4,
  marginRight: 8,
}));

interface AppHeaderProps {
  toggleDrawer: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ toggleDrawer }) => (
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
);

export default AppHeader;
