import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  isMobile: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ toggleDrawer, isMobile }) => (
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
          variant={isMobile ? "body1" : "h6"}
          noWrap
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Logo />
          {!isMobile && "HR Tool"}
        </Typography>
      </Box>
      <Box>
        {!isMobile && (
          <>
            <Button color="inherit">Profile</Button>
            <Button color="inherit">Log out</Button>
          </>
        )}
        {isMobile && (
          <IconButton color="inherit" aria-label="menu">
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>
    </Toolbar>
  </AppBar>
);

export default AppHeader;
