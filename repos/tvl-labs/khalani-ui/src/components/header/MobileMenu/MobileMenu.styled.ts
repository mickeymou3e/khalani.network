import { MenuItem, styled } from '@mui/material'

export const MobileMenuItem = styled(MenuItem)(
  ({ theme }) => `
        background-color: ${theme.palette.elevation.main};
        padding: 24px 0;
        outline: 1px solid ${theme.palette.elevation.light};
        :hover {
            background-color: ${theme.palette.elevation.light};
        };
    `,
)
