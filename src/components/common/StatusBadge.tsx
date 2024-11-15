import React from "react";
import { Status } from "../../types/attendance";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const getStatusColor = (status: Status): string => {
    const colors: Record<Status, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
};
