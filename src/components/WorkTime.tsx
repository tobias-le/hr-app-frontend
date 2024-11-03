import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import Header from "./Header";
import { format } from "date-fns";
import { createProjectChip } from "../utils/chipUtils";

interface WorkTimeEntry {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  project: string;
  description: string;
  duration: string;
}

const WorkTime: React.FC = () => {
  // Mock data - replace with API call
  const [pastEntries] = useState<WorkTimeEntry[]>([
    {
      id: 1,
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "17:00",
      project: "Project 1",
      description: "Frontend development",
      duration: "8h",
    },
    {
      id: 2,
      date: "2024-01-16",
      startTime: "08:30",
      endTime: "16:30",
      project: "Project 2",
      description: "API integration",
      duration: "8h",
    },
  ]);

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd, yyyy");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <Box className="flex-grow p-6">
        <Paper className="p-6">
          <Typography variant="h5" className="font-bold mb-6">
            Work Time Entry
          </Typography>

          <form className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select label="Project">
                  <MenuItem value="project1">Project 1</MenuItem>
                  <MenuItem value="project2">Project 2</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                className="col-span-2"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outlined">Cancel</Button>
              <Button variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </form>

          <Typography variant="h6" className="font-bold mb-4">
            Past Work Time Entries
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pastEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <Chip {...createProjectChip(entry.project)} />
                    </TableCell>
                    <TableCell>
                      {entry.startTime} - {entry.endTime}
                    </TableCell>
                    <TableCell>{entry.duration}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="small" color="primary">
                          Edit
                        </Button>
                        <Button size="small" color="error">
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
};

export default WorkTime;
