import React, { useState, useEffect } from "react";
import { Button, Typography, Grid, Chip, Box, MenuItem } from "@mui/material";
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
import { SelectChangeEvent } from "@mui/material/Select";
import { Team } from "../types/team";
import CompletedCoursesTable from "../components/CompletedCoursesTable";
import { toNumber } from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const INITIAL_EMPLOYEE_STATE: Employee = {
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
};

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "FULL_TIME", label: "Full Time (8h)", hours: 8 },
  { value: "PART_TIME", label: "Part Time (4h)", hours: 4 },
  { value: "CONTRACT", label: "Contract", hours: 0 },
];

const useEmployeeData = (id: string | undefined, isHrView: boolean) => {
  const { currentEmployee } = useEmployeeStore();
  const [teamManager, setTeamManager] = useState<string>("");
  const [managedTeam, setManagedTeam] = useState<Team | null>(null);
  const { formData, setFormData } = useForm(INITIAL_EMPLOYEE_STATE);
  const navigate = useNavigate();
  const { showMessage } = useSnackbarStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id === "create") {
          // Reset to initial state for create mode
          setFormData(INITIAL_EMPLOYEE_STATE);
          return;
        }

        let employeeData;
        if (isHrView && id) {
          employeeData = await ApiService.getEmployeeById(Number(id));
          setFormData(employeeData);
        } else if (currentEmployee) {
          employeeData = currentEmployee;
          setFormData(employeeData);
        }

        if (employeeData) {
          // Check if employee is a manager
          const managedTeamData = await ApiService.getTeamByManagerId(
            employeeData.id
          );
          setManagedTeam(managedTeamData);

          // Get employee's team info
          const team = await ApiService.getTeamByEmployeeId(employeeData.id);
          if (team && team.managerName) {
            setTeamManager(team.managerName);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showMessage("Failed to load employee details");
        if (isHrView) navigate("/employee-management");
      }
    };

    fetchData();
  }, [id, currentEmployee, setFormData, navigate, showMessage, isHrView]);

  return { formData, setFormData, teamManager, managedTeam };
};

const EmployeeDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEmployee, updateEmployee } = useEmployeeStore();
  const { showMessage } = useSnackbarStore();
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, teamManager, managedTeam } = useEmployeeData(
    id,
    Boolean(id)
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isHrView = Boolean(id);
  const isOwnProfile = !isHrView;
  const isCreateMode = id === "create";

  const getFieldPermissions = (fieldName: string) => {
    // HR can edit everything in HR view
    if (currentEmployee?.hr && isHrView) {
      return { editable: true, visible: true };
    }

    // For own profile, only contact info is editable
    const contactFields = ["email", "phoneNumber"];
    if (isOwnProfile) {
      return {
        editable: contactFields.includes(fieldName),
        visible: fieldName !== "hr",
      };
    }

    // Default case - visible but not editable
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

      if (isCreateMode) {
        await ApiService.createEmployee(cleanedData as Employee);
        showMessage("Employee created successfully");
      } else {
        const employeeId = isHrView ? Number(id) : currentEmployee?.id;
        if (!employeeId) return;

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
      }

      navigate("/employee-management");
    } catch (error) {
      console.error(
        isCreateMode
          ? "Failed to create employee:"
          : "Failed to update employee:",
        error
      );
      showMessage(
        isCreateMode ? "Failed to create employee" : "Failed to update employee"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => amount.toLocaleString("cs-CZ");

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    const type = (e.target as HTMLInputElement).type;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const renderField = (
    fieldName: keyof Employee,
    options: { isCurrency?: boolean; [key: string]: any } = {}
  ) => {
    const permissions = getFieldPermissions(fieldName);
    if (!permissions.visible) return null;

    const label = getFieldLabel(fieldName);

    // Special handling for employment status
    if (fieldName === "employmentStatus") {
      return (
        <Grid item xs={12} md={6}>
          <FormField
            name={fieldName}
            label={label}
            value={formData[fieldName]}
            onChange={handleChange}
            disabled={!permissions.editable}
            select
            testId={`employee-${fieldName}-input`}
          >
            {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                data-testid={`employment-status-option-${option.value}`}
              >
                {option.label}
              </MenuItem>
            ))}
          </FormField>
        </Grid>
      );
    }

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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await ApiService.deleteEmployee(Number(id));
      showMessage("Employee deleted successfully");
      navigate("/employee-management");
    } catch (error) {
      console.error("Failed to delete employee:", error);
      showMessage("Failed to delete employee");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      {isHrView && !currentEmployee?.hr ? (
        <Navigate to="/" replace />
      ) : (
        <PageLayout>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h6">
                {isCreateMode
                  ? "Create New Employee"
                  : isHrView
                  ? "Edit Employee Details"
                  : "Employee Profile"}
              </Typography>
              {!isCreateMode && (
                <>
                  {managedTeam && (
                    <Chip
                      icon={<PersonIcon />}
                      label={`Team Manager of ${managedTeam.name}`}
                      sx={{
                        backgroundColor: "success.light",
                        color: "success.contrastText",
                        "& .MuiChip-icon": { color: "inherit" },
                      }}
                    />
                  )}
                  {teamManager ? (
                    <Chip
                      icon={<PersonIcon />}
                      label={`Reports to ${teamManager}`}
                      sx={{
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                        "& .MuiChip-icon": { color: "inherit" },
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<PersonIcon />}
                      label="Not currently part of any team"
                      sx={{
                        backgroundColor: "grey.400",
                        color: "grey.900",
                        "& .MuiChip-icon": { color: "inherit" },
                      }}
                    />
                  )}
                </>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              {isHrView && !isCreateMode && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteClick}
                  data-testid="delete-employee-button"
                >
                  Delete Employee
                </Button>
              )}
            </Box>
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
                  {isCreateMode
                    ? "Create Employee"
                    : isHrView
                    ? "Update Employee"
                    : "Update Contact Information"}
                </Button>
              </Grid>
            </Grid>
          </form>
          {!isCreateMode && (
            <CompletedCoursesTable
              employeeId={
                id ? toNumber(id) : currentEmployee ? currentEmployee.id : 0
              }
            />
          )}
          {loading && <LoadingSpinner fullPage testId="loading-spinner" />}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Delete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this employee?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </PageLayout>
      )}
    </>
  );
};

export default EmployeeDetails;
