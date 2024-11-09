import API_CONFIG from "../config/api.config";
import {
  SummaryItemProps,
  AttendanceDetail,
  TeamSummary,
  Team,
  TeamAttendanceDetail,
} from "../types/attendance";
import {EmployeeLeaveBalance, Leave, LeaveDto} from "../types/timeoff";

// Add these interfaces at the top of the file
interface Employee {
  name: string;
  overtime: string | null;
  picture: string | null;
  location: string;
  note: string;
}

class ApiService {
  private static async fetchWithConfig(
    endpoint: string,
    options?: RequestInit
  ): Promise<any> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const defaultOptions: RequestInit = {
      headers: API_CONFIG.HEADERS,
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  public static async getEmployees(teamId: number): Promise<Employee[]> {
    const response = await this.fetchWithConfig(
      `${API_CONFIG.ENDPOINTS.EMPLOYEES}?teamId=${teamId}`
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

  public static async getTeamAttendanceSummary(
    teamId: number
  ): Promise<TeamSummary> {
    return this.fetchWithConfig(
      `/api/attendance/team/${teamId}/summary`
    ) as Promise<TeamSummary>;
  }

  public static async getTeams(): Promise<Team[]> {
    return this.fetchWithConfig("/api/teams") as Promise<Team[]>;
  }

  public static async getTeamAttendanceDetails(
    teamId: number
  ): Promise<TeamAttendanceDetail[]> {
    return this.fetchWithConfig(`/api/attendance/team/${teamId}`) as Promise<
      TeamAttendanceDetail[]
    >;
  }

  public static async getTimeOffSummary() :Promise<EmployeeLeaveBalance> {
    const employeeId = 1; //replace with id of currently signed user
    return this.fetchWithConfig(`/leave/${employeeId}/balance`) as Promise<EmployeeLeaveBalance>;
  }

  public static async getRecentTimeOffRequests() :Promise<Leave[]> {
    const employeeId = 1; //replace with id of currently signed user
    return this.fetchWithConfig(`/leave/${employeeId}`) as Promise<Leave[]>;
  }

  //to create new time off request, returns 1 if ok and 0 if not??
  public static async createNewTimeOffRequest(timeOffRequest: LeaveDto):Promise<Leave> {
    return this.fetchWithConfig(`/leave`, {
      method: 'POST',
      body: JSON.stringify(timeOffRequest),
    });
  }

}

export default ApiService;
