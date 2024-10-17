import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Layout from "./layout";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const location = useLocation();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Layout
      isDrawerOpen={isDrawerOpen}
      toggleDrawer={toggleDrawer}
      isMobile={isMobile}
      location={location}
    >
      {children}
    </Layout>
  );
};

export default AppLayout;
