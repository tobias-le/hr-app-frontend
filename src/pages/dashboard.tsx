import React from "react";
import styled from "styled-components";
import {
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  workHoursData,
  recentActivities,
  upcomingTasks,
} from "../mocks/dashboardData";

const DashboardWrapper = styled(Box)`
  flex-grow: 1;
  padding: 24px;
`;

const ChartPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 240px;
`;

const TaskProgress = styled(LinearProgress)`
  height: 10px;
  border-radius: 5px;
  background-color: rgba(255, 152, 0, 0.2);

  & .MuiLinearProgress-bar {
    background-color: #ff9800;
  }
`;

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <Typography variant="h4" gutterBottom component="h1">
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ChartPaper>
            <Typography variant="h6" gutterBottom component="div">
              Weekly Work Hours
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={workHoursData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPaper>
        </Grid>
        {/* Rest of the component remains the same */}
      </Grid>
    </DashboardWrapper>
  );
}
