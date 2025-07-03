import { Popover, styled } from '@mui/material'

export const CustomizedPopover = styled(Popover)(
  ({ theme }) => `
      .MuiPaper-root {
        border-radius: 32px;
        min-width: 260px;
        .item, .selected {
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 12px;
          cursor: pointer;
        }
        .selected, .item:hover {
          background-color: ${theme.palette.secondary.main};
        }
      }
  `,
)
