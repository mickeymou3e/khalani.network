import { alpha, Box, styled } from '@mui/material'

export const SummaryBoxStyled = styled(Box)(
  ({ theme }) => `
     border: 1px solid ${alpha(theme.palette.text.secondary, 0.05)};
     border-radius: 12px;
  `,
)
