import { Paper, styled } from '@mui/material'

export const Drawer = styled(Paper)(
  () => `
      position: absolute;
      width:100%;
      height:100%;
      left:0;
      top:0;
      overflow: hidden;
   `,
)
