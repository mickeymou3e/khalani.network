import { Box, styled } from '@mui/material'

export const JazzIconElevation = styled(Box)(
  ({ theme }) => `
    border-radius: 28px;
    border: 2px solid ${theme.palette.primary.light};
    padding: 2px;
   `,
)
