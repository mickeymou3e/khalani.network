import { Button, styled } from '@mui/material'

export const ChainLogo = styled(Button)(
  () => `
     border-radius: 9999px;
     min-width: initial;
     padding: 0;
     height: auto;
     border: 1px solid #808080;
     img {
        border-radius: 9999px;
        width: 2rem;
        height: 2rem;
        padding: 0.125rem;
     }
  `,
)
