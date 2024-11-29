const API_CONFIG = {
  //BASE_URL: "https://backend-test-7dda.up.railway.app",
  BASE_URL: "http://localhost:8080",

  ENDPOINTS: {
    EMPLOYEES: "/api/employees",
    ATTENDANCE: "/api/attendance",
    PROJECTS: "/api/projects",
    TEAMS: "/api/teams",
    ATTENDANCE_SUMMARY: "/api/attendance/summary",
    ATTENDANCE_DETAILS: "/api/attendance/details",
    LEARNINGS: "/learning",
    GENERAL_REQUESTS: "/request",
    LEAVE_REQUESTS: "/leave"
  },
  TIMEOUT: 5000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export default API_CONFIG;
