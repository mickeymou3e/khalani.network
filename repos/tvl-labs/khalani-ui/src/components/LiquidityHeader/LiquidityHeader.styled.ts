import { Box, styled } from '@mui/material'

export const RoundedBox = styled(Box)(
  ({ theme }) => `
        width: fit-content;
        display: flex;
        background: ${theme.palette.elevation.main};
        border-radius: 100px;
        padding: 4px;
    `,
)
