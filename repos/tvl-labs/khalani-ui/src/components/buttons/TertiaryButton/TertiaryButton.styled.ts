import { alpha, styled } from '@mui/material'

import Button from '../Button'

export const CustomizedTertiaryButton = styled(Button)(
  ({ theme }) => `
      height: auto;
      padding: 6px 8px;
      background-color: ${theme.palette.elevation.light};
      cursor: pointer;
      margin-left: auto;
      color: ${theme.palette.text.primary};
      text-transform: none;
      border-radius: 4px;
      &:hover {
         background-color: ${alpha(
           theme.palette.elevation.light as string,
           0.7,
         )};
      };
   `,
)
