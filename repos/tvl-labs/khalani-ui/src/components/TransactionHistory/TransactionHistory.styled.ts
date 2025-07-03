import { alpha, Box, styled } from '@mui/material'

export const TransactionHistoryItem = styled(Box)(
  ({ theme }) => `
      background: ${alpha(theme.palette.common.white, 0.02)};
      border-radius: 12px;
      cursor: pointer;
      &:hover {
         background-color: ${theme.palette.elevation.dark as string}
      };
   `,
)
