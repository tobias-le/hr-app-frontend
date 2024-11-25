import React, { useState, useEffect } from "react";
import { Button, Typography, Grid, Chip, Box } from "@mui/material";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import ApiService from "../services/api.service";
import { useEmployeeStore } from "../store/employeeStore";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { FormField } from "../components/common/FormField";
import { PageLayout } from "../components/common/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useForm } from "../hooks/useForm";
import { Employee } from "../types/employee";
import PersonIcon from "@mui/icons-material/Person";
import { isValidEmail, isValidPhone } from "../utils/validation";
import { createProjectChip } from "../utils/chipUtils";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const isHrView = Boolean(id);
  const isOwnProfile = !isHrView;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isHrView && id) {
          const employee = await ApiService.getEmployeeById(Number(id));
          setFormData(employee);
        } else if (currentEmployee) {
          setFormData(currentEmployee);
          const team = await ApiService.getTeamByEmployeeId(currentEmployee.id);
          setTeamManager(team.managerName || "No manager assigned");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showMessage("Failed to load employee details");
        if (isHrView) navigate("/employee-management");
      }
    };

    fetchData();
  }, [id, currentEmployee, setFormData, navigate, showMessage, isHrView]);

  const getFieldPermissions = (fieldName: string) => {
    // HR can edit everything in HR view
    if (currentEmployee?.hr && isHrView) {
      return { editable: true, visible: true };
    }

    // Own profile can only edit contact info
    if (isOwnProfile) {
      switch (fieldName) {
        case "email":
        case "phoneNumber":
          return { editable: true, visible: true };
        case "hr":
          return { editable: false, visible: false };
        default:
          return { editable: false, visible: true };
      }
    }

    return { editable: false, visible: true };
  };

  const getFieldLabel = (fieldName: keyof Employee): string => {
    const labels: Record<keyof Employee, string> = {
      id: "Employee ID",
      name: "Full Name",
      jobTitle: "Job Title",
      employmentStatus: "Employment Status",
      email: "Email Address",
      phoneNumber: "Phone Number",
      currentProjects: "Current Projects",
      annualSalary: "Annual Salary",
      annualLearningBudget: "Learning Budget",
      annualBusinessPerformanceBonusMax: "Business Performance Bonus (Max)",
      annualPersonalPerformanceBonusMax: "Personal Performance Bonus (Max)",
      hr: "HR Access",
    };
    return labels[fieldName];
  };

  const handleUpdateEmployee = async () => {
    setLoading(true);
    try {
      const employeeId = isHrView ? Number(id) : currentEmployee?.id;
      if (!employeeId) return;

      // Clean up the data by removing spaces from currency fields
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

      const updatedData = isHrView
        ? cleanedData
        : {
            ...currentEmployee,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
          };

      const updatedEmployee = await ApiService.updateEmployee(
        employeeId,
        updatedData as Employee
      );

      if (isOwnProfile) {
        updateEmployee(updatedEmployee);
      }

      showMessage("Employee updated successfully");

      if (isHrView) {
        navigate("/employee-management");
      }
    } catch (error) {
      console.error("Failed to update employee:", error);
      showMessage("Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => amount.toLocaleString("cs-CZ");

  const renderField = (
    fieldName: keyof Employee,
    options: { isCurrency?: boolean; [key: string]: any } = {}
  ) => {
    const permissions = getFieldPermissions(fieldName);
    if (!permissions.visible) return null;

    const label = getFieldLabel(fieldName);

    // Special handling for projects display
    if (fieldName === "currentProjects") {
      return (
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {label}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {(formData.currentProjects || []).map((project, idx) => (
              <Chip
                key={idx}
                {...createProjectChip(project)}
                data-testid={`employee-project-${idx}`}
              />
            ))}
          </Box>
        </Grid>
      );
    }

    return (
      <Grid item xs={12} md={6}>
        <FormField
          name={fieldName}
          label={label}
          value={
            options.isCurrency
              ? formatCurrency(formData[fieldName] as number)
              : formData[fieldName]
          }
          onChange={handleChange}
          disabled={!permissions.editable}
          testId={`employee-${fieldName}-input`}
          {...options}
        />
      </Grid>
    );
  };

  return (
    <>
      {isHrView && !currentEmployee?.hr ? (
        <Navigate to="/" replace />
      ) : (
        <PageLayout>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                {isHrView ? "Edit Employee Details" : "Employee Profile"}
              </Typography>
              {isOwnProfile && teamManager && (
                <Chip
                  icon={<PersonIcon />}
                  label={`Manager: ${teamManager}`}
                  sx={{
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              )}
            </Box>
            {isHrView && (
              <Button
                variant="outlined"
                onClick={() => navigate("/employee-management")}
                data-testid="back-button"
              >
                Back to Employee Management
              </Button>
            )}
          </Box>

          <form noValidate autoComplete="off">
            <Grid container spacing={3}>
              {renderField("name")}
              {renderField("jobTitle")}
              {renderField("email", {
                required: true,
                validateNotEmpty: true,
                error: formData.email ? !isValidEmail(formData.email) : false,
                helperText:
                  formData.email && !isValidEmail(formData.email)
                    ? "Please enter a valid email address"
                    : "",
              })}
              {renderField("phoneNumber", {
                error: formData.phoneNumber
                  ? !isValidPhone(formData.phoneNumber)
                  : false,
                helperText:
                  formData.phoneNumber && !isValidPhone(formData.phoneNumber)
                    ? "Phone number must be 9 digits"
                    : "",
                isPhone: true,
              })}
              {renderField("employmentStatus")}
              {renderField("currentProjects")}
              {renderField("annualSalary", { isCurrency: true })}
              {renderField("annualLearningBudget", { isCurrency: true })}
              {renderField("annualBusinessPerformanceBonusMax", {
                isCurrency: true,
              })}
              {renderField("annualPersonalPerformanceBonusMax", {
                isCurrency: true,
              })}
              {renderField("hr", {
                type: "checkbox",
                checked: Boolean(formData.hr),
              })}

              <Grid item xs={12}>
                <Button
                  onClick={handleUpdateEmployee}
                  disabled={Boolean(
                    loading ||
                      (formData.email && !isValidEmail(formData.email)) ||
                      (formData.phoneNumber &&
                        !isValidPhone(formData.phoneNumber))
                  )}
                  variant="contained"
                  color="primary"
                  fullWidth
                  data-testid="update-employee-button"
                >
                  {isHrView ? "Update Employee" : "Update Contact Information"}
                </Button>
              </Grid>
            </Grid>
          </form>
          {loading && <LoadingSpinner fullPage testId="loading-spinner" />}
        </PageLayout>
      )}
    </>
  );
};

export default EmployeeDetails;
