import { Button, styled } from '@mui/material'

export const CustomizedTokenButton = styled(Button)(
  ({ theme }) => `
      background: ${theme.palette.elevation.main};
      box-shadow: none;
      border-radius: 9999px;
      border: none;
      gap: 4px;
      height: 40px;
      min-width: auto;
      width: auto;
      justify-content: space-between;
      padding-left: 8px;
      :hover {
        background-color: ${theme.palette.elevation.main};
      }
     `,
)
