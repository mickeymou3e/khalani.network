import { alpha, Box, styled } from '@mui/material'

export const SelectorItem = styled(Box)(
  ({ theme }) => `
     color: ${theme.palette.elevation.dark};
     display: 'flex';
     width: 100%;
     border-radius: 12px;
     &.selected {
        background-color: ${theme.palette.elevation.dark};
     };
     &:hover {
        background-color: ${alpha(theme.palette.elevation.dark ?? '', 0.1)};
        &.selected {
            background-color: ${theme.palette.elevation.dark};
        };
     }
  `,
)
