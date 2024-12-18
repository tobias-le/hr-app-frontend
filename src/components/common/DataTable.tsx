import React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    testId?: string;
  }[];
  loading?: boolean;
  emptyMessage?: string;
  initialMessage?: string;
  isInitialState?: boolean;
  testId?: string;
  onRowClick?: (item: T) => void;
  rowKey?: (item: T) => any;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  initialMessage = "Start typing to search",
  isInitialState = false,
  testId,
  onRowClick,
    rowKey,
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingSpinner testId={`${testId}-loading`} />;
  }

  if (!data.length) {
    return (
      <EmptyState
        message={isInitialState ? initialMessage : emptyMessage}
        testId={`${testId}-empty`}
      />
    );
  }

  return (
    <TableContainer component={Paper} data-testid={testId}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} data-testid={column.testId}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow
                data-testid={rowKey && rowKey(item)}
              key={rowIndex}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {typeof column.accessor === "function"
                    ? column.accessor(item)
                    : String(item[column.accessor])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
