import {
  Box,
  Button,
  CircularProgress,
  Paper, ToggleButton, ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { Learning } from "../types/learning";
import { useEmployeeStore } from "../store/employeeStore";
import { PageLayout } from "../components/common/PageLayout";
import ApiService from "../services/api.service";
import LearningEntry from "../components/LearningEntry";
import { BaseModal } from "../components/common/BaseModal";
import { FormField } from "../components/common/FormField";
import {EmptyState} from "../components/common/EmptyState";

function isValid(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

const Learn: React.FC = () => {
  const currentEmployee = useEmployeeStore((state) => state.currentEmployee);
  const [filter, setFilter] = useState<string | null>(null);
  const [courses, setCourses] = useState<Learning[]>([]);
  const [viewedCourses, setViewedCourses] = useState<Learning[]>([]);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [newLink, setNewLink] = useState<string>("");
  const [validLink, setValidLink] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [validName, setValidName] = useState<string | null>(null);
  const [formLocked, setFormLocked] = useState<boolean>(false);

  const update = (learningId: number, employeeId: number): void => {
    setCourses((prevState) => {
      return prevState.map((learning) => {
        if (learning.learningId === learningId) {
          const newArray = Array.from(learning.enrolledEmployees);
          const date = new Date();
          date.setDate(date.getDate() + 7);
          newArray.push({
            id: {
              learningId: learningId,
              employeeId: employeeId,
            },
            date: date,
          });
          return {
            ...learning,
            enrolledEmployees: newArray,
          };
        } else {
          return learning;
        }
      });
    });
  };

  const createNewLearning = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (validLink === null && validName === null) {
      setFormLocked(true);
      ApiService.createLearning({
        learningId: 0,
        name: newName,
        link: newLink,
      })
        .then((course) => {
          course.enrolledEmployees = [];
          setCourses((prevState) => {
            const newState = Array.from(prevState);
            newState.push(course);
            return newState;
          });
          setDialogVisible(false);
          setFormLocked(false);
          setNewLink("");
          setNewName("");
          setValidLink(null);
          setValidName(null);
        })
        .catch((error) => {
          alert("We had problems creating new learning");
          setFormLocked(false);
        });
    }
  };

  useEffect(() => {
    ApiService.getCourses()
      .then((courses) => {
        setCourses(courses);
        setViewedCourses(courses);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    setViewedCourses(
      courses.filter((course) => {
        if (filter) {
          const enrolled = course.enrolledEmployees.find((employeeLearning) =>
            currentEmployee
              ? currentEmployee.id === employeeLearning.id.employeeId
              : true
          );
          return enrolled ? filter === "complete" : filter === "waiting";
        } else {
          return true;
        }
      })
    );
  }, [filter, currentEmployee, courses]);

  useEffect(() => {
    if (!isValid(newLink)) {
      setValidLink("Invalid URL");
    } else {
      setValidLink(null);
    }
  }, [newLink]);

  useEffect(() => {
    if (newName.length < 4) {
      setValidName("Must be at least 5 characters long");
    } else {
      setValidName(null);
    }
  }, [newName]);


    return (
        <PageLayout data-testid="learning-page" title="Required Learning">
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems:"center", padding:"16px"}}>
                <Typography variant="body2">filter:</Typography>
                <ToggleButtonGroup
                    value={filter}
                    onChange={(event, newFilter) => {setFilter(newFilter);console.log(newFilter)}}
                    exclusive
                    size="small"
                >
                    <ToggleButton value="complete" data-testid="complted-filter-button">
                        Completed
                    </ToggleButton>

                    <ToggleButton value="waiting" data-testid="waiting-filter-button">
                        Waiting
                    </ToggleButton>
                </ToggleButtonGroup>

            </Box>
            {viewedCourses.length > 0?
                <Paper>
                    {viewedCourses.map(
                        course => <LearningEntry course={course} updateFunction={update}/>
                    )}
                </Paper>:
                <EmptyState message={courses.length===0? "No courses yet": "Nothing to show"}/>
            }

      {currentEmployee?.hr && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <Button
            onClick={() => setDialogVisible(true)}
            variant="contained"
            data-testid="newlearning-create"
          >
            Add new learning
          </Button>
        </Box>
      )}
      <BaseModal
        open={dialogVisible}
        onClose={() => {
          setDialogVisible(false);
        }}
        title="Create Learning"
      >
        <form data-testid="create-learning" onSubmit={createNewLearning}>
          <div className="w-full">
            <FormField
              name="link"
              label="Link"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              error={!!validLink}
              helperText={validLink}
              data-testid="newlearning-link"
            />
          </div>

          <div className="w-full">
            <FormField
              name="name"
              label="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              error={!!validName}
              helperText={validName}
              data-testid="newlearning-name"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              disabled={formLocked}
              data-testid="submit-newlearning"
            >
              Create Learning {formLocked ? <CircularProgress /> : null}
            </Button>
          </div>
        </form>
      </BaseModal>
    </PageLayout>
  );
};

export default Learn;