import { Paper, styled } from '@mui/material'

export const CustomizedFilteringItem = styled(Paper)(
  () => `
      width: fit-content;
      line-height: initial;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 0;
      .MuiButton-root:hover {
         background: none
      }
   `,
)
