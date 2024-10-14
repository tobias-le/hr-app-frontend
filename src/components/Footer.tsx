import React from "react";
import { Box } from "@mui/material";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

const Footer: React.FC = () => {
  const theme = useTheme();

  const StyledFooter = styled(Box)`
    background-color: ${theme.palette.primary.main};
    color: white;
    padding: 16px;
    text-align: center;
  `;

  return (
    <StyledFooter as="footer">
      © 2024 HR Tool - All Rights Reserved
    </StyledFooter>
  );
};

export default Footer;
