import {LeaveStatus} from "../types/timeoff";

export function stringToColor(string: string): string {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}

//returns color in which chip is displayed
export function getStatusColor (status: LeaveStatus) :"success" | "warning" | "error" {
  switch (status) {
    case LeaveStatus.Approved:
      return "success";
    case LeaveStatus.Rejected:
      return "error";
    default:
      return "warning";
  }
}
