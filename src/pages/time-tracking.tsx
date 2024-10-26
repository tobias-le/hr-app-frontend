import React, { useState } from "react";
import styled from "styled-components";
import { TextField, Button, Typography, Grid } from "@mui/material";

const PageContainer = styled.div`
  flex-grow: 1;
  padding: 24px;
`;

const FormTitle = styled(Typography)`
  font-weight: bold;
  margin-bottom: 80px;
`;

const FormGrid = styled(Grid)`
  & > * {
    margin-bottom: 32px;
    margin-top: 32px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
`;

export default function TimeTracking() {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    workDetails: "",
  });

  const PageContainerWithBackground = styled(PageContainer)`
    background-color: rgba(255, 255, 255, 0.7);
  `;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  console.log("TimeTracking component rendered");

  return (
    <PageContainerWithBackground>
      <FormTitle variant="h5" gutterBottom>
        Track Work Hours
      </FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGrid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Select Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  date: e.target.value,
                }))
              }
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  startTime: e.target.value,
                }))
              }
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  endTime: e.target.value,
                }))
              }
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
              name="workDetails"
              onChange={handleInputChange}
              placeholder="Describe your work..."
              required
            />
          </Grid>
        </FormGrid>
        <ButtonContainer>
          <Button variant="outlined" color="primary">
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </ButtonContainer>
      </form>
    </PageContainerWithBackground>
  );
}