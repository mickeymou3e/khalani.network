import { Box, styled } from '@mui/material'

export const NetworkItemStyled = styled(Box)(
  ({ theme }) => `
      display: flex;
      align-items: center;
      padding: 8px;
      cursor: pointer;
      border-radius: 12px;
      :hover {
         background-color: ${theme.palette.secondary.main};
      }
  `,
)
