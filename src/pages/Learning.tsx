import {Box, Button, Divider, Paper, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Learning} from "../types/learning";
import {useEmployeeStore} from "../store/employeeStore";
import {PageLayout} from "../components/common/PageLayout";
import ApiService from "../services/api.service";
import LearningEntry from "../components/LearningEntry";

const Learn :React.FC = () => {
    const selectedEmployee = useEmployeeStore(state => state.selectedEmployee);
    const [filter, setFilter] = useState<string | null>(null);
    const [courses, setCourses] = useState<Learning[]>([]);
    const [viewedCourses, setViewedCourses] = useState<Learning[]>([]);

    const updateFilter = (event : React.MouseEvent) => {
        if (event.currentTarget.id === filter) {
            setFilter(null);
        } else {
            setFilter(event.currentTarget.id);
        }
    }

    useEffect(() => {
        /*
        if (employee) {
            ApiService.getCoursesByEmployee(employee.id).then(
                courses => setCourses(courses)
            ).catch(e => console.log(e));
        }
        */
        const mockedCourses: Learning[] = [
            {
                    learningId:1,
                    link:"https://seznam.cz",
                    name:"Seznam",
                    enrolledEmployees:[
                        {
                            id:1,
                            employee:1,
                            date: new Date(),
                            learning:1,
                        }
                    ]
                },
                {
                    learningId:2,
                    link:"https://google.com",
                    name:"Google",
                    enrolledEmployees:[]
                },
                {
                    learningId:3,
                    link:"https://youtube.com",
                    name:"YouTube",
                    enrolledEmployees:[]
                },
            ]

            setCourses(mockedCourses);
            setViewedCourses(courses);
    }, [selectedEmployee]);

    useEffect(() => {
        setViewedCourses( courses.filter( course => {
            if (filter) {
                const enrolled = course.enrolledEmployees.find(employeeLearning => selectedEmployee? selectedEmployee.id === employeeLearning.employee : true);
                return enrolled? filter === "complete" : filter==="waiting";
            } else {
                return true;
            }
        }))
    }, [filter]);


    return (
        <PageLayout data-testid="learning-page" title="Required Learning">
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems:"center"}}>
                <Typography variant="body2">filter:</Typography>

                <Button id="complete" onClick={updateFilter} variant={filter==="complete"? "contained" : "text"} data-testid="complted-filter-button">
                    Completed
                </Button>

                <Button id="waiting" onClick={updateFilter} variant={filter==="waiting"? "contained" : "text"} data-testid="waiting-filter-button">
                    Waiting
                </Button>

            </Box>
            <Paper>
                {viewedCourses.map(
                    course => <LearningEntry course={course}/>
                )}
            </Paper>
        </PageLayout>
    );
}

export default Learn;