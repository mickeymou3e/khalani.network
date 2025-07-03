import { Box, styled } from "@mui/material";

export const ResultContainer = styled(Box)(
  ({ theme }) => `
  padding: 2rem 1.5rem;
  border: 2px dashed ${theme.palette.primary.main};
  border-radius: 8px;
  background-color: ${theme.palette.secondary.main};
  `
);
