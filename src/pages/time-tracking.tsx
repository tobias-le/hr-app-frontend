import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { orange } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[400],
    },
  },
});

export default function TimeTracking() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [workDetails, setWorkDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ date, startTime, endTime, workDetails });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Track Work Hours
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Select Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Work Details"
                  multiline
                  rows={4}
                  value={workDetails}
                  onChange={(e) => setWorkDetails(e.target.value)}
                  placeholder="Describe your work..."
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="error">
                  * Please correct the highlighted errors before submitting.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button variant="outlined" color="primary">
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
