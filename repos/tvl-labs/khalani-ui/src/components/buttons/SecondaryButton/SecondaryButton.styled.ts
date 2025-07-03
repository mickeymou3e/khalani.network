import { Button, styled } from '@mui/material'

export const CustomizedSecondaryButton = styled(Button)(
  ({ theme }) => `
    background-color: ${theme.palette.elevation.main};
    color: ${theme.palette.text.secondary};
    border-radius: 9999px;
    border: none;
    height: 40px;
    width: fit-content;
    padding: 8px 20px;
    :hover {
      background-color: ${theme.palette.elevation.main};
    }
  `,
)
