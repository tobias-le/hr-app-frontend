import React from "react";
import { Location } from "react-router-dom";
import { Box, Toolbar, AppBar as MuiAppBar, Drawer } from "@mui/material";
import AppHeader from "./AppHeader";
import FooterComponent from "./Footer";
import { styled } from "@mui/material/styles";

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

const MainContent = styled(Box)`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing(3)};
  transition: margin 0.2s;
`;

interface LayoutProps {
  children: React.ReactNode;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  isMobile: boolean;
  location: Location;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isDrawerOpen,
  toggleDrawer,
  isMobile,
  location,
}) => {
  return (
    <AppWrapper>
      <AppBar position="fixed">
        <AppHeader toggleDrawer={toggleDrawer} isMobile={isMobile} />
      </AppBar>
      <MainContentWrapper>
        <MainContent>
          <Toolbar />
          {children}
        </MainContent>
      </MainContentWrapper>
      <FooterComponent />
    </AppWrapper>
  );
};

export default Layout;
