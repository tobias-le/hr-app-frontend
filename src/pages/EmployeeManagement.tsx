import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { debounce } from "lodash";
import ApiService from "../services/api.service";
import { Employee, EmployeeNameWithId } from "../types/employee";
import { PageLayout } from "../components/common/PageLayout";
import { DataTable } from "../components/common/DataTable";
import { useEmployeeStore } from "../store/employeeStore";
import AddIcon from "@mui/icons-material/Add";

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchOptions, setSearchOptions] = useState<EmployeeNameWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const currentEmployee = useEmployeeStore((state) => state.currentEmployee);
  const isInitialMount = useRef(true);

  // Initial load of all employees
  useEffect(() => {
    const loadInitialEmployees = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getAllEmployees();
        setEmployees(response || []);
        // Initialize search options with the same data
        setSearchOptions(
          response?.map((emp) => ({ id: emp.id, name: emp.name })) || []
        );
      } catch (error) {
        console.error("Failed to fetch initial employees:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialEmployees();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Reset search state
    setSearchOptions([]);
    setEmployees([]);
    setHasSearched(false);

    // Reset the search input
    const searchInput = document.querySelector(
      '[data-testid="employee-search"] input'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
    }
  }, []);

  const fetchEmployees = useCallback(async (query: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      if (query.trim() === "") {
        const response = await ApiService.getAllEmployees();
        setEmployees(response || []);
        setSearchOptions(
          response?.map((emp) => ({ id: emp.id, name: emp.name })) || []
        );
      } else {
        const searchResults = await ApiService.autocompleteEmployees(query);
        setSearchOptions(searchResults || []);

        // Fetch full employee details for the table
        const fullEmployees = await Promise.all(
          searchResults.map((emp) => ApiService.getEmployeeById(emp.id))
        );
        setEmployees(fullEmployees || []);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
      setSearchOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useMemo(
    () => debounce((query: string) => fetchEmployees(query), 300),
    [fetchEmployees]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFetch(event.target.value);
  };

  const handleRowClick = (employee: Employee) => {
    navigate(`/employee-management/${employee.id}`);
  };

  const handleCreateEmployee = () => {
    navigate("/employee-management/create");
  };

  if (!currentEmployee?.hr) {
    return <Navigate to="/" replace />;
  }

  const columns = [
    { header: "Name", accessor: "name" as keyof Employee },
    { header: "Job Title", accessor: "jobTitle" as keyof Employee },
    { header: "Email", accessor: "email" as keyof Employee },
    { header: "Status", accessor: "employmentStatus" as keyof Employee },
  ];

  return (
    <PageLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h6">Employee Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateEmployee}
          data-testid="create-employee-button"
        >
          Create Employee
        </Button>
      </Box>

      <div className="flex justify-center items-center mb-6">
        <Autocomplete
          freeSolo
          options={searchOptions}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option?.name || ""
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Employees"
              variant="outlined"
              onChange={handleSearchChange}
              className="w-96"
              data-testid="employee-search"
            />
          )}
          loading={loading}
          className="w-96"
        />
      </div>

      <DataTable
        data={employees}
        columns={columns}
        onRowClick={handleRowClick}
        loading={loading}
        rowKey={(employee) => employee.id}
        emptyMessage="No employees found matching your search"
        initialMessage="Start typing to search for employees"
        isInitialState={!hasSearched}
        testId="employees-table"
      />
    </PageLayout>
  );
};

export default EmployeeManagement;
