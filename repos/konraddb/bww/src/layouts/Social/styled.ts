import { alpha, IconButton, styled } from "@mui/material";

export const FixedNav = styled(IconButton)(
  ({ theme }) => `
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    background: rgba(14, 16, 20, 1);
    display: flex;
    padding: 0;
    border-radius: 12px;
    border: 1px solid ${alpha(theme.palette.primary.main, 0.6)};
    &:hover {
      background: rgba(14, 16, 20, 1);
    }
    svg {
      padding: 0.25rem;
      width: 38px;
      height: 38px;
      cursor: pointer;
    }
  `
);
