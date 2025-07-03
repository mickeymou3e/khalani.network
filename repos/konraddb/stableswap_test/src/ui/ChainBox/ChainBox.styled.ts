import { Box, styled } from '@mui/material'

export const SelectedChain = styled(Box)(
  () => `
      display: flex;
      align-items: center;
      border-radius: 9999px;
      border: 1px solid;
      padding: 0.25rem 0.5rem;
      .MuiAvatar-root {
         width: 1.5rem;
         height: 1.5rem;
         margin-right: 0.5rem;
      }
   `,
)
