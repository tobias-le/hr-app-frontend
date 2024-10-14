import React, { useState } from "react";
import styled from "styled-components";
import { TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { orange } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";

const PageContainer = styled.div`
  flex-grow: 1;
  padding: 24px;
`;

const StyledPaper = styled(Paper)`
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
`;

const FormTitle = styled(Typography)`
  font-weight: bold;
  margin-bottom: 16px;
`;

const FormGrid = styled(Grid)`
  & > * {
    margin-bottom: 24px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

export default function TimeTracking() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [workDetails, setWorkDetails] = useState("");
  const theme = useTheme();

  const PageContainerWithBackground = styled(PageContainer)`
    background-color: ${theme.palette.background.default};
  `;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ date, startTime, endTime, workDetails });
  };

  return (
    <PageContainerWithBackground>
      <StyledPaper elevation={0}>
        <FormTitle variant="h5">Track Work Hours</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGrid container>
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
              <ButtonContainer>
                <Button variant="outlined" color="primary">
                  Cancel
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </ButtonContainer>
            </Grid>
          </FormGrid>
        </form>
      </StyledPaper>
    </PageContainerWithBackground>
  );
}
