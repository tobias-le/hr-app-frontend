import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Toolbar, AppBar as MuiAppBar, Drawer } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AppHeader from "./AppHeader";
import SideMenu from "./SideMenu";
import FooterComponent from "./Footer";
import { styled, useTheme } from "@mui/material/styles";

const drawerWidth = 240;

const AppWrapper = styled(Box)`
  display: flex;
  min-height: 100vh;
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
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

  const MainContent = styled(Box)<{ isDrawerOpen: boolean }>`
    flex-grow: 1;
    padding: 24px;
    margin-left: ${({ isDrawerOpen }) =>
      isDrawerOpen ? `${drawerWidth}px` : 0};
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
        <AppHeader toggleDrawer={toggleDrawer} />
      </AppBar>
      <StyledDrawer variant="persistent" open={isDrawerOpen}>
        <SideMenu isOpen={isDrawerOpen} location={location} />
      </StyledDrawer>
      <MainContent isDrawerOpen={isDrawerOpen}>
        <Toolbar />
        {children}
      </MainContent>
      <StyledFooter>
        <FooterComponent />
      </StyledFooter>
    </AppWrapper>
  );
};

export default Layout;
