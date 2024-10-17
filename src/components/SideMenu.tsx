import React from "react";
import { Link, Location } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Toolbar,
} from "@mui/material";
import { menuItems } from "../config/menuItems";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

const SideMenu: React.FC<{ isOpen: boolean; location: Location }> = ({
  isOpen,
  location,
}) => {
  const theme = useTheme();

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

  return (
    <StyledDrawer variant="persistent" open={isOpen}>
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
  );
};

export default SideMenu;
