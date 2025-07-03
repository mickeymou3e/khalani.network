import { Dialog, styled } from '@mui/material'

export const CustomizedDialog = styled(Dialog)(
  ({ theme }) => `
    .MuiBackdrop-root {
      background: none;
      backdrop-filter: blur(5px);
    };
    .MuiDialog-paper {
      padding: 16px;
      min-width: 320px;
      ${theme.breakpoints.up('md')} {
          max-width: 520px;
      };
    }
   `,
)
