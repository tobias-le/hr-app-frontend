import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import { PageLayout } from "../components/common/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import ApiService from "../services/api.service";
import { useEmployeeStore } from "../store/employeeStore";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import EmployeeForm from "../components/employee/EmployeeForm";
import { EmploymentStatus } from "../types/employee";

const INITIAL_EMPLOYEE_STATE = {
  name: "",
  jobTitle: "",
  employmentStatus: "FULL_TIME" as EmploymentStatus,
  email: "",
  phoneNumber: "",
  currentProjects: [],
  annualSalary: 0,
  annualLearningBudget: 0,
  annualBusinessPerformanceBonusMax: 0,
  annualPersonalPerformanceBonusMax: 0,
  hr: false,
};

const CreateEmployee: React.FC = () => {
  const [formData, setFormData] = useState(INITIAL_EMPLOYEE_STATE);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentEmployee } = useEmployeeStore();
  const { showMessage } = useSnackbarStore();

  if (!currentEmployee?.hr) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanedData = {
        ...formData,
        annualSalary: Number(String(formData.annualSalary).replace(/\s/g, "")),
        annualLearningBudget: Number(
          String(formData.annualLearningBudget).replace(/\s/g, "")
        ),
        annualBusinessPerformanceBonusMax: Number(
          String(formData.annualBusinessPerformanceBonusMax).replace(/\s/g, "")
        ),
        annualPersonalPerformanceBonusMax: Number(
          String(formData.annualPersonalPerformanceBonusMax).replace(/\s/g, "")
        ),
      };

      await ApiService.createEmployee(cleanedData);
      showMessage("Employee created successfully");
      navigate("/employee-management");
    } catch (error) {
      console.error("Failed to create employee:", error);
      showMessage("Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  const getFieldPermissions = (fieldName: string) => {
    // HR can edit everything in create mode
    return { editable: true, visible: true };
  };

  return (
    <PageLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Create New Employee</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/employee-management")}
          data-testid="back-button"
        >
          Back to Employee Management
        </Button>
      </Box>

      <EmployeeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        mode="create"
        getFieldPermissions={getFieldPermissions}
      />

      {loading && <LoadingSpinner fullPage testId="loading-spinner" />}
    </PageLayout>
  );
};

export default CreateEmployee;
