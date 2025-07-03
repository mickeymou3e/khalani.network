import { IconButton, Paper, styled } from '@mui/material'

export const Drawer = styled(Paper)(
  () => `
      position: absolute;
      width:100%;
      height:100%;
      left:0;
      top:0;
   `,
)

export const CustomizedCloseButton = styled(IconButton)(
  ({ theme }) => `
      height: 38px;
      border-radius: 8px;
      padding: 11px;
      &:hover {
         background: ${theme.palette.elevation.dark};
      };
    `,
)
