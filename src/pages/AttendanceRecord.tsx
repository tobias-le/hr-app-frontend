import React, { useState, useEffect } from "react";
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
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import Header from "../components/Header";
import { format, parseISO } from "date-fns";
import { createProjectChip } from "../utils/chipUtils";
import ApiService from "../services/api.service";
import { useEmployeeStore } from "../store/employeeStore";
import { AttendanceRecord, Project } from "../types/attendance";
import { useSnackbarStore } from "../components/GlobalSnackbar";

const WorkTime: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pastEntries, setPastEntries] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    project: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "",
    endTime: "",
    description: "",
  });
  const { selectedEmployee } = useEmployeeStore();
  const [submitting, setSubmitting] = useState(false);
  const { showMessage } = useSnackbarStore();
  const [editingEntry, setEditingEntry] = useState<AttendanceRecord | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedEmployee?.id) return;

      setLoading(true);
      try {
        const [projectsData, entriesData] = await Promise.all([
          ApiService.getProjectsByEmployeeId(selectedEmployee.id),
          ApiService.getAttendanceRecordsByMember(selectedEmployee.id),
        ]);

        const validProjects = projectsData.filter(
          (project): project is Project =>
            project !== undefined &&
            project !== null &&
            typeof project.projectId === "number" &&
            typeof project.name === "string"
        );

        setProjects(validProjects);
        setPastEntries(entriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedEmployee?.id]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee?.id) return;

    setSubmitting(true);
    try {
      const dateStr = formData.date;
      const clockInDateTime = `${dateStr}T${formData.startTime}:00`;
      const clockOutDateTime = `${dateStr}T${formData.endTime}:00`;

      const selectedProject = projects.find(
        (p) => p.projectId === Number(formData.project)
      );

      if (!selectedProject) {
        showMessage("Please select a valid project");
        setSubmitting(false);
        return;
      }

      const workTimeEntry: AttendanceRecord = {
        attendanceId: 0, // This will be set by the API
        memberId: selectedEmployee.id,
        member: selectedEmployee.name,
        date: formData.date,
        clockInTime: clockInDateTime,
        clockOutTime: clockOutDateTime,
        project: selectedProject.name,
        description: formData.description,
      };

      const response = await ApiService.createAttendanceRecord(workTimeEntry);

      if (response) {
        setPastEntries((prev) => [...prev, response]);
        showMessage("Work time entry created successfully");

        // Reset form
        setFormData({
          project: "",
          date: format(new Date(), "yyyy-MM-dd"),
          startTime: "",
          endTime: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error creating work time entry:", error);
      showMessage("Failed to create work time entry");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    return format(parseISO(dateTimeStr), "HH:mm");
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd, yyyy");
  };

  console.log("Current projects:", projects);

  const handleDelete = async (attendanceId: number) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await ApiService.deleteAttendanceRecord(attendanceId);

      // If we get here, it means the delete was successful (204 No Content)
      setPastEntries((prev) =>
        prev.filter((entry) => entry.attendanceId !== attendanceId)
      );
      showMessage("Entry deleted successfully");
    } catch (error) {
      console.error("Error deleting entry:", error);
      showMessage("Failed to delete entry");
    }
  };

  const handleEdit = (entry: AttendanceRecord) => {
    console.log("Editing entry:", entry);

    const formValues = {
      project:
        projects.find((p) => p.name === entry.project)?.projectId.toString() ||
        "",
      date: entry.date,
      startTime: formatDateTime(entry.clockInTime),
      endTime: formatDateTime(entry.clockOutTime),
      description: entry.description || "",
    };

    console.log("Setting form values:", formValues);
    setEditingEntry(entry);
    setFormData(formValues);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee?.id || !editingEntry?.attendanceId) return;

    setSubmitting(true);
    try {
      const dateStr = formData.date;
      const clockInDateTime = `${dateStr}T${formData.startTime}:00`;
      const clockOutDateTime = `${dateStr}T${formData.endTime}:00`;

      const selectedProject = projects.find(
        (p) => p.projectId === Number(formData.project)
      );

      if (!selectedProject) {
        showMessage("Please select a valid project");
        setSubmitting(false);
        return;
      }

      const updatedEntry: AttendanceRecord = {
        ...editingEntry,
        attendanceId: editingEntry.attendanceId,
        memberId: selectedEmployee.id,
        member: selectedEmployee.name,
        date: formData.date,
        clockInTime: clockInDateTime,
        clockOutTime: clockOutDateTime,
        project: selectedProject.name,
        description: formData.description,
      };

      const response = await ApiService.updateAttendanceRecord(
        editingEntry.attendanceId,
        updatedEntry
      );

      setPastEntries((prev) =>
        prev.map((entry) =>
          entry.attendanceId === editingEntry.attendanceId ? response : entry
        )
      );
      showMessage("Entry updated successfully");

      // Reset form and editing state
      setEditingEntry(null);
      setFormData({
        project: "",
        date: format(new Date(), "yyyy-MM-dd"),
        startTime: "",
        endTime: "",
        description: "",
      });
    } catch (error) {
      console.error("Error updating entry:", error);
      showMessage("Failed to update entry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <Box className="flex-grow p-6">
        <Paper className="p-6">
          <Typography variant="h5" className="font-bold mb-6">
            Work Time Entry
          </Typography>

          <form
            onSubmit={editingEntry ? handleUpdate : handleSubmit}
            className="space-y-4 mb-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  label="Project"
                >
                  {projects.map((project) => (
                    <MenuItem key={project.projectId} value={project.projectId}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                name="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                name="startTime"
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                name="endTime"
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                fullWidth
                className="col-span-2"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outlined"
                onClick={() => {
                  setEditingEntry(null);
                  setFormData({
                    project: "",
                    date: format(new Date(), "yyyy-MM-dd"),
                    startTime: "",
                    endTime: "",
                    description: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {submitting
                  ? "Submitting..."
                  : editingEntry
                  ? "Update"
                  : "Submit"}
              </Button>
            </div>
          </form>

          <Typography variant="h6" className="font-bold mb-4">
            Past Work Time Entries
          </Typography>

          {loading ? (
            <div className="flex justify-center p-8">
              <CircularProgress />
            </div>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pastEntries.map((entry) => (
                    <TableRow key={entry.attendanceId}>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell>
                        <Chip {...createProjectChip(entry.project)} />
                      </TableCell>
                      <TableCell>
                        {formatDateTime(entry.clockInTime)} -{" "}
                        {formatDateTime(entry.clockOutTime)}
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(entry)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(entry.attendanceId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default WorkTime;
