import { Learning } from "../types/learning";
import {
  Box,
  Button,
  Typography,
  Link,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useEmployeeStore } from "../store/employeeStore";
import CheckIcon from "@mui/icons-material/Check";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import ApiService from "../services/api.service";
interface CourseEntryProps {
  course: Learning;
  updateFunction: (courseId: number, employeeId: number) => void;
}

const LearningEntry = ({ course, updateFunction }: CourseEntryProps) => {
  const employee = useEmployeeStore((state) => state.currentEmployee);
  const [finished, setFinished] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (employee) {
      const learning = course.enrolledEmployees.find(
        (enroll) => enroll.id.employeeId === employee.id
      );
      if (learning) {
        setFinished(true);
        setDate(format(learning.date, "dd.MM.yyyy"));
      } else {
        setFinished(false);
        setDate("");
      }
    }
  }, [employee, course]);

  const submitLearning = () => {
    if (employee) {
      setLoading(true);
      ApiService.submitLearning({
        learningId: course.learningId,
        employeeId: employee.id,
      })
        .then(() => {
          updateFunction(course.learningId, employee.id);
          setLoading(false);
        })
        .catch();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
        data-testid="learning-entry"
      >
        <Link
          underline="hover"
          target="_blank"
          href={course.link}
          color="secondary"
        >
          {course.name}
        </Link>
        {employee ? (
          !finished ? (
            <Button
              variant="outlined"
              data-testid="submit-learning"
              onClick={submitLearning}
              disabled={loading}
            >
              Mark as completed {loading ? <CircularProgress /> : null}
            </Button>
          ) : (
            <Typography>
              completed on {date}
              <CheckIcon />
            </Typography>
          )
        ) : null}
      </Box>
      <Divider variant="middle" />
    </Box>
  );
};

export default LearningEntry;
