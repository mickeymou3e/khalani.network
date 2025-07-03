import { IconButton, styled } from '@mui/material'

export const CustomizedSwapIconButton = styled(IconButton)(
  ({ theme }) => `
        padding: 12px;
        background-color: ${theme.palette.elevation.light};
        &:hover {
          background-color: ${theme.palette.elevation.light};
        }
     `,
)
