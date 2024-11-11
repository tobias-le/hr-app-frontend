import { create } from "zustand";
import API_CONFIG from "../config/api.config";
import { Employee } from "../types/employee";

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  fetchEmployees: () => Promise<void>;
  setSelectedEmployee: (employee: Employee | null) => void;
  updateEmployee: (employee: Employee) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  selectedEmployee: null,
  fetchEmployees: async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/employees/withId`
      );
      const data = await response.json();
      set((state) => ({
        employees: data,
        selectedEmployee:
          state.selectedEmployee || (data.length > 0 ? data[0] : null),
      }));
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  },
  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  updateEmployee: (employee) => set({ selectedEmployee: employee }),
}));
