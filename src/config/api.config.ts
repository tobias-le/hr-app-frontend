const API_CONFIG = {
  BASE_URL: "https://backend-test-7dda.up.railway.app",
  ENDPOINTS: {
    EMPLOYEES: "/api/employees",
    ATTENDANCE_SUMMARY: "/api/attendance/summary",
    ATTENDANCE_DETAILS: "/api/attendance/details",
  },
  TIMEOUT: 5000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export default API_CONFIG;
