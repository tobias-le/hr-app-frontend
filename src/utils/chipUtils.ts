import { ChipProps } from "@mui/material";
import { stringToColor } from "./colorUtils";

export const createProjectChip = (project: string): ChipProps => ({
  label: project,
  size: "small",
  sx: {
    bgcolor: stringToColor(project),
    color: "white",
    textShadow: "1px 1px 10px lightgray",
  },
});
