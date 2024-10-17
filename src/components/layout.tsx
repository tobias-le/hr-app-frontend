import React from "react";
import { Location } from "react-router-dom";
import { Box, Toolbar, AppBar as MuiAppBar, Drawer } from "@mui/material";
import AppHeader from "./AppHeader";
import SideMenu from "./SideMenu";
import FooterComponent from "./Footer";
import { styled } from "@mui/material/styles";

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

const MainContent = styled(Box)`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing(3)};
  transition: margin 0.2s;
`;

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: "16px",
  textAlign: "center",
}));

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

  return (
    <AppWrapper>
      <AppBar position="fixed">
        <AppHeader toggleDrawer={toggleDrawer} isMobile={isMobile} />
      </AppBar>
      <MainContentWrapper>
        <StyledDrawer
          variant={isMobile ? "temporary" : "persistent"}
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
