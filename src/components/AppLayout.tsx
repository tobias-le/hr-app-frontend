import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery, Drawer, Toolbar } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Layout from "./layout";
import SideMenu from "./SideMenu";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const location = useLocation();
  const drawerWidth = 240;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

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
    <>
      <StyledDrawer
        variant={isMobile ? "temporary" : "persistent"}
        open={isDrawerOpen}
        onClose={toggleDrawer}
      >
        <Toolbar />
        <SideMenu isOpen={isDrawerOpen} location={location} />
      </StyledDrawer>
      <Layout
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        isMobile={isMobile}
        location={location}
      >
        {children}
      </Layout>
    </>
  );
};

export default AppLayout;
