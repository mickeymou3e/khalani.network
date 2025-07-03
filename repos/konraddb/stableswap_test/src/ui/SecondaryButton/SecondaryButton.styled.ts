import { Button } from '@hadouken-project/ui'
import { styled } from '@mui/material'

export const CustomizedSecondaryButton = styled(Button)(
  ({ theme }) => `
      height: auto;
      padding: 6px 8px;
      background-color: ${theme.palette.background.backgroundBorder};
      cursor: pointer;
      margin-left: auto;
      color: ${theme.palette.text.quaternary};
      text-transform: none;
      border-radius: 3px;
      &:hover: {
         color: ${theme.palette.tertiary.light};
      };
   `,
)
