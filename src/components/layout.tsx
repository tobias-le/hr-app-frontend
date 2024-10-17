import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Toolbar,
  AppBar as MuiAppBar,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AppHeader from "./AppHeader";
import SideMenu from "./SideMenu";
import FooterComponent from "./Footer";
import { styled, useTheme } from "@mui/material/styles";

const drawerWidth = 240;

const AppWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContentWrapper = styled(Box)`
  display: flex;
  flex-grow: 1;
`;

const AppBar = styled(MuiAppBar)(
  ({ theme }) => `
  z-index: ${theme.zIndex.drawer + 1};
`
);

const Logo = styled(BusinessCenterIcon)`
  color: white;
  background-color: black;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 4px;
  margin-right: 8px;
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const location = useLocation();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const StyledDrawer = styled(Drawer)`
    width: ${drawerWidth}px;
    flex-shrink: 0;

    & .MuiDrawer-paper {
      width: ${drawerWidth}px;
      box-sizing: border-box;
      background-color: ${theme.palette.primary.main};
      color: white;
    }
  `;

  const MainContent = styled(Box)`
    flex-grow: 1;
    padding: ${theme.spacing(3)};
    transition: margin 0.2s;
  `;

  const StyledFooter = styled(Box)`
    background-color: ${theme.palette.primary.main};
    color: white;
    padding: 16px;
    text-align: center;
  `;

  return (
    <AppWrapper>
      <AppBar position="fixed">
        <AppHeader toggleDrawer={toggleDrawer} isMobile={isMobile} />
      </AppBar>
      <MainContentWrapper>
        <StyledDrawer
          variant={isMobile ? "temporary" : "temporary"}
          open={isDrawerOpen}
          onClose={toggleDrawer}
        >
          <Toolbar />
          <SideMenu isOpen={isDrawerOpen} location={location} />
        </StyledDrawer>
        <MainContent>
          <Toolbar />
          {children}
        </MainContent>
      </MainContentWrapper>
      <StyledFooter>
        <FooterComponent />
      </StyledFooter>
    </AppWrapper>
  );
};

export default Layout;
