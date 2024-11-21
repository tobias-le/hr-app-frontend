import { useState, useCallback, useEffect } from "react";
import { useEmployeeStore } from "../store/employeeStore";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { Employee } from "../types/employee";
import { validateEmployee } from "../utils/validationUtils";
import ApiService from "../services/api.service";

export const useEmployeeForm = () => {
  const { selectedEmployee, updateEmployee } = useEmployeeStore();
  const { showMessage } = useSnackbarStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Initialize form data when selected employee changes
  useEffect(() => {
    if (selectedEmployee) {
      setFormData(selectedEmployee);
    }
  }, [selectedEmployee]);

  const handleChange = useCallback(
    (event: any) => {
      const { name, value } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate field on change
      const errors = validateEmployee({ ...formData, [name]: value });
      setValidationErrors(errors);
    },
    [formData]
  );

  const handleUpdateEmployee = useCallback(async () => {
    if (!selectedEmployee?.id) return;

    const errors = validateEmployee(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const updatedEmployee = await ApiService.updateEmployee(
        selectedEmployee.id,
        formData as Employee
      );
      updateEmployee(updatedEmployee);
      showMessage("Employee updated successfully");
    } catch (error) {
      console.error("Failed to update employee:", error);
      showMessage("Failed to update employee");
    } finally {
      setLoading(false);
    }
  }, [formData, selectedEmployee?.id, updateEmployee, showMessage]);

  return {
    formData,
    handleChange,
    handleUpdateEmployee,
    loading,
    validationErrors,
    selectedEmployee,
  };
};
