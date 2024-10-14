import { createTheme } from "@mui/material/styles";
import { orange, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[400],
    },
    secondary: {
      main: grey[200],
    },
  },
  // Add more custom theme options here
});

export default theme;
