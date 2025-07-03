import {
  Box,
  CircularProgress as CircularProgressMui,
  circularProgressClasses,
} from "@mui/material";

import { containerStyle } from "./CircularProgress.styles";

const CircularProgress = () => (
  <Box sx={containerStyle}>
    <CircularProgressMui
      variant="determinate"
      sx={{
        color: "#C9C9CB",
      }}
      size={24}
      thickness={5}
      value={100}
    />
    <CircularProgressMui
      variant="indeterminate"
      disableShrink
      sx={{
        color: (theme) => theme.palette.primary.main,
        animationDuration: "550ms",
        position: "absolute",
        left: 0,
        [`& .${circularProgressClasses.circle}`]: {
          strokeLinecap: "round",
        },
      }}
      size={24}
      thickness={5}
    />
  </Box>
);

export default CircularProgress;
