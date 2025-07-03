import { Box } from "@mui/material";
import { styled } from "@mui/system";

export const StyledContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "2rem",
}) as typeof Box;

export const StyledLabelContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.875rem",
});
