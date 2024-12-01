import React, {useEffect, useState} from "react";
import {Learning} from "../types/learning";
import ApiService from "../services/api.service";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import {LoadingSpinner} from "./common/LoadingSpinner";
import {EmptyState} from "./common/EmptyState";
import {format} from "date-fns";
import {FormField} from "./common/FormField";

interface CourseTableProps {
    employeeId:number;
}

const CompletedCoursesTable = ({employeeId}:CourseTableProps) => {
    const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
    const [courses, setCourses] = useState<Learning[]>([]);
    const [currentCourses, setCurrentCourses] = useState<Learning[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>("");

    useEffect(() => {
        setLoading(true);
        ApiService.getUserCompletedCourses(employeeId)
            .then(response => {
                setCourses(response);
                if (response.length===0) {
                    setEmptyMessage("No courses completed");
                } else {
                    setEmptyMessage(null);
                }
            })
            .catch()
            .finally(()=> setLoading(false))
    }, [employeeId]);

    useEffect(() => {
        if (filter.trim()==="") {
            setCurrentCourses(courses);
        } else {
            const nextCourses = courses.filter(course => course.name.includes(filter));
            if (nextCourses.length ===0) {
                setEmptyMessage("No courses matching");
            } else {
                setEmptyMessage(null);
            }
            setCurrentCourses(nextCourses);
        }
    }, [filter]);

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 , mt:3, flexDirection:"column"}}>
            <Typography variant="h6" sx={{mb:3}}>Completed Courses</Typography>
            {loading && <LoadingSpinner/>}
            <TableContainer>
                <FormField name="courseNameFilter" label="Filter" value={filter} onChange={(e)=> setFilter(e.target.value)} />
                <Table data-testid="employees-courses">
                    <TableBody>
                        {currentCourses.map(course => {
                            const enrollment = course.enrolledEmployees.filter( enrollment => enrollment.id.employeeId === employeeId).at(0);
                            return (
                                <TableRow data-testid="employee-course-entry" key={course.learningId}>
                                    <TableCell align="left">{course.name}</TableCell>
                                    <TableCell align="right">{enrollment && format(enrollment.date, "dd.MM.yyyy")}</TableCell>
                                </TableRow>)
                        })
                        }
                    </TableBody>
                </Table>
                {emptyMessage && <EmptyState message={emptyMessage}/>}
            </TableContainer>
        </Box>
    )
}

export default CompletedCoursesTable;