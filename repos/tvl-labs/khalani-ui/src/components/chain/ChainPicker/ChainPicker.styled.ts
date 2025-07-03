import { Paper, styled } from '@mui/material'

export const CustomizedChainPicker = styled(Paper)(
  () => `
      display: flex;
      flex-wrap: wrap;
      padding: 8px 12px;
      width: 100%;
      gap: 8px;
      min-height: 50px;
      cursor: pointer;
   `,
)
