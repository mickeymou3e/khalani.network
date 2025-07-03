import { Typography, Paper, Box } from "@mui/material";
import React from "react";
import { ICircleWithTypoProps } from "./CircleWithTypo.types";

const CircleWithTypo: React.FC<ICircleWithTypoProps> = (props) => {
  const { title, content, icon, secondVariant = false } = props;

  return (
    <Paper
      elevation={secondVariant ? 2 : 1}
      sx={{
        padding: 3,
        borderRadius: 2,
        maxWidth: 350,
        minWidth: 280,
        height: "100%",
        width: "100%",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <img src={icon} alt={icon} style={{ width: 80, height: 80 }} />
      </Box>
      {title && (
        <Typography variant="h4" sx={{ mt: 2 }} textAlign="center">
          {title}
        </Typography>
      )}

      <Typography
        variant="body1"
        textAlign="center"
        color={secondVariant ? "text.primary" : "text.secondary"}
        sx={{ mt: title ? 1 : 2 }}
      >
        {content}
      </Typography>
    </Paper>
  );
};

export default CircleWithTypo;
