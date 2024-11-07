import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ApiService from "../services/api.service";
import Header from "../components/Header";
import { useEmployeeStore } from "../store/employeeStore";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3),
  maxWidth: 800,
  marginLeft: "auto",
  marginRight: "auto",
}));

const FullPageLoader = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(3px)",
  zIndex: 1300,
});

const EmployeeDetailsForm: React.FC = () => {
  const { selectedEmployee, updateEmployee } = useEmployeeStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!selectedEmployee?.id) return;

      setLoading(true);
      try {
        const employeeData = await ApiService.getEmployeeById(
          selectedEmployee.id
        );
        updateEmployee(employeeData);
      } catch (error) {
        console.error("Failed to fetch employee details:", error);
        setMessage("Failed to fetch employee details");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [selectedEmployee?.id, updateEmployee]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (selectedEmployee?.id) {
      updateEmployee({
        ...selectedEmployee,
        [name]: value,
      });
    }
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee?.id) return;

    setLoading(true);
    setMessage("");
    try {
      await ApiService.updateEmployee(selectedEmployee.id, selectedEmployee);
      setMessage("Employee updated successfully.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Failed to update employee:", error);
      setMessage("Failed to update employee.");
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^\d{9}$/.test(phone);

  if (!selectedEmployee) {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <Header />
        <Typography variant="h6" className="m-4">
          Please select an employee from the search bar above
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Employee Details - {selectedEmployee.name}
        </Typography>
        <form noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={selectedEmployee.name}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Job Title"
                name="jobTitle"
                value={selectedEmployee.jobTitle}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={selectedEmployee.email}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={selectedEmployee.phoneNumber}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleUpdateEmployee}
                disabled={
                  !isValidEmail(selectedEmployee.email || "") ||
                  !isValidPhone(selectedEmployee.phoneNumber || "")
                }
                variant="contained"
                color="primary"
                fullWidth
              >
                Update Employee
              </Button>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
      {loading && (
        <FullPageLoader>
          <CircularProgress />
        </FullPageLoader>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </div>
  );
};

export default EmployeeDetailsForm;
