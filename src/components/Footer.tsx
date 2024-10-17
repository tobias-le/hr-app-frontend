import React from "react";
import { Box } from "@mui/material";
import styled from "styled-components";

const Footer: React.FC = () => {
  const StyledFooter = styled(Box)`
    background-color: rgba(255, 255, 255, 0.7);
    color: black;
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
