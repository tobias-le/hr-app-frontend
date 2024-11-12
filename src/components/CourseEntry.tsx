import {Course} from "../types/learning";
import {Box, Button, Icon, Typography, Link} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import {format} from "date-fns";
interface CourseEntryProps {
    course: Course
}

const CourseEntry = ({course}: CourseEntryProps) => {
    return (
        <Box sx={{borderBottom: "1px solid lightgray", padding:"5px", display: "flex", flexDirection: "row", justifyContent: "space-between",alignItems:"center"}}>
            <Link underline="hover">
                <a href={course.link} target="_blank" rel="noreferrer">Course #{course.id}</a>
            </Link>
            {course.completionDate?
                <Typography variant="body2" sx={{color:"green"}}>
                    completed on {format(course.completionDate,"dd.MM.yyyy")} <CheckIcon/>
                </Typography> :
                <Button variant="outlined">
                    Mark as completed
                </Button>
            }
        </Box>
    )
}

export default CourseEntry;