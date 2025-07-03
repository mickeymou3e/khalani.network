import { Button, styled } from '@mui/material'

export const CustomizedGreyButton = styled(Button)(
  ({ theme }) => `
        background: ${theme.palette.elevation.light};
        color: ${theme.palette.common.black};
        height: 48px;
        min-width: auto;
        padding: 0;
        border-radius: 16px;
        &:hover {
            background: ${theme.palette.elevation.light};
        };
    `,
)
