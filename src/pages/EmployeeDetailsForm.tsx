import React, { useState, useEffect } from "react";
import { Button, Typography, Grid, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import ApiService from "../services/api.service";
import { useEmployeeStore } from "../store/employeeStore";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { FormField } from "../components/common/FormField";
import { PageLayout } from "../components/common/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useForm } from "../hooks/useForm";

const EmployeeDetailsForm: React.FC = () => {
  const { selectedEmployee, updateEmployee } = useEmployeeStore();
  const { showMessage } = useSnackbarStore();
  const [loading, setLoading] = useState(false);

  const { formData, handleChange, setFormData } = useForm(
    selectedEmployee || {
      name: "",
      jobTitle: "",
      email: "",
      phoneNumber: "",
    }
  );

  useEffect(() => {
    if (selectedEmployee) {
      setFormData(selectedEmployee);
    }
  }, [selectedEmployee, setFormData]);

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
        showMessage("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [selectedEmployee?.id, updateEmployee, showMessage]);

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee?.id) return;

    setLoading(true);
    try {
      const updatedEmployee = await ApiService.updateEmployee(
        selectedEmployee.id,
        selectedEmployee
      );
      updateEmployee(updatedEmployee);
      showMessage("Employee updated successfully.");
    } catch (error) {
      console.error("Failed to update employee:", error);
      showMessage("Failed to update employee.");
    }
    setLoading(false);
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^\d{9}$/.test(phone);

  if (!selectedEmployee) {
    return (
      <PageLayout>
        <Typography variant="h6">
          Please select an employee from the search bar above
        </Typography>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`Employee Details - ${selectedEmployee.name}`}>
      <form noValidate autoComplete="off" data-testid="employee-details-form">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormField
              name="name"
              label="Name"
              value={selectedEmployee.name}
              onChange={handleChange}
              required
              validateNotEmpty
              testId="employee-name-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="jobTitle"
              label="Job Title"
              value={selectedEmployee.jobTitle}
              onChange={handleChange}
              required
              validateNotEmpty
              testId="employee-job-title-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="email"
              label="Email"
              value={selectedEmployee.email}
              onChange={handleChange}
              required
              validateNotEmpty
              error={!isValidEmail(selectedEmployee.email || "")}
              helperText="Please enter a valid email address"
              testId="employee-email-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="phoneNumber"
              label="Phone Number"
              value={selectedEmployee.phoneNumber}
              onChange={handleChange}
              required
              validateNotEmpty
              error={!isValidPhone(selectedEmployee.phoneNumber || "")}
              helperText="Please enter a valid 9-digit phone number"
              testId="employee-phone-input"
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
              data-testid="update-employee-button"
            >
              Update Employee
            </Button>
          </Grid>
        </Grid>
      </form>
      {loading && <LoadingSpinner fullPage testId="loading-spinner" />}
    </PageLayout>
  );
};

export default EmployeeDetailsForm;
