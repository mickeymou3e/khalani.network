import { Box, styled } from '@mui/material'

export const CustomizedHeaderItem = styled(Box)(
  ({ theme }) => `
      height: 100%;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover, &.selected {
         background: ${theme.palette.text.primary};
         border-radius: 99999px;
         .MuiTypography-root {
            color: ${theme.palette.text.secondary}
         }
      } 
   `,
)
