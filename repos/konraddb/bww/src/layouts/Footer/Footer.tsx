import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      height={60}
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="caption">© Copyright BWW</Typography>
    </Box>
  );
}
