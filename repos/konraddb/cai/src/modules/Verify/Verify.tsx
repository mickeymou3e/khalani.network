import React from "react";
import {
  Box,
  Stack,
  InputLabel,
  InputBase,
  Button,
  Typography,
} from "@mui/material";
import {
  sidebarContainerStyles,
  verifyHeaderStyles,
  subtitleStyles,
  inputLabelStyles,
  inputBaseStyles,
  verifyButtonStyles,
  cancelButtonStyles,
  paginationContainerStyles,
  arrowButtonStyles,
  pageNumberStyles,
  circleStyle,
} from "./styled";

const Verify: React.FC = () => {
  const colors = ["#007A6C", "#0067C7", "#A85100", "#8400B2", "#C3008C"];
  const placeholders = [
    "9 May 2024",
    "100",
    "Liters",
    "Diesel",
    "Supplier ABC, LTD",
  ];

  return (
    <Box sx={sidebarContainerStyles}>
      <Box sx={verifyHeaderStyles}>
        <Typography variant="h5">Verify Document</Typography>
      </Box>

      <Box sx={subtitleStyles}>
        <Typography color="primary.gray2" variant="subtitle">
          Revise and edit your document before verifying it.
        </Typography>
      </Box>

      <Stack sx={{ width: "100%" }}>
        {placeholders.map((placeholder, index) => (
          <Box key={index} sx={{ marginBottom: "1rem" }}>
            <InputLabel sx={inputLabelStyles}>
              <Box sx={circleStyle(colors[index])}>{index + 1}</Box>
              <span style={{ marginLeft: "8px" }}>
                {["Date", "Quantity", "Unit", "Type", "Provider"][index]}
              </span>
            </InputLabel>
            <InputBase
              placeholder={placeholder}
              sx={inputBaseStyles}
              inputProps={{ "aria-label": placeholder }}
            />
          </Box>
        ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <Box sx={paginationContainerStyles}>
            <Box sx={arrowButtonStyles}>{"<"}</Box>
            <Box sx={pageNumberStyles}>1</Box>
            <Box sx={arrowButtonStyles}>{">"}</Box>
          </Box>
        </Box>

        <Button variant="contained" sx={verifyButtonStyles}>
          Verify
        </Button>
        <Button sx={cancelButtonStyles}>Cancel</Button>
      </Stack>
    </Box>
  );
};

export default Verify;
