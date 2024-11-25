import React, { useState, useEffect } from "react";
import { Button, Typography, Grid, Chip, Box } from "@mui/material";
import ApiService from "../services/api.service";
import { useEmployeeStore } from "../store/employeeStore";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { FormField } from "../components/common/FormField";
import { PageLayout } from "../components/common/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useForm } from "../hooks/useForm";
import { Employee } from "../types/employee";
import PersonIcon from "@mui/icons-material/Person";

const EmployeeDetailsForm: React.FC = () => {
  const { currentEmployee, updateEmployee } = useEmployeeStore();
  const { showMessage } = useSnackbarStore();
  const [loading, setLoading] = useState(false);
  const [teamManager, setTeamManager] = useState<string>("");

  const { formData, handleChange, setFormData } = useForm({
    id: 0,
    name: "",
    jobTitle: "",
    employmentStatus: "",
    email: "",
    phoneNumber: "",
    currentProjects: [],
    annualSalary: 0,
    annualLearningBudget: 0,
    annualBusinessPerformanceBonusMax: 0,
    annualPersonalPerformanceBonusMax: 0,
    hr: false,
  } as Employee);

  useEffect(() => {
    const fetchTeamManager = async () => {
      if (currentEmployee?.id) {
        try {
          const team = await ApiService.getTeamByEmployeeId(currentEmployee.id);
          setTeamManager(team.managerName || "No manager assigned");
        } catch (error) {
          console.error("Failed to fetch team manager:", error);
          setTeamManager("Unable to load manager");
        }
      }
    };

    if (currentEmployee) {
      setFormData(currentEmployee);
      fetchTeamManager();
    }
  }, [currentEmployee, setFormData]);

  const handleUpdateEmployee = async () => {
    if (!currentEmployee?.id) return;

    setLoading(true);
    try {
      const updatedData = {
        ...currentEmployee,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      };

      const updatedEmployee = await ApiService.updateEmployee(
        currentEmployee.id,
        updatedData
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

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("cs-CZ")} Kč`;
  };

  if (!currentEmployee) {
    return (
      <PageLayout>
        <Typography variant="h6">
          Please select an employee from the search bar above
        </Typography>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Employee Details - {currentEmployee.name}
        </Typography>
        {teamManager && (
          <Chip
            icon={<PersonIcon />}
            label={`Manager: ${teamManager}`}
            sx={{
              backgroundColor: "primary.light",
              color: "primary.contrastText",
              "& .MuiChip-icon": {
                color: "inherit",
              },
            }}
          />
        )}
      </Box>
      <form noValidate autoComplete="off" data-testid="employee-details-form">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              disabled={true}
              testId="employee-name-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="jobTitle"
              label="Job Title"
              value={formData.jobTitle}
              onChange={handleChange}
              disabled={true}
              testId="employee-job-title-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
              validateNotEmpty
              error={!isValidEmail(formData.email || "")}
              helperText="Please enter a valid email address"
              testId="employee-email-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              validateNotEmpty
              error={!isValidPhone(formData.phoneNumber || "")}
              helperText="Please enter a valid 9-digit phone number"
              testId="employee-phone-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="employmentStatus"
              label="Employment Status"
              value={formData.employmentStatus}
              onChange={handleChange}
              disabled={true}
              testId="employee-status-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="currentProjects"
              label="Current Projects"
              value={formData.currentProjects?.join(", ") || ""}
              onChange={handleChange}
              disabled={true}
              testId="employee-projects-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="annualSalary"
              label="Annual Salary"
              value={formatCurrency(formData.annualSalary || 0)}
              onChange={handleChange}
              disabled={true}
              testId="employee-salary-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="annualLearningBudget"
              label="Annual Learning Budget"
              value={formatCurrency(formData.annualLearningBudget || 0)}
              onChange={handleChange}
              disabled={true}
              testId="employee-learning-budget-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="annualBusinessPerformanceBonusMax"
              label="Annual Business Performance Bonus Max"
              value={formatCurrency(
                formData.annualBusinessPerformanceBonusMax || 0
              )}
              onChange={handleChange}
              disabled={true}
              testId="employee-business-bonus-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="annualPersonalPerformanceBonusMax"
              label="Annual Personal Performance Bonus Max"
              value={formatCurrency(
                formData.annualPersonalPerformanceBonusMax || 0
              )}
              onChange={handleChange}
              disabled={true}
              testId="employee-personal-bonus-input"
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              name="hr"
              label="HR Access"
              type="checkbox"
              checked={Boolean(formData.hr)}
              onChange={handleChange}
              disabled={true}
              testId="employee-hr-checkbox"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleUpdateEmployee}
              disabled={
                !isValidEmail(formData.email || "") ||
                !isValidPhone(formData.phoneNumber || "")
              }
              variant="contained"
              color="primary"
              fullWidth
              data-testid="update-employee-button"
            >
              Update Contact Information
            </Button>
          </Grid>
        </Grid>
      </form>
      {loading && <LoadingSpinner fullPage testId="loading-spinner" />}
    </PageLayout>
  );
};

export default EmployeeDetailsForm;
