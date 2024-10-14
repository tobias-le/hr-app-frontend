import React from "react";
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

const workHoursData = [
  { day: "Mon", hours: 8 },
  { day: "Tue", hours: 7.5 },
  { day: "Wed", hours: 8.5 },
  { day: "Thu", hours: 8 },
  { day: "Fri", hours: 7 },
];

const recentActivities = [
  { id: 1, activity: "Submitted timesheet for last week", time: "2 hours ago" },
  { id: 2, activity: "Requested time off for next month", time: "1 day ago" },
  { id: 3, activity: "Updated personal information", time: "3 days ago" },
];

const upcomingTasks = [
  { id: 1, task: "Complete quarterly review", deadline: "2023-06-30" },
  { id: 2, task: "Submit expense report", deadline: "2023-06-15" },
  { id: 3, task: "Attend team building workshop", deadline: "2023-07-05" },
];

export default function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}
          >
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
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}
          >
            <Typography variant="h6" gutterBottom component="div">
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemText
                    primary={activity.activity}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom component="div">
              Upcoming Tasks
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell>Progress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>{task.deadline}</TableCell>
                      <TableCell>
                        <LinearProgress
                          variant="determinate"
                          value={Math.random() * 100}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "rgba(255, 152, 0, 0.2)",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#ff9800",
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
