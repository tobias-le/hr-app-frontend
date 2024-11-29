import API_CONFIG from "../config/api.config";
import {
  SummaryItemProps,
  AttendanceDetail,
  AttendanceSummaryType,
  AttendanceRecord,
} from "../types/attendance";
import {EmployeeLeaveBalance, GeneralRequest, Leave, LeaveDto, PendingRequest} from "../types/timeoff";
import { Employee, EmployeeNameWithId } from "../types/employee";
import { Project } from "../types/project";
import { Team } from "../types/team";
import {
  Learning,
  LearningAssignmentDto,
  LearningDto,
} from "../types/learning";
import { AuthResponse } from "../types/auth";

class ApiService {
  private static async fetchWithConfig(
    endpoint: string,
    options?: RequestInit
  ): Promise<any> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = localStorage.getItem("jwt_token");

    const headers = {
      ...API_CONFIG.HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    };

    const defaultOptions: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("jwt_token");
          window.location.href = "/login";
          throw new Error("Unauthorized access");
        }
        if (response.status === 403) {
          console.error("Forbidden access. Token:", token);
          throw new Error("Forbidden access - check permissions");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.status === 204) {
        return true;
      }
      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  private static async fetchWithoutBody(
    endpoint: string,
    options?: RequestInit
  ): Promise<any> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const token = localStorage.getItem("jwt_token");

    const headers = {
      ...API_CONFIG.HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    };
    const defaultOptions: RequestInit = {
      ...options,
      headers,
    };
    console.log(defaultOptions);
    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.ok;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  public static async getEmployees(projectId: number): Promise<Employee[]> {
    const response = await this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.EMPLOYEES}?projectId=${projectId}`
    );
    return response.content as Employee[];
  }

  public static async getAttendanceSummary(): Promise<SummaryItemProps[]> {
    return this.fetchWithConfig(
      API_CONFIG.ENDPOINTS.ATTENDANCE_SUMMARY
    ) as Promise<SummaryItemProps[]>;
  }

  public static async getAttendanceDetails(): Promise<AttendanceDetail[]> {
    return this.fetchWithConfig(
      API_CONFIG.ENDPOINTS.ATTENDANCE_DETAILS
    ) as Promise<AttendanceDetail[]>;
  }

  public static async getTeams(): Promise<Team[]> {
    return this.fetchWithConfig(API_CONFIG.ENDPOINTS.TEAMS) as Promise<Team[]>;
  }

  public static async getTimeOffSummary(
    employeeId: number
  ): Promise<EmployeeLeaveBalance> {
    return this.fetchWithConfig(
      `/leave/${employeeId}/balance`
    ) as Promise<EmployeeLeaveBalance>;
  }

  public static async getRecentTimeOffRequests(
    employeeId: number
  ): Promise<Leave[]> {
    return this.fetchWithConfig(`/leave/requests/${employeeId}`) as Promise<
      Leave[]
    >;
  }

  //to create new time off request, returns 1 if ok and 0 if not??
  public static async createNewTimeOffRequest(
    timeOffRequest: LeaveDto
  ): Promise<Leave> {
    return this.fetchWithConfig(`/leave`, {
      method: "POST",
      body: JSON.stringify(timeOffRequest),
    });
  }

  public static async getEmployeeById(id: number): Promise<any> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`);
  }

  public static async updateEmployee(
    id: number,
    employeeData: Employee
  ): Promise<any> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async getEmployeeNamesWithIds(): Promise<EmployeeNameWithId[]> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/withId`);
  }

  public static async createAttendanceRecord(
    attendanceRecord: AttendanceRecord
  ): Promise<AttendanceRecord> {
    return this.fetchWithConfig(API_CONFIG.ENDPOINTS.ATTENDANCE, {
      method: "POST",
      body: JSON.stringify(attendanceRecord),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async getProjectsByEmployeeId(
    employeeId: number
  ): Promise<Project[]> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.PROJECTS}/by-employee/${employeeId}`
    );
  }

  public static async getAttendanceRecordsByMember(
    memberId: number
  ): Promise<AttendanceRecord[]> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.ATTENDANCE}/member/${memberId}`
    );
  }

  public static async deleteAttendanceRecord(
    attendanceId: number
  ): Promise<void> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.ATTENDANCE}/${attendanceId}`,
      {
        method: "DELETE",
      }
    );
  }

  public static async updateAttendanceRecord(
    id: number,
    attendanceRecord: AttendanceRecord
  ): Promise<AttendanceRecord> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.ATTENDANCE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(attendanceRecord),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async getProjects(): Promise<Project[]> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.PROJECTS}`) as Promise<
      Project[]
    >;
  }

  public static async getProjectAttendanceDetails(
    projectId: number
  ): Promise<AttendanceRecord[]> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.ATTENDANCE}/project/${projectId}`
    ) as Promise<AttendanceRecord[]>;
  }

  public static async getAttendanceSummaryType(
    projectId: number
  ): Promise<AttendanceSummaryType> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.ATTENDANCE}/project/${projectId}/summary`
    ) as Promise<AttendanceSummaryType>;
  }

  public static async getAllProjects(): Promise<Project[]> {
    return this.fetchWithConfig(API_CONFIG.ENDPOINTS.PROJECTS);
  }

  public static async getAllEmployees(): Promise<Employee[]> {
    return this.fetchWithConfig(API_CONFIG.ENDPOINTS.EMPLOYEES);
  }

  public static async createProject(projectData: any): Promise<Project> {
    return this.fetchWithConfig(API_CONFIG.ENDPOINTS.PROJECTS, {
      method: "POST",
      body: JSON.stringify(projectData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async updateProject(
    projectId: number,
    projectData: any
  ): Promise<Project> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}`,
      {
        method: "PUT",
        body: JSON.stringify(projectData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  public static async deleteProject(projectId: number): Promise<boolean> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}`,
      {
        method: "DELETE",
      }
    );
  }

  public static async getProjectDetails(projectId: number): Promise<Project> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/details`
    );
  }

  public static async autocompleteEmployees(
    query: string,
    excludeIds: number[] = []
  ): Promise<EmployeeNameWithId[]> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.EMPLOYEES}/autocomplete?query=${query}`,
      {
        method: "POST",
        body: JSON.stringify(excludeIds),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  public static async getAllTeams(): Promise<Team[]> {
    return this.fetchWithConfig(API_CONFIG.ENDPOINTS.TEAMS);
  }

  public static async getTeamDetails(teamId: number): Promise<Team> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.TEAMS}/${teamId}`);
  }

  public static async createTeam(teamData: Partial<Team>): Promise<Team> {
    return this.fetchWithConfig(API_CONFIG.ENDPOINTS.TEAMS, {
      method: "POST",
      body: JSON.stringify(teamData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async updateTeam(
    teamId: number,
    teamData: Partial<Team>
  ): Promise<Team> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.TEAMS}/${teamId}`, {
      method: "PUT",
      body: JSON.stringify(teamData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public static async deleteTeam(teamId: number): Promise<boolean> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.TEAMS}/${teamId}`, {
      method: "DELETE",
    });
  }

  public static async getCourses(): Promise<Learning[]> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.LEARNINGS}`);
  }

  public static async createLearning(learning: LearningDto): Promise<Learning> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.LEARNINGS}`, {
      method: "POST",
      body: JSON.stringify(learning),
    });
  }

  public static async submitLearning(
    learningAssignment: LearningAssignmentDto
  ): Promise<void> {
    return this.fetchWithoutBody(`${API_CONFIG.ENDPOINTS.LEARNINGS}/assign`, {
      method: "POST",
      body: JSON.stringify(learningAssignment),
    });
  }

  public static async login(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return this.fetchWithConfig(`/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  }
  public static async createNewGeneralRequest(employeeId: number, message:string): Promise<GeneralRequest> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.GENERAL_REQUESTS}`, {
      method: "POST",
      body: JSON.stringify({
        employeeId: employeeId,
        message: message,
      })
    })
  }

  public static async getPendingLeaveRequests() : Promise<PendingRequest[]> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.LEAVE_REQUESTS}/pending`);
  }

  public static async getPendingGeneralRequests() : Promise<PendingRequest[]> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.GENERAL_REQUESTS}/pending`);
  }

  public static async resolveRequest(pendingRequest: PendingRequest, action: string): Promise<void> {
    if (pendingRequest.startDate) {
      return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.LEAVE_REQUESTS}/request/${pendingRequest.messageId}/${action}`, {method: "PATCH"});
    }
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.GENERAL_REQUESTS}/${pendingRequest.messageId}/${action}`, {method: "PATCH"});
  }

  public static async getGeneralRequestsByUserId( userId: number) : Promise<GeneralRequest[]> {
    return this.fetchWithConfig(`${API_CONFIG.ENDPOINTS.GENERAL_REQUESTS}/all/${userId}`);
  }

  public static async validateTeamMembership(
    employeeId: number
  ): Promise<boolean> {
    const response = await this.fetchWithConfig(
      `/api/teams/validate-membership/${employeeId}`,
      {
        method: "GET",
      }
    );
    return response.data;
  }

  public static async getTeamByEmployeeId(employeeId: number): Promise<Team> {
    return this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.TEAMS}/by-employee/${employeeId}`
    );
  }
}

export default ApiService;