import { alpha, Button, styled } from '@mui/material'

export const CustomizedLightButton = styled(Button)(
  ({ theme }) => `
        background: ${theme.palette.elevation.light};
        color: ${theme.palette.common.white};
        height: 42px;
        min-width: auto;
        padding: 10px;
        border-radius: 4px;
        &:hover {
            background: ${alpha(theme.palette.elevation.light as string, 0.7)};
        };
    `,
)
