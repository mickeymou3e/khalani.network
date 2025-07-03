import { Paper, styled } from '@mui/material'

export const TokenBox = styled(Paper)(
  ({ theme }) => `
      background: linear-gradient(180deg, #3B3C51 0%, ${theme.palette.elevation.dark} 100%);
      cursor: pointer;
   `,
)
