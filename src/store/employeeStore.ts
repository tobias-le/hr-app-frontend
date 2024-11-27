import { create } from "zustand";
import { Employee } from "../types/employee";

interface EmployeeState {
  currentEmployee: Employee | null;
  setCurrentEmployee: (employee: Employee | null) => void;
  updateEmployee: (employee: Employee) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  currentEmployee: null,
  setCurrentEmployee: (employee) => set({ currentEmployee: employee }),
  updateEmployee: (employee) => set({ currentEmployee: employee }),
}));
