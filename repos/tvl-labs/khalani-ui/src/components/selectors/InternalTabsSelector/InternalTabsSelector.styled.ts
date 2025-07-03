import { Box, styled } from '@mui/material'

export const CustomizedTabsSelector = styled(Box)(
  ({ theme }) => `
      display: flex;
      .MuiButton-root {
        padding: 12px 32px;
        border: none;
        &:not(.selected) {
          background: inherit;
          &:hover {
            background: ${theme.palette.elevation.main}
          }
        }
      }
    `,
)
