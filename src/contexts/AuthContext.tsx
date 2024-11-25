import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api.service";
import { useEmployeeStore } from "../store/employeeStore";
import { Employee } from "../types/employee";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  currentUser?: Employee;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Employee | undefined>();
  const navigate = useNavigate();
  const setcurrentEmployee = useEmployeeStore(
    (state) => state.setCurrentEmployee
  );

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authResponse = await ApiService.login(email, password);

      localStorage.setItem("jwt_token", authResponse.token);
      setCurrentUser(authResponse.employee);
      setcurrentEmployee(authResponse.employee);
      setIsAuthenticated(true);
      navigate("/work-time");
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setIsAuthenticated(false);
    setCurrentUser(undefined);
    setcurrentEmployee(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
