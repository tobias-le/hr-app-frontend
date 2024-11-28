import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api.service";
import { useEmployeeStore } from "../store/employeeStore";
import { Employee } from "../types/employee";
import { AuthResponse } from "../types/auth";

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
  const setCurrentEmployee = useEmployeeStore(
    (state) => state.setCurrentEmployee
  );

  const handleAuthSuccess = useCallback(
    (authResponse: AuthResponse) => {
      localStorage.setItem("access_token", authResponse.accessToken);
      localStorage.setItem("refresh_token", authResponse.refreshToken);
      setCurrentUser(authResponse.employee);
      setCurrentEmployee(authResponse.employee);
      setIsAuthenticated(true);
    },
    [setCurrentEmployee]
  );

  const handleLogout = useCallback(() => {
    ApiService.logout().then(() => {
      setIsAuthenticated(false);
      setCurrentUser(undefined);
      setCurrentEmployee(null);
      navigate("/login");
    });
  }, [navigate, setCurrentEmployee]);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (accessToken && refreshToken) {
        try {
          const response = await ApiService.refreshToken(refreshToken);
          handleAuthSuccess(response);
        } catch (error) {
          handleLogout();
        }
      }
    };

    initAuth();
  }, [handleAuthSuccess, handleLogout]);

  const login = async (email: string, password: string) => {
    try {
      const authResponse = await ApiService.login(email, password);
      handleAuthSuccess(authResponse);
      navigate("/work-time");
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, logout: handleLogout }}
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
