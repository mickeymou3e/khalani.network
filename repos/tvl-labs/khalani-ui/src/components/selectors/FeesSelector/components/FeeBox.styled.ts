import { Box, styled } from '@mui/material'

export const FeeBoxStyled = styled(Box)(
  ({ theme }) => `
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      background-color: ${theme.palette.elevation.main};
      &.selected {
        background-color: ${theme.palette.primary.main};
      }
  `,
)
