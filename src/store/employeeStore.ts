import { create } from "zustand";
import API_CONFIG from "../config/api.config";
import { Employee } from "../types/employee";

interface EmployeeState {
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
  updateEmployee: (employee: Employee) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  selectedEmployee: null,
  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  updateEmployee: (employee) => set({ selectedEmployee: employee }),
}));
