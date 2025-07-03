import { Box, styled } from '@mui/material'

export const TokenSummaryBox = styled(Box)(
  ({ theme }) => `
        background-color: ${theme.palette.elevation.light};
        border: 1px solid ${theme.palette.elevation.light};
        border-radius: 16px;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
)
