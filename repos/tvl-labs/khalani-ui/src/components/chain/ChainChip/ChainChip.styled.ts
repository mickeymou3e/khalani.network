import { Box, styled } from '@mui/material'

export const CustomizedChip = styled(Box)(
  ({ theme }) => `
      display: flex;
      align-items: center;
      background: ${theme.palette.common.white};
      border-radius: 12px;
      padding: 4px 12px;
      width: max-content;
      gap: 12px;
   `,
)
