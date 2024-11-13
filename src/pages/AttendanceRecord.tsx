import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Chip,
  SelectChangeEvent,
  CircularProgress,
  Grid,
  Stack,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { createProjectChip } from "../utils/chipUtils";
import ApiService from "../services/api.service";
import { useEmployeeStore } from "../store/employeeStore";
import { AttendanceRecord, Project } from "../types/attendance";
import { useSnackbarStore } from "../components/GlobalSnackbar";
import { DataTable } from "../components/common/DataTable";
import { FormField } from "../components/common/FormField";
import { PageLayout } from "../components/common/PageLayout";
import { handleApiError } from "../utils/errorUtils";
import { useForm } from "../hooks/useForm";

const WorkTime: React.FC = () => {
  const { formData, handleChange, isSubmitting, setIsSubmitting, setFormData } =
    useForm({
      project: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "17:00",
      description: "",
    });

  const [projects, setProjects] = useState<Project[]>([]);
  const [pastEntries, setPastEntries] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedEmployee } = useEmployeeStore();
  const { showMessage } = useSnackbarStore();
  const [editingEntry, setEditingEntry] = useState<AttendanceRecord | null>(
    null
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const valid = Boolean(
      formData.project &&
        formData.date &&
        formData.startTime &&
        formData.endTime
    );
    setIsFormValid(valid);
  }, [formData]);

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
    handleChange(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee?.id || !isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const dateStr = formData.date;
      const clockInDateTime = `${dateStr}T${formData.startTime}:00`;
      const clockOutDateTime = `${dateStr}T${formData.endTime}:00`;

      const selectedProject = projects.find(
        (p) => p.projectId === Number(formData.project)
      );

      if (!selectedProject) {
        showMessage("Please select a valid project");
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
          startTime: "09:00",
          endTime: "17:00",
          description: "",
        });
      }
    } catch (error) {
      handleApiError(error, "Failed to create work time entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    return format(parseISO(dateTimeStr), "HH:mm");
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd, yyyy");
  };

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

    setIsSubmitting(true);
    try {
      const dateStr = formData.date;
      const clockInDateTime = `${dateStr}T${formData.startTime}:00`;
      const clockOutDateTime = `${dateStr}T${formData.endTime}:00`;

      const selectedProject = projects.find(
        (p) => p.projectId === Number(formData.project)
      );

      if (!selectedProject) {
        showMessage("Please select a valid project");
        setIsSubmitting(false);
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
        startTime: "09:00",
        endTime: "17:00",
        description: "",
      });
    } catch (error) {
      console.error("Error updating entry:", error);
      showMessage("Failed to update entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Date",
      accessor: (entry: AttendanceRecord) => formatDate(entry.date),
    },
    {
      header: "Project",
      accessor: (entry: AttendanceRecord) => (
        <Chip {...createProjectChip(entry.project)} />
      ),
    },
    {
      header: "Time",
      accessor: (entry: AttendanceRecord) =>
        `${formatDateTime(entry.clockInTime)} - ${formatDateTime(
          entry.clockOutTime
        )}`,
    },
    {
      header: "Description",
      accessor: (entry: AttendanceRecord) => entry.description || "",
    },
    {
      header: "Actions",
      accessor: (entry: AttendanceRecord) => (
        <div className="flex space-x-2">
          <Button
            data-testid={`edit-button-${entry.attendanceId}`}
            size="small"
            color="primary"
            onClick={() => handleEdit(entry)}
          >
            Edit
          </Button>
          <Button
            data-testid={`delete-button-${entry.attendanceId}`}
            size="small"
            color="error"
            onClick={() => handleDelete(entry.attendanceId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout title="Work Time Entry">
      <form
        data-testid="work-time-form"
        onSubmit={editingEntry ? handleUpdate : handleSubmit}
        noValidate
      >
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormField
              name="project"
              label="Project"
              value={formData.project}
              onChange={handleInputChange}
              options={projects.map((project) => ({
                value: project.projectId.toString(),
                label: project.name,
              }))}
              required
              validateNotEmpty
              testId="project-select"
            />
          </Grid>

          <Grid item xs={6}>
            <FormField
              name="date"
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              validateNotEmpty
              testId="date-input"
            />
          </Grid>

          <Grid item xs={6}>
            <FormField
              name="startTime"
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={handleInputChange}
              required
              validateNotEmpty
              testId="start-time-input"
            />
          </Grid>

          <Grid item xs={6}>
            <FormField
              name="endTime"
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange}
              required
              validateNotEmpty
              testId="end-time-input"
            />
          </Grid>

          <Grid item xs={12}>
            <FormField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              testId="description-input"
            />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                data-testid="cancel-button"
                variant="outlined"
                onClick={() => {
                  setEditingEntry(null);
                  setFormData({
                    project: "",
                    date: format(new Date(), "yyyy-MM-dd"),
                    startTime: "09:00",
                    endTime: "17:00",
                    description: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                data-testid="submit-button"
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting || !isFormValid}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isSubmitting
                  ? "Submitting..."
                  : editingEntry
                  ? "Update"
                  : "Submit"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>

      <Typography variant="h6" className="font-bold mb-4">
        Past Work Time Entries
      </Typography>

      <DataTable
        data={pastEntries}
        columns={columns}
        loading={loading}
        emptyMessage="No entries found"
        testId="entries-table"
      />
    </PageLayout>
  );
};

export default WorkTime;
