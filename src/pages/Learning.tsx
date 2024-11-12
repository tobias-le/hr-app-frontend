import Header from "../components/Header";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Course} from "../types/learning";
import CourseEntry from "../components/CourseEntry";
import {useEmployeeStore} from "../store/employeeStore";

const Learning :React.FC = () => {
    const employee = useEmployeeStore(state => state.selectedEmployee);

    const [filter, setFilter] = useState<string>("");
    const [courses, setCourses] = useState<Course[]>([]);

    const updateFilter = (event : React.MouseEvent) => {
        if (event.currentTarget.id === filter) {
            setFilter("");
        } else {
            setFilter(event.currentTarget.id);
        }
    }

    useEffect(() => {
        const fetchCourses = () => {
            //api call to be done here

            const mockedCourses: Course[] = [
                {
                    id:1,
                    link:"https://seznam.cz",
                    completionDate:new Date(),
                },
                {
                    id:2,
                    link:"https://google.com",
                    completionDate:null,
                },
                {
                    id:3,
                    link:"https://youtube.com",
                    completionDate:new Date(),
                },
            ]

            setCourses(mockedCourses);
        }
        fetchCourses();
    }, [employee]);


    return (
        <div
            className="flex flex-col h-screen bg-gray-100"
            data-testid="learning-container"
        >
            <Header/>
            <Box className="flex-grow p-6">
                <Paper className="p-6">
                    <Typography
                        variant="h5"
                        className="font-bold mb-6"
                        data-testid="learning-title"
                    >
                        Required Learning
                    </Typography>

                    <Paper>
                        <>
                        {/*filter buttons*/}
                        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems:"center", marginBottom:"20px"}}>
                            <Typography variant="body2">filter:</Typography>

                            <Button id="complete" onClick={updateFilter} variant={filter==="complete"? "contained" : "text"}>
                                Completed
                            </Button>

                            <Button id="waiting" onClick={updateFilter} variant={filter==="waiting"? "contained" : "text"}>
                                Waiting
                            </Button>

                        </Box>
                        {
                            courses.filter(course => {
                                    if (filter==="complete") {
                                        return course.completionDate !==null;
                                    }
                                    if (filter==="waiting") {
                                        return course.completionDate === null;
                                    }
                                    return true;
                                }
                            ).map(course =>
                            {
                                return <CourseEntry course={course}/>
                            }
                            )
                        }
                        </>
                    </Paper>

                </Paper>
            </Box>
        </div>
    );
}

export default Learning;