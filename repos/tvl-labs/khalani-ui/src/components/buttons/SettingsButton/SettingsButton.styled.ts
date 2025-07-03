import { IconButton, styled } from '@mui/material'

export const CustomizedSettingsButton = styled(IconButton)(
  ({ theme }) => `
        border: 1px solid ${theme.palette.elevation.light};
        background: ${theme.palette.elevation.dark};
        height: 46px;
        border-radius: 8px;
        padding: 11px;
        &:hover {
            background: ${theme.palette.elevation.main};
        };
    `,
)
